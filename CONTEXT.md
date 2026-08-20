# Quirk Domain Model

The developer-first payment infrastructure and routing control plane for African technology companies.

## Language

### Core Entities

**Transaction**:
The top-level record of a merchant's payment intent, identified by an immutable idempotency key.
_Avoid_: Order, invoice, payment attempt

**Charge Attempt**:
A single execution leg against a specific payment rail for a transaction. A transaction may have multiple charge attempts during failover.
_Avoid_: Sub-transaction, split-charge, retry

**Payment Rail**:
An external payment processing network, aggregator, or gateway switch (e.g. Paystack, Flutterwave, Monnify, Squad, M-Pesa).
_Avoid_: Provider, vendor, processor, bank

**Merchant**:
A business entity or technology platform using Quirk to process customer payments.
_Avoid_: User, client, account holder, customer

**Customer**:
The end-user or consumer making a payment to a merchant.
_Avoid_: Buyer, payer, user

### Routing & Policy

**Routing Strategy**:
The rule set governing which payment rail receives an incoming charge attempt.
_Avoid_: Router config, dispatch rule, routing mode

**Dynamic Failover**:
Autonomous shifting of an in-flight transaction to an alternate healthy payment rail when the primary rail experiences elevated latency or errors.
_Avoid_: Fallback, retry loop, error handler

**Circuit State**:
The real-time availability classification of a payment rail (`closed` for healthy, `open` for tripped/degraded, `half-open` for probationary probing).
_Avoid_: Health status, ping score, status dot

### Accounting & Settlements

**Ledger Entry**:
An immutable debit or credit line item in minor currency units recording value transfer across merchant balance accounts.
_Avoid_: Transaction record, balance update, log entry

**Minor Units**:
The smallest non-fractional denomination of a currency (e.g. Kobo for NGN, Cents for USD, Cents for GHS).
_Avoid_: Raw amount, integer amount, pennies
