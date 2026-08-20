# Quirk Repository

- Purpose: Monorepo for Quirk, the developer-first payment infrastructure and control plane for African technology companies.
- Ownership: Root configuration files, CI/CD pipelines, workspace definitions, deployment manifests, and top-level governance.

## Repository Invariants & Core Standards

1. **Brand Identity & Aesthetic**
   - Palette: Clean white/off-white background (`#FFFFFF`, `#F7F7F5`), pure black typography (`#080808`), neutral dark gray (`#666666`), and fine borders (`#E5E5E5`).
   - The primary theme is light with subtle, sophisticated space/orbital routing metaphors.
   - Green is strictly reserved for tiny functional status dots (`• Operational`). Never use green for primary buttons, banners, or decorative backgrounds.
   - Typography: Satoshi for headings, JetBrains Mono for metrics/code/data, Inter for body copy.

2. **Product State & Honesty**
   - User authentication is currently not live. Do not present mock login screens as a publicly usable product.
   - Calls to action must prioritize developer exploration and early partner communication: "Explore the API", "Talk to us", "SDK Reference".
   - Zero fabricated metrics or unsubstantiated transaction volumes.

3. **Monorepo Architecture**
   - Package manager: `pnpm` with workspaces defined in `pnpm-workspace.yaml`.
   - `apps/dashboard`: Vite + React 18 frontend dashboard and public landing site.
   - `apps/api`: Go 1.21 backend routing engine, ledger database, and webhook processor.
   - `packages/sdk`: `@quirk/sdk` TypeScript/JavaScript multi-rail client library.

4. **Security & Cryptography**
   - Provider credentials must never be committed in plaintext or logged.
   - Encryption at rest uses AES-256-GCM hardware security enclave standards.
   - Webhooks require verified HMAC-SHA256 signature checking.
   - Every transaction payload requires deterministic idempotency keys to prevent double-charging.

## Work Guidance

- Before modifying code in any package or subfolder, traverse the DOX tree down to the nearest owning `AGENTS.md`.
- Keep changes modular, preserving existing functionality and route structures.
- All written copy must adhere to the `unslop` writing standard (no AI tells, no em dashes, no puffery, active voice, sentence case headings).

## Verification

```bash
# Build the entire monorepo
pnpm run build

# Typecheck frontend dashboard
pnpm --filter quirk-dashboard build

# Run SDK tests
cd packages/sdk && pnpm test
```

## Child DOX Index

- [apps](./apps/AGENTS.md): Application services (frontend dashboard and Go backend API)
- [packages](./packages/AGENTS.md): Shared libraries and multi-rail SDK packages
