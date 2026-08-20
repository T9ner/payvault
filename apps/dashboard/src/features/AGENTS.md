# Features Subtree

- Purpose: Contains self-contained UI feature modules for the Quirk web application.
- Ownership: All feature components under `src/features/`.

## Local Contracts

1. **Feature Module Boundaries**
   - `landing/`: Public marketing and infrastructure presentation page. Implements the white space-floating aesthetic, interactive architecture diagram, rail ticker, problem-solution flow, audience selector, vision container, and quickstart code block.
   - `insights/`: Deep technical research articles (`insights-data.ts`, `insight-detail.tsx`, and index list).
   - `legal/`: `LegalLayout`, `PrivacyPolicy`, and `TermsOfService` using clean editorial typography.
   - `dashboard/`: Operator metrics, rail health monitoring, and transaction volume charts.
   - `transactions/` (via routes): Multi-rail transaction ledger table, filter tabs, and slide-over detail modal.
   - `fraud/` (via routes): Risk rule configuration, velocity check monitors, and blocked transaction audit logs.
   - `settings/`: Merchant profile, provider API key vaulting, webhook destination endpoints, and appearance configuration.

2. **Styling & Icons Rules**
   - Follow unslop copy guidelines across all titles, descriptions, and tooltips.
   - Use Lucide icons appropriately (e.g. `Route`, `ShieldCheck`, `ArrowRightLeft`, `Timer`, `Activity`). Zero lightning icons (`Zap`).
   - All interactive buttons must have tactile active press states (`active:scale-[0.98]`).

## Work Guidance

- Keep feature state local where possible; lift shared state to `src/stores/` only when accessed across multiple routes.
- When creating new feature dialogs or sheets, use Radix UI dialog primitives styled with the light theme palette (`#FAFAFA` surfaces with `#E5E5E5` borders).

## Verification

```bash
# Typecheck and verify feature modules
pnpm --filter quirk-dashboard build
```

## Child DOX Index

- [dashboard](./dashboard/AGENTS.md): Developer control plane, gateway health matrix, routing simulator, and webhook debugger
- [landing](./landing/AGENTS.md): Landing page components and space infrastructure visuals
- [insights](./insights/AGENTS.md): Architecture research articles and detail renderer
- [legal](./legal/AGENTS.md): Editorial legal layouts and compliance documents
