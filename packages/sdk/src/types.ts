// Payment channels supported across providers
export type PaymentChannel = 'card' | 'bank_transfer' | 'ussd' | 'mobile_money' | 'qr' | 'apple_pay' | 'google_pay';

// Unified transaction status (normalized across all providers)
export type TransactionStatus = 'success' | 'failed' | 'pending' | 'abandoned';

// Currency codes
export type Currency = 'NGN' | 'GHS' | 'KES' | 'ZAR' | 'USD' | 'GBP' | 'EUR' | string;

// Supported provider identifiers
export type ProviderName = 'paystack' | 'flutterwave' | 'monnify' | 'squad' | string;

// Routing & Failover strategies
export type RoutingStrategy = 'dynamic_failover' | 'direct' | 'round_robin';

// Core config for initializing Quirk
export interface QuirkConfig {
  // Single provider configuration (shorthand)
  provider?: ProviderName;
  secretKey?: string;
  publicKey?: string;

  // Multi-provider configuration
  providers?: Partial<Record<ProviderName, string>>;
  publicKeys?: Partial<Record<ProviderName, string>>;
  strategy?: RoutingStrategy;
  fallbackOrder?: ProviderName[];

  currency?: Currency;

  // Smart retry config
  retry?: {
    enabled?: boolean;        // default: true
    maxAttempts?: number;     // default: 3
    backoffMs?: number;       // default: 1000
    retryableStatuses?: number[]; // HTTP status codes to retry on
  };

  // Timeout config
  timeout?: number;           // default: 30000ms

  // Webhook secret for verification
  webhookSecret?: string;
  webhookSecrets?: Partial<Record<ProviderName, string>>;

  // Base URL override (for testing or mock server)
  baseUrl?: string;

  // Custom metadata attached to all transactions
  metadata?: Record<string, any>;
}

// Customer object
export interface Customer {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  metadata?: Record<string, any>;
}

// Normalized Payment creation config
export interface PaymentCreateConfig {
  amount: number;              // In major currency units (e.g., 25000 = ₦25,000 NGN)
  email?: string;
  customer?: Customer;
  currency?: Currency;
  reference?: string;          // Auto-generated if not provided
  channels?: PaymentChannel[]; // Restrict available channels
  callbackUrl?: string;
  strategy?: RoutingStrategy;
  provider?: ProviderName;     // Explicit provider pin
  metadata?: Record<string, any>;

  // Single-subaccount split (simple case)
  split?: {
    subaccountCode: string;
    transactionCharge?: number;
    bearer?: 'account' | 'subaccount';
  };

  // Multi-recipient split (marketplace model)
  multiSplit?: MultiSplitConfig;

  // Idempotency key — prevents duplicate charges on network retries
  idempotencyKey?: string;

  // Subscription plan code
  plan?: string;
}

// Backward-compatible alias
export type TransactionConfig = PaymentCreateConfig;

// Unified transaction result
export interface TransactionResult {
  success: boolean;
  provider: ProviderName;
  authorizationUrl: string;    // Redirect user or open popup here
  accessCode: string;          // Provider's access code
  reference: string;           // Transaction reference
  raw: any;                    // Raw provider response
  routedProvider?: ProviderName;
}

// Direct charge config
export interface ChargeConfig {
  amount: number;
  email: string;
  currency?: Currency;
  reference?: string;
  authorizationCode?: string;  // For recurring charges
  channel: PaymentChannel;
  metadata?: Record<string, any>;
  idempotencyKey?: string;
  card?: {
    number: string;
    expMonth: string;
    expYear: string;
    cvv: string;
    pin?: string;
  };
  bank?: {
    code: string;
    accountNumber: string;
  };
}

// Charge result
export interface ChargeResult {
  success: boolean;
  status: TransactionStatus;
  provider: ProviderName;
  reference: string;
  requiresAuth: boolean;
  authType?: 'pin' | 'otp' | 'redirect' | 'phone' | 'birthday' | 'address' | 'none';
  authUrl?: string;
  authMessage?: string;
  raw: any;
}

// Verification result
export interface VerificationResult {
  success: boolean;
  status: TransactionStatus;
  provider: ProviderName;
  reference: string;
  amount: number;              // In major currency units
  currency: Currency;
  channel: PaymentChannel;
  paidAt: string | null;
  customer: Customer;
  authorization?: {
    code: string;              // For recurring charges
    last4: string;
    expMonth: string;
    expYear: string;
    cardType: string;
    bank: string;
    reusable: boolean;
    countryCode: string;
  };
  fees?: number;
  raw: any;
}

// Refund config
export interface RefundConfig {
  reference: string;           // Original transaction reference
  amount?: number;             // Partial refund amount. Full refund if omitted.
  reason?: string;
  metadata?: Record<string, any>;
}

// Refund result
export interface RefundResult {
  success: boolean;
  provider: ProviderName;
  refundReference: string;
  amount: number;
  currency: Currency;
  status: 'processed' | 'pending' | 'failed';
  raw: any;
}

// Bulk Transfers
export interface BulkTransferRecipient {
  accountNumber: string;
  bankCode: string;
  accountName: string;
  amount: number;
  narration?: string;
  reference?: string;
  currency?: Currency;
}

export interface BulkTransferItem {
  reference: string;
  accountNumber: string;
  bankCode: string;
  accountName: string;
  amount: number;
  currency: string;
  narration?: string;
  status: 'success' | 'failed' | 'pending';
  failureReason?: string;
  providerReference?: string;
}

export interface BulkTransferResult {
  batchReference: string;
  status: 'success' | 'failed' | 'pending';
  items: BulkTransferItem[];
  total: number;
  successCount: number;
  failedCount: number;
  rawResponse?: unknown;
}

export interface BulkTransferConfig {
  recipients: BulkTransferRecipient[];
  title?: string;
  source?: 'balance';
}

// Virtual Accounts
export interface VirtualAccountConfig {
  email: string;
  bvn: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bankCode?: string;
  currency?: Currency;
  reference?: string;
  narration?: string;
  metadata?: Record<string, any>;
}

export interface VirtualAccountResult {
  success: boolean;
  provider: ProviderName;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode?: string;
  currency?: Currency;
  reference: string;
  expiresAt?: string | null;
  raw: any;
}

// Subscriptions
export interface SubscriptionConfig {
  customerEmail?: string;
  email?: string;
  planCode?: string;
  plan?: string;
  startDate?: string;
  authorizationCode?: string;
  metadata?: Record<string, any>;
}

export interface SubscriptionResult {
  success: boolean;
  provider: ProviderName;
  subscriptionCode: string;
  planCode?: string;
  emailToken?: string;
  status: 'active' | 'pending' | 'non-renewing';
  nextPaymentDate?: string | null;
  amount?: number;
  currency?: Currency;
  raw: any;
}

// Multi-Split configuration
export interface SplitRecipient {
  subaccountCode: string;
  share: number;
  shareType?: 'percentage' | 'flat';
}

export interface MultiSplitConfig {
  name: string;
  type: 'percentage' | 'flat';
  currency: Currency;
  recipients: SplitRecipient[];
  bearer?: 'all' | 'account' | 'subaccount';
  bearerType?: 'all' | 'account' | 'subaccount';
}

// Webhook Event
export interface WebhookEvent {
  id: string;
  type: 'charge.success' | 'charge.failed' | 'refund.processed' | 'transfer.success' | 'transfer.failed' | string;
  provider: ProviderName;
  reference: string;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  customer: Customer;
  paidAt?: string | null;
  channel?: PaymentChannel;
  timestamp?: string;
  metadata?: Record<string, any>;
  raw: any;
}

export type WebhookHandler = (event: WebhookEvent) => Promise<void> | void;

// Provider Interface
export interface Provider {
  name: ProviderName;
  initializeTransaction(config: TransactionConfig): Promise<TransactionResult>;
  verifyTransaction(reference: string): Promise<VerificationResult>;
  charge(config: ChargeConfig): Promise<ChargeResult>;
  submitAuthorization(reference: string, auth: { type: string; value: string }): Promise<ChargeResult>;
  refund(config: RefundConfig): Promise<RefundResult>;
  verifyWebhook(payload: string | Buffer, signature: string, secret?: string): boolean;
  parseWebhook(payload: string | Buffer): WebhookEvent;
  bulkTransfer?(config: BulkTransferConfig): Promise<BulkTransferResult>;
  createVirtualAccount?(config: VirtualAccountConfig): Promise<VirtualAccountResult>;
  createSubscription?(config: SubscriptionConfig): Promise<SubscriptionResult>;
  cancelSubscription?(code: string): Promise<{ success: boolean }>;
}
