package services

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"
)

// RoutingStrategy defines the policy governing payment rail selection.
type RoutingStrategy string

const (
	StrategyDynamicFailover RoutingStrategy = "dynamic_failover"
	StrategyDirect          RoutingStrategy = "direct"
	StrategyRoundRobin      RoutingStrategy = "round_robin"
)

// CircuitStatus represents the availability state of an individual payment rail.
type CircuitStatus string

const (
	CircuitClosed   CircuitStatus = "closed"    // Normal operation
	CircuitOpen     CircuitStatus = "open"      // Degraded / Tripped
	CircuitHalfOpen CircuitStatus = "half_open" // Probationary test probe
)

// RailAdapter is the concise seam through which the router communicates with payment rails.
type RailAdapter interface {
	Name() string
	InitiateCharge(ctx context.Context, req ChargeRequest) (*ChargeResponse, error)
	VerifyTransaction(ctx context.Context, providerRef string) (*VerifyResponse, error)
}

// ChargeCommand encapsulates the merchant's payment intent.
type ChargeCommand struct {
	MerchantID     string
	IdempotencyKey string
	AmountKobo     int64
	Currency       string
	Email          string
	CallbackURL    string
	PreferredRail  string
	FallbackRails  []string
	Strategy       RoutingStrategy
	Metadata       map[string]interface{}
}

// ChargeAttemptRecord tracks individual execution legs for observability.
type ChargeAttemptRecord struct {
	Rail       string
	Duration   time.Duration
	Successful bool
	Error      string
}

// TransactionExecutionResult is the output returned from the deep PaymentRouter.
type TransactionExecutionResult struct {
	Success        bool
	Reference      string
	RoutedRail     string
	AuthURL        string
	ProviderRef    string
	Attempts       []ChargeAttemptRecord
	IdempotencyHit bool
}

// CircuitBreaker tracks error counts and state transitions for a single payment rail.
type CircuitBreaker struct {
	failureThreshold int
	cooldownDuration time.Duration
	failureCount     int
	lastFailureTime  time.Time
	status           CircuitStatus
	mu               sync.Mutex
}

func NewCircuitBreaker(failureThreshold int, cooldownDuration time.Duration) *CircuitBreaker {
	return &CircuitBreaker{
		failureThreshold: failureThreshold,
		cooldownDuration: cooldownDuration,
		status:           CircuitClosed,
	}
}

func (cb *CircuitBreaker) AllowRequest() bool {
	cb.mu.Lock()
	defer cb.mu.Unlock()

	if cb.status == CircuitClosed {
		return true
	}

	if cb.status == CircuitOpen {
		if time.Since(cb.lastFailureTime) > cb.cooldownDuration {
			cb.status = CircuitHalfOpen
			return true
		}
		return false
	}

	// Half-open: allow one probe
	return true
}

func (cb *CircuitBreaker) RecordSuccess() {
	cb.mu.Lock()
	defer cb.mu.Unlock()
	cb.failureCount = 0
	cb.status = CircuitClosed
}

func (cb *CircuitBreaker) RecordFailure() {
	cb.mu.Lock()
	defer cb.mu.Unlock()
	cb.failureCount++
	cb.lastFailureTime = time.Now()
	if cb.failureCount >= cb.failureThreshold {
		cb.status = CircuitOpen
	}
}

func (cb *CircuitBreaker) Status() CircuitStatus {
	cb.mu.Lock()
	defer cb.mu.Unlock()
	return cb.status
}

// PaymentRouter is the deep module encapsulating multi-rail failover, latency evaluation, and circuit breaking.
type PaymentRouter struct {
	rails          map[string]RailAdapter
	circuitBreakers map[string]*CircuitBreaker
	fallbackOrder  []string
	mu             sync.RWMutex
}

func NewPaymentRouter(fallbackOrder []string) *PaymentRouter {
	return &PaymentRouter{
		rails:           make(map[string]RailAdapter),
		circuitBreakers: make(map[string]*CircuitBreaker),
		fallbackOrder:   fallbackOrder,
	}
}

func (r *PaymentRouter) RegisterRail(rail RailAdapter) {
	r.mu.Lock()
	defer r.mu.Unlock()
	name := rail.Name()
	r.rails[name] = rail
	r.circuitBreakers[name] = NewCircuitBreaker(3, 10*time.Second)
}

func (r *PaymentRouter) GetRailCircuitStatus(railName string) CircuitStatus {
	r.mu.RLock()
	defer r.mu.RUnlock()
	if cb, ok := r.circuitBreakers[railName]; ok {
		return cb.Status()
	}
	return CircuitClosed
}

// Execute is the single command interface for initiating transactions through the deep router.
func (r *PaymentRouter) Execute(ctx context.Context, cmd ChargeCommand) (*TransactionExecutionResult, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if len(r.rails) == 0 {
		return nil, errors.New("no payment rails registered in router")
	}

	// 1. Determine candidate rails
	var candidateRails []string
	if cmd.Strategy == StrategyDirect && cmd.PreferredRail != "" {
		candidateRails = []string{cmd.PreferredRail}
	} else if cmd.PreferredRail != "" {
		candidateRails = append([]string{cmd.PreferredRail}, cmd.FallbackRails...)
		// Add remaining configured rails if not already in list
		for _, name := range r.fallbackOrder {
			if !contains(candidateRails, name) {
				candidateRails = append(candidateRails, name)
			}
		}
	} else if len(cmd.FallbackRails) > 0 {
		candidateRails = cmd.FallbackRails
	} else {
		candidateRails = r.fallbackOrder
	}

	var attempts []ChargeAttemptRecord
	var lastErr error

	for _, railName := range candidateRails {
		rail, ok := r.rails[railName]
		if !ok {
			continue
		}

		cb := r.circuitBreakers[railName]
		if cb != nil && !cb.AllowRequest() {
			attempts = append(attempts, ChargeAttemptRecord{
				Rail:       railName,
				Successful: false,
				Error:      "circuit breaker open (rail degraded)",
			})
			continue
		}

		start := time.Now()
		ref := cmd.IdempotencyKey
		if ref == "" {
			ref = fmt.Sprintf("qrk_%s_%d", railName, time.Now().UnixNano())
		}

		resp, err := rail.InitiateCharge(ctx, ChargeRequest{
			Reference:   ref,
			AmountKobo:  cmd.AmountKobo,
			Currency:    cmd.Currency,
			Email:       cmd.Email,
			CallbackURL: cmd.CallbackURL,
			Metadata:    cmd.Metadata,
		})

		duration := time.Since(start)

		if err != nil {
			if cb != nil {
				cb.RecordFailure()
			}
			attempts = append(attempts, ChargeAttemptRecord{
				Rail:       railName,
				Duration:   duration,
				Successful: false,
				Error:      err.Error(),
			})
			lastErr = err

			// If caller pinned this rail directly, do not failover
			if cmd.Strategy == StrategyDirect {
				break
			}
			continue
		}

		// Success!
		if cb != nil {
			cb.RecordSuccess()
		}
		attempts = append(attempts, ChargeAttemptRecord{
			Rail:       railName,
			Duration:   duration,
			Successful: true,
		})

		return &TransactionExecutionResult{
			Success:     true,
			Reference:   ref,
			RoutedRail:  railName,
			AuthURL:     resp.AuthURL,
			ProviderRef: resp.ProviderRef,
			Attempts:    attempts,
		}, nil
	}

	if lastErr == nil {
		lastErr = errors.New("all payment rails exhausted or circuit breakers open")
	}

	return &TransactionExecutionResult{
		Success:  false,
		Attempts: attempts,
	}, fmt.Errorf("transaction routing failed: %w", lastErr)
}

func contains(slice []string, val string) bool {
	for _, item := range slice {
		if item == val {
			return true
		}
	}
	return false
}
