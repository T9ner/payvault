# Quirk TypeScript SDK (`quirk-sdk`)

- Purpose: Official TypeScript and JavaScript client library enabling developers to integrate multi-rail African payments with one unified API.
- Ownership: All files in `packages/sdk/src/`, `packages/sdk/package.json`, and test suites.

## Local Contracts

1. **Client Interface Contract**
   - The primary export is the `Quirk` class:
     ```ts
     import { Quirk } from 'quirk-sdk'
     const quirk = new Quirk({
       providers: { paystack: 'sk_...', flutterwave: 'flw_...' },
       strategy: 'dynamic_failover'
     })
     ```
   - Core namespaces:
     - `quirk.payments.create(...)`: Initializes a normalized charge across supported channels (`card`, `bank_transfer`, `virtual_account`, `ussd`, `mobile_money`).
     - `quirk.payments.verify(...)`: Queries verified charge state across underlying switches.
     - `quirk.webhooks.verify(...)`: Cryptographically verifies HMAC-SHA256 event signatures.
     - `quirk.refunds.create(...)`: Initiates full or partial refunds with tracking.
     - `quirk.transfers.bulk(...)`: Batch disbursements across banks.
     - `quirk.virtualAccounts.create(...)`: Dedicated customer accounts.

2. **Deep Architecture & Seams**
   - **Deep `Transport` (`src/transport.ts`)**: Owns all HTTP execution, retry budgets, exponential backoff, timeout handling, and HMAC-SHA256 signature verification.
   - **Pluggable `HttpDriver`**: Accepts `FetchHttpDriver` in production and `InMemoryHttpDriver` in unit tests for zero-network testing.
   - **Pure Wire Mappers (`src/providers/`)**: Stateless request/response mapping functions translating normalized SDK inputs to gateway wire schemas.

3. **Typing & Error Handling**
   - Amounts are integers in minor currency units or major units with converters.
   - All errors derive from `QuirkError` (`AuthenticationError`, `ValidationError`, `ProviderError`, `NetworkError`).

## Verification

```bash
cd packages/sdk

# Run all 173+ tests with Vitest
pnpm test

# Build bundled distribution (CJS, ESM, DTS)
pnpm run build
```
