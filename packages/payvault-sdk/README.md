# payvault-sdk (DEPRECATED)

> **IMPORTANT**: `payvault-sdk` is deprecated and has been rebranded and upgraded to [`quirk-sdk`](https://www.npmjs.com/package/quirk-sdk).

---

## Migration Guide

Please update your package dependencies to `quirk-sdk`:

```bash
npm uninstall payvault-sdk
npm install quirk-sdk
```

### Code Migration

Replace your import statements:

```diff
- import { Payvault } from 'payvault-sdk';
+ import { Quirk } from 'quirk-sdk';

- const payvault = new Payvault({ ... });
+ const quirk = new Quirk({ ... });
```

---

## Why Migrate?

`quirk-sdk` includes:
- **Unified Multi-Rail API**: Access Paystack, Flutterwave, Monnify, and Squad with one client.
- **Autonomous Failover**: Automatic rerouting when underlying provider gateways experience downtime.
- **Modular Namespaces**: `.payments`, `.webhooks`, `.refunds`, `.transfers`, `.virtualAccounts`.
- **Full TypeScript Types**: Complete wire types for requests, responses, and webhook payloads.

Visit the official repository: [https://github.com/T9ner/quirk](https://github.com/T9ner/quirk)
