# Apps Directory

- Purpose: Contains deployable applications, including the customer-facing frontend web dashboard and the core Go backend API service.
- Ownership: High-level application architecture and inter-app communication contracts.

## Local Contracts

1. **Frontend-Backend Contract**
   - The dashboard interacts with the Go API via REST endpoints under `/v1/`.
   - Authorization headers use Bearer tokens: `Authorization: Bearer qrk_live_...` or session tokens.
   - All monetary values are represented as minor currency units (e.g. Kobo for NGN, Cents for USD) as integers/bigints to eliminate floating-point rounding errors.

2. **Deployment Separation**
   - `apps/dashboard` deploys to Vercel as a static SPA bundle. Build command: `pnpm --filter quirk-dashboard build`, output directory: `apps/dashboard/dist`.
   - `apps/api` deploys as a containerized Go binary with multi-stage Docker build.

## Work Guidance

- Ensure changes in one application do not break API envelope schemas expected by the other.
- When updating API response fields, update TypeScript interfaces in `apps/dashboard/src` simultaneously.

## Verification

```bash
# Verify dashboard build
pnpm --filter quirk-dashboard build

# Verify Go API compilation
cd apps/api && go build ./...
```

## Child DOX Index

- [dashboard](./dashboard/AGENTS.md): Vite + React 18 frontend dashboard and public platform
- [api](./api/AGENTS.md): Go backend payment router, ledger engine, and webhook worker
