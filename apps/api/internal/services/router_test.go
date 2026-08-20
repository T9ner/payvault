package services

import (
	"context"
	"errors"
	"testing"
	"time"
)

// SimulatedRail is an in-memory rail adapter used to test the router seam deterministically.
type SimulatedRail struct {
	name             string
	shouldFail       bool
	failureError     error
	chargeCalls      int
	simulatedLatency time.Duration
}

func NewSimulatedRail(name string, shouldFail bool) *SimulatedRail {
	return &SimulatedRail{
		name:         name,
		shouldFail:   shouldFail,
		failureError: errors.New("simulated upstream 503 gateway timeout"),
	}
}

func (s *SimulatedRail) Name() string {
	return s.name
}

func (s *SimulatedRail) InitiateCharge(ctx context.Context, req ChargeRequest) (*ChargeResponse, error) {
	s.chargeCalls++
	if s.simulatedLatency > 0 {
		time.Sleep(s.simulatedLatency)
	}
	if s.shouldFail {
		return nil, s.failureError
	}
	return &ChargeResponse{
		ProviderRef: "sim_ref_" + s.name,
		AuthURL:     "https://checkout.simulated.com/" + s.name + "/" + req.Reference,
		Status:      "pending",
	}, nil
}

func (s *SimulatedRail) VerifyTransaction(ctx context.Context, providerRef string) (*VerifyResponse, error) {
	return &VerifyResponse{
		ProviderRef: providerRef,
		Status:      "success",
		AmountKobo:  500000,
		Currency:    "NGN",
	}, nil
}

func TestPaymentRouter_Execute_PrimarySuccess(t *testing.T) {
	paystack := NewSimulatedRail("paystack", false)
	flutterwave := NewSimulatedRail("flutterwave", false)

	router := NewPaymentRouter([]string{"paystack", "flutterwave"})
	router.RegisterRail(paystack)
	router.RegisterRail(flutterwave)

	ctx := context.Background()
	cmd := ChargeCommand{
		AmountKobo:     2500000,
		Currency:       "NGN",
		Email:          "merchant@company.com",
		IdempotencyKey: "idem_001",
		Strategy:       StrategyDynamicFailover,
	}

	result, err := router.Execute(ctx, cmd)
	if err != nil {
		t.Fatalf("expected charge to succeed, got error: %v", err)
	}

	if !result.Success {
		t.Fatalf("expected result.Success to be true")
	}

	if result.RoutedRail != "paystack" {
		t.Errorf("expected routed rail to be paystack, got %s", result.RoutedRail)
	}

	if paystack.chargeCalls != 1 {
		t.Errorf("expected paystack to be called 1 time, got %d", paystack.chargeCalls)
	}

	if flutterwave.chargeCalls != 0 {
		t.Errorf("expected flutterwave not to be called, got %d", flutterwave.chargeCalls)
	}
}

func TestPaymentRouter_Execute_AutonomousFailover(t *testing.T) {
	paystack := NewSimulatedRail("paystack", true) // Paystack is degraded/failing
	flutterwave := NewSimulatedRail("flutterwave", false)

	router := NewPaymentRouter([]string{"paystack", "flutterwave"})
	router.RegisterRail(paystack)
	router.RegisterRail(flutterwave)

	ctx := context.Background()
	cmd := ChargeCommand{
		AmountKobo:     500000,
		Currency:       "NGN",
		Email:          "user@app.com",
		IdempotencyKey: "idem_failover_001",
		Strategy:       StrategyDynamicFailover,
	}

	result, err := router.Execute(ctx, cmd)
	if err != nil {
		t.Fatalf("expected autonomous failover to succeed, got error: %v", err)
	}

	if result.RoutedRail != "flutterwave" {
		t.Errorf("expected failover to flutterwave, got %s", result.RoutedRail)
	}

	if paystack.chargeCalls != 1 {
		t.Errorf("expected paystack to be attempted once, got %d", paystack.chargeCalls)
	}

	if flutterwave.chargeCalls != 1 {
		t.Errorf("expected flutterwave to be called on failover, got %d", flutterwave.chargeCalls)
	}

	if len(result.Attempts) != 2 {
		t.Errorf("expected 2 attempt records, got %d", len(result.Attempts))
	}
}

func TestPaymentRouter_Execute_CircuitBreakerTrips(t *testing.T) {
	paystack := NewSimulatedRail("paystack", true)
	flutterwave := NewSimulatedRail("flutterwave", false)

	router := NewPaymentRouter([]string{"paystack", "flutterwave"})
	router.RegisterRail(paystack)
	router.RegisterRail(flutterwave)

	ctx := context.Background()

	// 3 consecutive failures will trip the circuit breaker for paystack
	for i := 0; i < 3; i++ {
		cmd := ChargeCommand{
			AmountKobo: 10000,
			Currency:   "NGN",
			Email:      "test@user.com",
			Strategy:   StrategyDynamicFailover,
		}
		_, _ = router.Execute(ctx, cmd)
	}

	if router.GetRailCircuitStatus("paystack") != CircuitOpen {
		t.Errorf("expected paystack circuit breaker to be OPEN after 3 failures")
	}

	// 4th call should immediately bypass Paystack and execute Flutterwave directly
	paystackCallsBefore := paystack.chargeCalls
	cmd := ChargeCommand{
		AmountKobo: 10000,
		Currency:   "NGN",
		Email:      "test@user.com",
		Strategy:   StrategyDynamicFailover,
	}

	result, err := router.Execute(ctx, cmd)
	if err != nil {
		t.Fatalf("expected charge to succeed via healthy rail, got: %v", err)
	}

	if result.RoutedRail != "flutterwave" {
		t.Errorf("expected routed rail to be flutterwave, got %s", result.RoutedRail)
	}

	if paystack.chargeCalls != paystackCallsBefore {
		t.Errorf("expected open circuit to skip calling Paystack")
	}
}
