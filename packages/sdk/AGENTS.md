# Quirk TypeScript SDK (`@quirk/sdk`)

- Purpose: Official TypeScript and JavaScript client library enabling developers to integrate multi-rail African payments with one unified API.
- Ownership: All files in `packages/sdk/src/`, `packages/sdk/package.json`, and test suites.

## Local Contracts

1. **Client Interface Contract**
   - The primary export is the `Quirk` class:
     ```ts
     import { Quirk } from '@quirk/sdk'
     const quirk = new Quirk({ secretKey: 'qrk_secret_...' })
     ```
   - Core namespaces:
     - `quirk.payments.create(...)`: Initializes a normalized charge across supported channels (`card`, `bank_transfer`, `virtual_account`, `ussd`, `mobile_money`).
     - `quirk.payments.verify(...)`: Queries verified charge state across underlying switches.
     - `quirk.webhooks.verify(...)`: Cryptographically verifies HMAC-SHA256 event signatures.
     - `quirk.refunds.create(...)`: Initiates full or partial refunds with tracking.

2. **Typing & Serialization Rules**
   - Amounts are specified as integers in minor currency units (e.g. 25000 for ₦250.00).
   - Supported currencies: `NGN`, `KES`, `GHS`, `USD`, `ZAR`, `TZS`, `UGX`.
   - Strategies: `dynamic_failover` (autonomous fallback), `direct` (specific provider pinning).

3. **Error Handling Architecture**
   - All errors derive from `QuirkError` (e.g. `QuirkAuthenticationError`, `QuirkRateLimitError`, `QuirkPaymentFailedError`, `QuirkSignatureVerificationError`).
   - Every error contains an `errorCode`, `httpStatus`, and underlying `providerDetails` for transparent debugging.

## Verification

```bash
cd packages/sdk

# Run unit and integration tests with Vitest
pnpm test

# Build bundled distribution
pnpm run build
```
