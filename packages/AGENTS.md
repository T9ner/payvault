# Packages Directory

- Purpose: Shared libraries, client SDKs, and reusable utilities distributed across the Quirk ecosystem.
- Ownership: All packages under `packages/`.

## Local Contracts

1. **Library Publishing Standards**
   - Packages must declare explicit exports, bundled TypeScript declarations (`.d.ts`), and clean module entry points in `package.json`.
   - Zero side-effects upon import to support optimal tree-shaking in consumer applications.

2. **Versioning & SemVer**
   - Public libraries follow Semantic Versioning (`MAJOR.MINOR.PATCH`).
   - Breaking changes to public interfaces require a major version bump.

## Verification

```bash
# Test all packages
pnpm --filter "@quirk/*" test
```

## Child DOX Index

- [sdk](./sdk/AGENTS.md): Official `@quirk/sdk` TypeScript client library
