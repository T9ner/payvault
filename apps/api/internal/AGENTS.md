# API Internal Packages

- Purpose: Encapsulates all private Go domain logic, database operations, HTTP middleware, queue processors, and payment provider adapters.
- Ownership: All Go packages under `internal/`.

## Local Contracts

1. **Package Boundaries**
   - `api/`: HTTP route handlers, request validation, and JSON response serialization.
   - `middleware/`: Authentication, rate-limiting, CORS, request logging, and panic recovery.
   - `models/`: Database entity definitions and ledger transaction models.
   - `services/`: Business logic for payment charges, failover evaluation, and refund processing.
   - `database/`: Database connection pooling, transaction helpers, and query execution.
   - `queue/`: Asynchronous background task workers for webhook processing and out-of-band health probing.

2. **Error Handling Conventions**
   - Use structured error types with specific machine-readable error codes (e.g. `ERR_RAIL_DEGRADED`, `ERR_INSUFFICIENT_FUNDS`, `ERR_IDEMPOTENCY_CONFLICT`).
   - Always wrap internal errors with context before propagating up the call stack: `fmt.Errorf("evaluating rail health: %w", err)`.

3. **Concurrency & Locking**
   - Multi-currency ledger postings must acquire row-level locks on currency accounts in deterministic order to eliminate deadlocks.

## Verification

```bash
cd apps/api
go test ./internal/...
```
