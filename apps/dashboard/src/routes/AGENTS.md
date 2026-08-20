# Routes Subtree

- Purpose: TanStack Router file-based route definitions and layouts.
- Ownership: All route files under `src/routes/`.

## Local Contracts

1. **Route Architecture**
   - `__root.tsx`: Top-level application shell with `Outlet`, toaster notifications, and navigation progress.
   - `index.tsx`: Public landing page route (`/`).
   - `insights/index.tsx` & `insights/$slug.tsx`: Architecture research routes.
   - `privacy.tsx` & `terms.tsx`: Legal documentation routes.
   - `_authenticated/route.tsx`: Layout wrapper with sidebar and navigation for operator routes (`/dashboard`, `/transactions`, `/payment-links`, `/fraud`, `/settings`).
   - `(auth)/`: Authentication routes (deprioritized while auth is not live).

2. **Route Generation Rules**
   - Route changes automatically update `src/routeTree.gen.ts` via the Vite TanStack Router plugin.
   - Do not manually edit `routeTree.gen.ts`.
   - Error components: Use `GeneralError` for runtime exceptions and `NotFoundError` for unmatched paths.

## Verification

```bash
pnpm --filter quirk-dashboard build
```
