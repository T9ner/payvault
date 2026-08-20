<div align="center">

# quirk-sdk

### Developer-first payment infrastructure and control plane for African technology companies.

[![npm version](https://img.shields.io/npm/v/quirk-sdk.svg?style=flat-square)](https://www.npmjs.com/package/quirk-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-black?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

**One integration to access cards, bank transfers, virtual accounts, USSD, and mobile money across Africa.**

[Quickstart](#quickstart) &bull; [Namespaces](#namespaces) &bull; [Multi-Rail Failover](#multi-rail-failover) &bull; [Webhooks](#webhooks) &bull; [Virtual Accounts](#virtual-accounts) &bull; [Bulk Transfers](#bulk-transfers)

</div>

---

## Overview

Quirk standardizes heterogeneous African payment rails into a unified, type-safe interface. Integrate once, configure multiple underlying gateways (Paystack, Flutterwave, Monnify, Squad), and execute transactions with automatic failover routing.

- **Unified Interface**: One data model across Paystack, Flutterwave, Monnify, and Squad.
- **Autonomous Failover**: Automatically reroute traffic to healthy backup rails during provider degradation.
- **Normalized Lifecycle**: Collapses 15+ disparate provider states into 4 canonical statuses: `success`, `failed`, `pending`, `abandoned`.
- **Consistent Minor Units**: Amounts are specified as integers in minor currency units (e.g. `25000` for ₦250.00) or major units with utility converters.
- **Zero Configuration Drift**: End-to-end TypeScript definitions for all charges, webhooks, splits, and refunds.

---

## Quickstart

### Installation

```bash
npm install quirk-sdk
# or
pnpm add quirk-sdk
# or
yarn add quirk-sdk
```

### Basic Initialization (Single Provider)

```typescript
import { Quirk } from 'quirk-sdk';

// Initialize with Paystack
const quirk = Quirk.paystack(process.env.PAYSTACK_SECRET_KEY!);

// Create a payment session
const payment = await quirk.payments.create({
  amount: 25000, // ₦25,000 NGN
  email: 'customer@example.com',
  currency: 'NGN',
  metadata: { orderId: 'ord_987654' },
});

console.log(payment.authorizationUrl);
// => "https://checkout.paystack.com/..."
```

---

## Multi-Rail Failover

Configure multiple payment providers simultaneously. When configured with `dynamic_failover`, Quirk executes the transaction on the primary provider and automatically falls back to secondary rails if network or gateway errors occur.

```typescript
import { Quirk } from '@quirk/sdk';

const quirk = new Quirk({
  providers: {
    paystack: process.env.PAYSTACK_SECRET_KEY!,
    flutterwave: process.env.FLUTTERWAVE_SECRET_KEY!,
    monnify: process.env.MONNIFY_API_KEY!,
  },
  strategy: 'dynamic_failover',
  fallbackOrder: ['paystack', 'flutterwave', 'monnify'],
});

// Creates payment with autonomous failover protection
const payment = await quirk.payments.create({
  amount: 50000,
  email: 'finance@enterprise.com',
  currency: 'NGN',
});

console.log(`Routed through: ${payment.routedProvider}`);
```

---

## Core Namespaces

### 1. Payments (`quirk.payments`)

#### Initialize a Payment
```typescript
const payment = await quirk.payments.create({
  amount: 10000,
  email: 'alex@company.com',
  currency: 'NGN',
  channels: ['card', 'bank_transfer', 'ussd'],
  callbackUrl: 'https://app.example.com/checkout/callback',
  idempotencyKey: 'idemp_txn_10293847',
});
```

#### Verify a Payment
```typescript
const result = await quirk.payments.verify('qrk_ref_123456');

if (result.status === 'success') {
  console.log(`Verified payment of ${result.amount} ${result.currency}`);
  console.log(`Channel: ${result.channel}`);
  console.log(`Customer: ${result.customer.email}`);
}
```

#### Direct Charge (Recurring Token)
```typescript
const charge = await quirk.payments.charge({
  amount: 15000,
  email: 'alex@company.com',
  channel: 'card',
  authorizationCode: 'AUTH_token_abc123',
});
```

---

### 2. Webhooks (`quirk.webhooks`)

Cryptographically verify HMAC-SHA256 signatures before processing event payloads.

```typescript
import express from 'express';
import { Quirk } from '@quirk/sdk';

const app = express();
const quirk = Quirk.paystack(process.env.PAYSTACK_SECRET_KEY!, {
  webhookSecret: process.env.QUIRK_WEBHOOK_SECRET,
});

app.post('/api/webhooks', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-paystack-signature'] as string;

  // Cryptographic signature check
  const isValid = quirk.webhooks.verify(req.body, signature);
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  // Parse into normalized event
  const event = quirk.webhooks.parse(req.body);

  if (event.type === 'charge.success') {
    console.log(`Received ${event.amount} ${event.currency} for ${event.reference}`);
    // Fulfill customer order
  }

  res.status(200).json({ received: true });
});
```

---

### 3. Dedicated Virtual Accounts (`quirk.virtualAccounts`)

Provision persistent bank accounts for automated customer deposit reconciliation.

```typescript
const account = await quirk.virtualAccounts.create({
  email: 'merchant@company.com',
  bvn: '22198765432',
  firstName: 'Amaka',
  lastName: 'Obi',
  phone: '+2348012345678',
});

console.log(`Account Number: ${account.accountNumber}`);
console.log(`Bank: ${account.bankName}`);
```

---

### 4. Bulk Transfers & Payouts (`quirk.transfers`)

Disburse funds to multiple bank accounts in a single batch.

```typescript
const batch = await quirk.transfers.bulk({
  title: 'March 2026 Merchant Payouts',
  recipients: [
    {
      accountNumber: '0123456789',
      bankCode: '058',
      accountName: 'Folake Adeyemi',
      amount: 150000,
      narration: 'Merchant settlement #104',
    },
    {
      accountNumber: '9876543210',
      bankCode: '063',
      accountName: 'Chidi Okafor',
      amount: 220000,
      narration: 'Merchant settlement #105',
    },
  ],
});

console.log(`Batch ID: ${batch.batchReference}`);
console.log(`Successful dispatches: ${batch.successCount}`);
```

---

### 5. Refunds (`quirk.refunds`)

Initiate full or partial transaction refunds.

```typescript
const refund = await quirk.refunds.create({
  reference: 'qrk_ref_123456',
  amount: 5000, // Optional partial amount; omits for full refund
  reason: 'Customer return',
});

console.log(`Refund status: ${refund.status}`);
```

---

## Drop-in Checkout Widget

`@quirk/sdk` includes a drop-in browser checkout modal matching Quirk's minimal black and white aesthetic.

```html
<link rel="stylesheet" href="node_modules/@quirk/sdk/checkout/quirk-checkout.css" />
<script src="node_modules/@quirk/sdk/checkout/quirk-checkout.js"></script>

<script>
  const checkout = new QuirkCheckout({
    key: 'pk_live_xxxxx',
    amount: 25000,
    currency: 'NGN',
    email: 'alex@example.com',
    onSuccess: function(response) {
      console.log('Payment successful:', response.reference);
    },
    onClose: function() {
      console.log('Checkout closed');
    }
  });

  document.getElementById('pay-btn').addEventListener('click', () => {
    checkout.open();
  });
</script>
```

---

## Error Handling

All SDK exceptions derive from `QuirkError`, providing standard error codes, HTTP status codes, and provider diagnostics.

```typescript
import { Quirk, QuirkError } from '@quirk/sdk';

try {
  const result = await quirk.payments.create({ ... });
} catch (error) {
  if (error instanceof QuirkError) {
    console.error(`Error Code: ${error.code}`);
    console.error(`HTTP Status: ${error.httpStatus}`);
    console.error(`Provider: ${error.provider}`);
    console.error(`Underlying details:`, error.providerDetails);
  }
}
```

---

## Verification & Testing

```bash
# Run complete test suite (160+ unit & integration tests)
pnpm test

# Build CJS, ESM, and TypeScript declarations
pnpm run build
```

---

## License

MIT © [Quirk](https://github.com/T9ner/quirk)
