# Dashboard & Control Plane Feature Module

- Purpose: Interactive developer control plane, gateway telemetry health monitor, routing rule builder, webhook inspector, and multi-currency ledger for companies integrating Quirk.
- Ownership: `apps/dashboard/src/features/dashboard/` and its component suite.

## Local Components & Architecture

1. **`GatewayHealthMatrix` (`components/gateway-health-matrix.tsx`)**
   - Real-time latency (ms), 24h success rate (%), and 30-day uptime metrics across Paystack, Flutterwave, Monnify, and Squad.
   - Interactive live ping simulator with instant telemetry updates.

2. **`RoutingRuleBuilder` (`components/routing-rule-builder.tsx`)**
   - Autonomous fallback sequence configurator (`fallbackOrder`).
   - Conditional threshold rules (amount triggers, currency routing, channel routing).
   - Real-time interactive routing simulator providing live execution traces and fee estimations.

3. **`WebhookDebugger` (`components/webhook-debugger.tsx`)**
   - Ingested event log table with HTTP response codes, latency, and status badges.
   - JSON payload inspector with instant copy functionality.
   - HMAC-SHA256 signature verifier and 1-click test event replay dispatcher.

4. **`IntegrationSandbox` (`components/integration-sandbox.tsx`)**
   - Multi-language SDK code generator (TypeScript, Python, cURL, Go).
   - Drop-in checkout preview modal showcasing card, bank transfer, and USSD payment flows.

5. **`Dashboard` (`index.tsx`)**
   - Central control plane view integrating top-level navigation tabs across overview metrics, gateway health, smart routing, webhook debugging, and SDK integration.

## Verification

```bash
# Typecheck and build dashboard module
pnpm --filter quirk-dashboard build
```
