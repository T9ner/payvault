# Payvault SDK Bridge (`payvault-sdk`)

- Purpose: Deprecated transition package forwarding legacy Payvault integrations to `quirk-sdk`.
- Ownership: Files in `packages/payvault-sdk/`.

## Local Contracts

1. **Deprecation Behavior**
   - Emits a non-fatal `console.warn` upon runtime import directing users to `quirk-sdk`.
   - Re-exports the complete `quirk-sdk` interface (`Quirk`, `Payvault`, `PayvaultClient`, types).

2. **Publishing**
   - Published as `payvault-sdk@1.0.0` on npm.
   - Deprecated via `npm deprecate payvault-sdk`.
