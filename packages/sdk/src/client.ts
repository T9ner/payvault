import type {
  QuirkConfig,
  Provider,
  TransactionConfig,
  PaymentCreateConfig,
  TransactionResult,
  VerificationResult,
  ChargeConfig,
  ChargeResult,
  RefundConfig,
  RefundResult,
  WebhookEvent,
  WebhookHandler,
  SubscriptionConfig,
  SubscriptionResult,
  BulkTransferConfig,
  BulkTransferResult,
  VirtualAccountConfig,
  VirtualAccountResult,
  TransactionStatus,
  ProviderName,
} from './types';
import { PaystackProvider } from './providers/paystack';
import { FlutterwaveProvider } from './providers/flutterwave';
import { MonnifyProvider } from './providers/monnify';
import { SquadProvider } from './providers/squad';
import { RailEngine } from './transport/rail-engine';
import { QuirkError } from './errors';
import { sleep } from './utils';

// Built-in Provider registry
const BUILTIN_PROVIDERS: Record<string, new (config: QuirkConfig) => Provider> = {
  paystack: PaystackProvider,
  flutterwave: FlutterwaveProvider,
  monnify: MonnifyProvider,
  squad: SquadProvider,
};

export class Quirk {
  public primaryProvider: Provider;
  public provider: Provider;
  private providers: Map<ProviderName, Provider> = new Map();
  private railEngine: RailEngine;
  private config: QuirkConfig;
  private webhookHandlers: Map<string, WebhookHandler[]> = new Map();

  /** Register a custom provider class */
  static registerProvider(name: string, providerClass: new (config: QuirkConfig) => Provider): void {
    BUILTIN_PROVIDERS[name] = providerClass;
  }

  /** The active primary provider name */
  get providerName(): ProviderName | string {
    return this.config.provider || (this.providers.keys().next().value as ProviderName);
  }

  // Namespaces
  public readonly payments: {
    create: (config: PaymentCreateConfig) => Promise<TransactionResult>;
    verify: (reference: string) => Promise<VerificationResult>;
    charge: (config: ChargeConfig) => Promise<ChargeResult>;
    submitAuth: (reference: string, auth: { type: string; value: string }) => Promise<ChargeResult>;
    poll: (reference: string, options?: { intervalMs?: number; maxWaitMs?: number; onPoll?: (attempt: number, status: TransactionStatus) => void }) => Promise<VerificationResult>;
  };

  public readonly webhooks: {
    verify: (payload: string | Buffer, signature: string, secret?: string) => boolean;
    parse: (payload: string | Buffer) => WebhookEvent;
    handle: (payload: string | Buffer, signature: string) => Promise<WebhookEvent>;
    on: (eventType: string, handler: WebhookHandler) => void;
  };

  public readonly refunds: {
    create: (config: RefundConfig) => Promise<RefundResult>;
  };

  public readonly transfers: {
    bulk: (config: BulkTransferConfig) => Promise<BulkTransferResult>;
  };

  public readonly virtualAccounts: {
    create: (config: VirtualAccountConfig) => Promise<VirtualAccountResult>;
  };

  public readonly subscriptions: {
    create: (config: SubscriptionConfig) => Promise<SubscriptionResult>;
    cancel: (code: string) => Promise<{ success: boolean }>;
  };

  constructor(config: QuirkConfig) {
    this.config = config;

    // Handle multi-provider map vs single provider config
    if (config.providers && Object.keys(config.providers).length > 0) {
      for (const [name, secretKey] of Object.entries(config.providers)) {
        if (!secretKey) continue;
        const ProviderClass = BUILTIN_PROVIDERS[name];
        if (ProviderClass) {
          const providerInstance = new ProviderClass({
            provider: name,
            secretKey,
            publicKey: config.publicKeys?.[name],
            webhookSecret: config.webhookSecrets?.[name] || config.webhookSecret,
            currency: config.currency,
            baseUrl: config.baseUrl,
            timeout: config.timeout,
            retry: config.retry,
            metadata: config.metadata,
          });
          this.providers.set(name, providerInstance);
        }
      }

      // First configured provider or explicit provider is primary
      const primaryName = config.provider || Object.keys(config.providers)[0];
      const selected = this.providers.get(primaryName);
      if (!selected) {
        throw new QuirkError(`Configured primary provider "${primaryName}" not found in providers map.`, {
          code: 'INVALID_PROVIDER',
          provider: primaryName,
        });
      }
      this.primaryProvider = selected;
    } else if (config.provider && config.secretKey) {
      const ProviderClass = BUILTIN_PROVIDERS[config.provider];
      if (!ProviderClass) {
        throw new QuirkError(
          `Unknown provider: ${config.provider}. Available: ${Object.keys(BUILTIN_PROVIDERS).join(', ')}`,
          {
            code: 'INVALID_PROVIDER',
            provider: config.provider,
          }
        );
      }
      this.primaryProvider = new ProviderClass(config);
      this.providers.set(config.provider, this.primaryProvider);
    } else {
      throw new QuirkError(
        'Invalid Quirk configuration: provide either { provider, secretKey } or { providers: { ... } }',
        { code: 'INVALID_CONFIG' }
      );
    }

    this.provider = this.primaryProvider;

    // Initialize Deep Multi-Rail Transport Engine
    const primaryName = config.provider || (this.providers.keys().next().value as ProviderName);
    this.railEngine = new RailEngine(this.providers, primaryName, config);

    // Initialize Payments Namespace with deep failover seam
    this.payments = {
      create: async (paymentConfig: PaymentCreateConfig): Promise<TransactionResult> => {
        return this.railEngine.execute(
          async (prov, railName) => {
            const res = await prov.initializeTransaction(paymentConfig);
            return {
              ...res,
              routedProvider: railName,
            };
          },
          {
            preferredRail: paymentConfig.provider,
            allowFailover: (paymentConfig.strategy || this.config.strategy) === 'dynamic_failover',
            operationName: 'initialize transaction',
          }
        );
      },

      verify: async (reference: string): Promise<VerificationResult> => {
        return this.railEngine.execute(
          async (prov) => prov.verifyTransaction(reference),
          { operationName: 'verify transaction' }
        );
      },

      charge: async (chargeConfig: ChargeConfig): Promise<ChargeResult> => {
        return this.railEngine.execute(
          async (prov) => prov.charge(chargeConfig),
          { operationName: 'charge customer' }
        );
      },

      submitAuth: async (reference: string, auth: { type: string; value: string }): Promise<ChargeResult> => {
        return this.railEngine.execute(
          async (prov) => prov.submitAuthorization(reference, auth),
          { operationName: 'submit authorization' }
        );
      },

      poll: async (reference: string, options) => {
        return this.pollVerification(reference, options);
      },
    };

    // Initialize Webhooks Namespace
    this.webhooks = {
      verify: (payload: string | Buffer, signature: string, secret?: string) => {
        return this.verifyWebhook(payload, signature, secret);
      },
      parse: (payload: string | Buffer) => {
        return this.parseWebhook(payload);
      },
      handle: (payload: string | Buffer, signature: string) => {
        return this.handleWebhook(payload, signature);
      },
      on: (eventType: string, handler: WebhookHandler) => {
        this.on(eventType, handler);
      },
    };

    // Initialize Refunds Namespace
    this.refunds = {
      create: async (refundConfig: RefundConfig): Promise<RefundResult> => {
        return this.railEngine.execute(
          async (prov) => prov.refund(refundConfig),
          { operationName: 'process refund' }
        );
      },
    };

    // Initialize Transfers Namespace
    this.transfers = {
      bulk: async (bulkConfig: BulkTransferConfig): Promise<BulkTransferResult> => {
        return this.bulkTransfer(bulkConfig);
      },
    };

    // Initialize Virtual Accounts Namespace
    this.virtualAccounts = {
      create: async (vaConfig: VirtualAccountConfig): Promise<VirtualAccountResult> => {
        return this.railEngine.execute(
          async (prov) => {
            if (!prov.createVirtualAccount) {
              throw new QuirkError(`Provider does not support virtual accounts.`);
            }
            return prov.createVirtualAccount(vaConfig);
          },
          { operationName: 'create virtual account' }
        );
      },
    };

    // Initialize Subscriptions Namespace
    this.subscriptions = {
      create: async (subConfig: SubscriptionConfig): Promise<SubscriptionResult> => {
        return this.createSubscription(subConfig);
      },
      cancel: async (code: string) => {
        return this.cancelSubscription(code);
      },
    };
  }

  // ========== STATIC FACTORY METHODS ==========

  /** Create a Quirk instance configured for Paystack */
  static paystack(
    secretKey: string,
    options?: Partial<Omit<QuirkConfig, 'provider' | 'secretKey'>>
  ): Quirk {
    return new Quirk({ provider: 'paystack', secretKey, ...options });
  }

  /** Create a Quirk instance configured for Flutterwave */
  static flutterwave(
    secretKey: string,
    options?: Partial<Omit<QuirkConfig, 'provider' | 'secretKey'>>
  ): Quirk {
    return new Quirk({ provider: 'flutterwave', secretKey, ...options });
  }

  /** Create a Quirk instance configured for Monnify */
  static monnify(
    apiKey: string,
    secretKey: string,
    contractCode: string,
    options?: Partial<Omit<QuirkConfig, 'provider' | 'secretKey'>>
  ): Quirk {
    return new Quirk({
      provider: 'monnify',
      secretKey,
      metadata: { ...options?.metadata, apiKey, contractCode },
      ...options,
    });
  }

  /** Create a Quirk instance configured for Squad */
  static squad(
    secretKey: string,
    options?: Partial<Omit<QuirkConfig, 'provider' | 'secretKey'>>
  ): Quirk {
    return new Quirk({ provider: 'squad', secretKey, ...options });
  }

  // ========== CORE TRANSACTION METHODS (FLAT COMPATIBILITY) ==========

  /**
   * Initialize a new payment transaction.
   * @see {@link payments.create}
   */
  async initializeTransaction(config: TransactionConfig): Promise<TransactionResult> {
    return this.payments.create(config);
  }

  /**
   * Verify the status of a transaction by its reference.
   * @see {@link payments.verify}
   */
  async verifyTransaction(reference: string): Promise<VerificationResult> {
    return this.payments.verify(reference);
  }

  /**
   * Direct charge with card/account credentials.
   * @see {@link payments.charge}
   */
  async charge(config: ChargeConfig): Promise<ChargeResult> {
    return this.payments.charge(config);
  }

  /**
   * Submit 2FA authorization (OTP, PIN, Phone).
   * @see {@link payments.submitAuth}
   */
  async submitAuthorization(
    reference: string,
    auth: { type: string; value: string }
  ): Promise<ChargeResult> {
    return this.payments.submitAuth(reference, auth);
  }

  /**
   * Process a refund for a successful transaction.
   * @see {@link refunds.create}
   */
  async refund(config: RefundConfig): Promise<RefundResult> {
    return this.refunds.create(config);
  }

  /**
   * Initiate a bulk transfer to multiple recipients.
   * @see {@link transfers.bulk}
   */
  async bulkTransfer(config: BulkTransferConfig): Promise<BulkTransferResult> {
    if (this.primaryProvider.bulkTransfer) {
      return this.primaryProvider.bulkTransfer(config);
    }
    throw new QuirkError('Provider does not support bulk transfers', {
      code: 'UNSUPPORTED_OPERATION',
      provider: this.config.provider,
    });
  }

  /**
   * Create a dedicated/dynamic virtual account.
   * @see {@link virtualAccounts.create}
   */
  async createVirtualAccount(config: VirtualAccountConfig): Promise<VirtualAccountResult> {
    if (this.primaryProvider.createVirtualAccount) {
      return this.primaryProvider.createVirtualAccount(config);
    }
    throw new QuirkError('Provider does not support virtual accounts', {
      code: 'UNSUPPORTED_OPERATION',
      provider: this.config.provider,
    });
  }

  /**
   * Create a recurring subscription plan.
   * @see {@link subscriptions.create}
   */
  async createSubscription(config: SubscriptionConfig): Promise<SubscriptionResult> {
    if (this.primaryProvider.createSubscription) {
      return this.primaryProvider.createSubscription(config);
    }
    throw new QuirkError('Provider does not support subscriptions', {
      code: 'NOT_SUPPORTED',
      provider: this.config.provider,
    });
  }

  /**
   * Cancel an active recurring subscription.
   * @see {@link subscriptions.cancel}
   */
  async cancelSubscription(code: string): Promise<{ success: boolean }> {
    if (this.primaryProvider.cancelSubscription) {
      return this.primaryProvider.cancelSubscription(code);
    }
    throw new QuirkError('Provider does not support subscriptions', {
      code: 'NOT_SUPPORTED',
      provider: this.config.provider,
    });
  }

  /**
   * Poll transaction status until terminal status or timeout.
   */
  async pollVerification(
    reference: string,
    options?: {
      intervalMs?: number;
      maxWaitMs?: number;
      onPoll?: (attempt: number, status: TransactionStatus) => void;
    }
  ): Promise<VerificationResult> {
    const intervalMs = options?.intervalMs ?? 3000;
    const maxWaitMs = options?.maxWaitMs ?? 60000;
    const startTime = Date.now();
    let attempt = 0;

    while (Date.now() - startTime < maxWaitMs) {
      attempt++;
      const result = await this.verifyTransaction(reference);
      options?.onPoll?.(attempt, result.status);

      if (result.status === 'success' || result.status === 'failed') {
        return result;
      }

      await sleep(intervalMs);
    }

    throw new QuirkError(`Verification polling timed out after ${maxWaitMs}ms`, {
      code: 'POLLING_TIMEOUT',
      raw: { reference },
    });
  }

  // ========== WEBHOOK METHODS ==========

  verifyWebhook(payload: string | Buffer, signature: string, secret?: string): boolean {
    return this.primaryProvider.verifyWebhook(payload, signature, secret);
  }

  parseWebhook(payload: string | Buffer): WebhookEvent {
    return this.primaryProvider.parseWebhook(payload);
  }

  async handleWebhook(payload: string | Buffer, signature: string): Promise<WebhookEvent> {
    const isValid = this.verifyWebhook(payload, signature);
    if (!isValid) {
      throw new QuirkError('Invalid webhook signature', {
        code: 'INVALID_SIGNATURE',
        provider: this.config.provider,
      });
    }

    const event = this.parseWebhook(payload);

    const handlers = this.webhookHandlers.get(event.type) || [];
    const wildcardHandlers = this.webhookHandlers.get('*') || [];
    const allHandlers = [...handlers, ...wildcardHandlers];

    await Promise.all(allHandlers.map((handler) => handler(event)));

    return event;
  }

  on(eventType: string, handler: WebhookHandler): this {
    const existing = this.webhookHandlers.get(eventType) || [];
    this.webhookHandlers.set(eventType, [...existing, handler]);
    return this;
  }

  off(eventType: string, handler: WebhookHandler): this {
    const existing = this.webhookHandlers.get(eventType) || [];
    this.webhookHandlers.set(
      eventType,
      existing.filter((h) => h !== handler)
    );
    return this;
  }
}
