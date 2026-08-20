# Quirk API Service

- Purpose: High-performance Go backend service responsible for payment orchestration, dynamic rail routing, webhook ingestion, and multi-currency ledger management.
- Ownership: Go source files in `cmd/` and `internal/`, Dockerfile, and database migrations.

## Local Contracts

1. **Service Architecture**
   - Language: Go 1.21+.
   - Framework: Standard library `net/http` or lightweight router (`chi` / `gin`).
   - Database: PostgreSQL (primary transactional and ledger storage) with migrations in `migrations/`.
   - Caching & Queues: Redis for rate-limiting, circuit breaker state tracking, and asynchronous webhook dispatch.

2. **Core Invariants**
   - Idempotency: All payment endpoints require an `Idempotency-Key` header. Duplicate requests with identical keys must return the cached execution result without re-charging.
   - Provider Isolation: Gateway integrations (Paystack, Flutterwave, Monnify, Squad, M-Pesa) are encapsulated in dedicated provider drivers implementing a common `PaymentProvider` interface.
   - Failover Strategy: Health probing checks gateway latency and error rates every 1,500ms. If p95 latency exceeds 350ms or 5xx errors increase, the router autonomously reroutes in-flight sessions to alternate healthy rails.

3. **Security Standards**
   - All inbound webhooks must verify HMAC signatures using provider secret keys stored in the hardware vault.
   - Secrets are loaded into memory only during request execution and cleared immediately after.

## Verification

```bash
cd apps/api

# Build binary
go build ./cmd/api

# Run unit tests
go test -v ./...
```

## Child DOX Index

- [internal](./internal/AGENTS.md): Core backend services, database models, middleware, and provider drivers
