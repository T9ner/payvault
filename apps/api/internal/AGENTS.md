# API Internal Packages

- Purpose: Encapsulates private Go domain logic, database operations, HTTP middleware, queue processors, and payment provider adapters.
- Ownership: All Go packages under `internal/`.

## Local Contracts

1. **Package Boundaries & Deep Seams**
   - `services/router.go`: Deep `PaymentRouter` module. Single `Execute(ctx, ChargeCommand)` command interface handling circuit breaking, latency sampling, and failover transitions.
   - `services/router.go (RailAdapter)`: Minimal seam for payment rails (`Charge(ctx, req) -> (*ChargeResponse, error)`). Tested with `SimulatedRail`.
   - `api/`: HTTP route handlers, request validation, and JSON serialization.
   - `middleware/`: Authentication, rate-limiting, CORS, request logging, and panic recovery.
   - `models/`: Database entity definitions and ledger transaction models.
   - `database/`: Database connection pooling, transaction helpers, and query execution.
   - `queue/`: Asynchronous background task workers for webhook processing and out-of-band health probing.

2. **Error Handling & Concurrency**
   - Multi-rail failover evaluates circuit breaker status before dispatching to backup rails.
   - All errors use typed error wrapping: `fmt.Errorf("transaction routing failed: %w", err)`.
   - Multi-currency ledger postings acquire row-level locks on currency accounts in deterministic order.

## Verification

```bash
cd apps/api

# Run router unit tests with SimulatedRail
go test -v -run "TestPaymentRouter" ./internal/services/...

# Run all internal package tests
go test ./internal/...
```
