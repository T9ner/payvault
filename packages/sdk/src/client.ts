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
  private primaryProvider: Provider;
  private provider: Provider;
  private providers: Map<ProviderName, Provider> = new Map();
  private config: QuirkConfig;
  private webhookHandlers: Map<string, WebhookHandler[]> = new Map();

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

    // Initialize Payments Namespace
    this.payments = {
      create: async (paymentConfig: PaymentCreateConfig): Promise<TransactionResult> => {
        // If an explicit provider is requested or strategy is direct, use that provider
        if (paymentConfig.provider) {
          const prov = this.providers.get(paymentConfig.provider);
          if (!prov) {
            throw new QuirkError(`Provider "${paymentConfig.provider}" not configured in this Quirk instance.`, {
              code: 'PROVIDER_NOT_CONFIGURED',
              provider: paymentConfig.provider,
            });
          }
          return prov.initializeTransaction(paymentConfig);
        }

        // Handle Dynamic Failover if multiple providers are configured
        const isDynamicFailover = (paymentConfig.strategy || this.config.strategy) === 'dynamic_failover' && this.providers.size > 1;

        if (isDynamicFailover) {
          const providerOrder = this.config.fallbackOrder || Array.from(this.providers.keys());
          let lastError: any = null;

          for (const provName of providerOrder) {
            const prov = this.providers.get(provName);
            if (!prov) continue;

            try {
              const res = await prov.initializeTransaction(paymentConfig);
              return {
                ...res,
                routedProvider: provName,
              };
            } catch (err: any) {
              lastError = err;
              // Failover on network or provider error
              continue;
            }
          }

          throw lastError || new QuirkError('All configured payment rails failed to initialize transaction.', {
            code: 'FAILOVER_EXHAUSTED',
          });
        }

        // Standard primary provider execution
        return this.primaryProvider.initializeTransaction(paymentConfig);
      },

      verify: async (reference: string): Promise<VerificationResult> => {
        return this.primaryProvider.verifyTransaction(reference);
      },

      charge: async (chargeConfig: ChargeConfig): Promise<ChargeResult> => {
        return this.primaryProvider.charge(chargeConfig);
      },

      submitAuth: async (reference: string, auth: { type: string; value: string }): Promise<ChargeResult> => {
        return this.primaryProvider.submitAuthorization(reference, auth);
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
        return this.primaryProvider.refund(refundConfig);
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
        return this.createVirtualAccount(vaConfig);
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
    secretKey: string,
    options?: Partial<Omit<QuirkConfig, 'provider' | 'secretKey'>>
  ): Quirk {
    return new Quirk({ provider: 'monnify', secretKey, ...options });
  }

  /** Create a Quirk instance configured for Squad */
  static squad(
    secretKey: string,
    options?: Partial<Omit<QuirkConfig, 'provider' | 'secretKey'>>
  ): Quirk {
    return new Quirk({ provider: 'squad', secretKey, ...options });
  }

  // ========== BACKWARD-COMPATIBLE METHODS ==========

  async initializeTransaction(config: TransactionConfig): Promise<TransactionResult> {
    return this.payments.create(config);
  }

  async verifyTransaction(reference: string): Promise<VerificationResult> {
    return this.payments.verify(reference);
  }

  async charge(config: ChargeConfig): Promise<ChargeResult> {
    return this.payments.charge(config);
  }

  async submitAuthorization(
    reference: string,
    auth: { type: string; value: string }
  ): Promise<ChargeResult> {
    return this.primaryProvider.submitAuthorization(reference, auth);
  }

  async refund(config: RefundConfig): Promise<RefundResult> {
    return this.refunds.create(config);
  }

  async bulkTransfer(config: BulkTransferConfig): Promise<BulkTransferResult> {
    if (!this.primaryProvider.bulkTransfer) {
      throw new QuirkError(
        `${this.primaryProvider.name} does not support bulk transfers`,
        {
          code: 'UNSUPPORTED_OPERATION',
          provider: this.primaryProvider.name,
        }
      );
    }
    if (!config.recipients || config.recipients.length === 0) {
      throw new QuirkError('At least one recipient is required', {
        code: 'VALIDATION_ERROR',
        provider: this.primaryProvider.name,
      });
    }
    if (config.recipients.length > 100) {
      throw new QuirkError('Maximum 100 recipients per bulk transfer', {
        code: 'VALIDATION_ERROR',
        provider: this.primaryProvider.name,
      });
    }
    return this.primaryProvider.bulkTransfer(config);
  }

  async createVirtualAccount(config: VirtualAccountConfig): Promise<VirtualAccountResult> {
    if (!this.primaryProvider.createVirtualAccount) {
      throw new QuirkError(
        `${this.primaryProvider.name} does not support virtual accounts`,
        { code: 'UNSUPPORTED_OPERATION', provider: this.primaryProvider.name }
      );
    }
    if (!config.email) {
      throw new QuirkError('email is required', { code: 'VALIDATION_ERROR', provider: this.primaryProvider.name });
    }
    if (!config.bvn) {
      throw new QuirkError('bvn is required for virtual account creation', { code: 'VALIDATION_ERROR', provider: this.primaryProvider.name });
    }
    return this.primaryProvider.createVirtualAccount(config);
  }

  async pollVerification(
    reference: string,
    options?: {
      intervalMs?: number;
      maxWaitMs?: number;
      onPoll?: (attempt: number, status: TransactionStatus) => void;
    }
  ): Promise<VerificationResult> {
    const intervalMs = options?.intervalMs ?? 2000;
    const maxWaitMs = options?.maxWaitMs ?? 30000;
    const onPoll = options?.onPoll;

    const start = Date.now();
    let attempt = 0;

    while (true) {
      attempt++;
      const result = await this.primaryProvider.verifyTransaction(reference);
      onPoll?.(attempt, result.status);

      if (result.status !== 'pending') {
        return result;
      }

      const elapsed = Date.now() - start;
      if (elapsed >= maxWaitMs) {
        throw new QuirkError(
          `Verification timed out after ${maxWaitMs}ms (${attempt} attempts). Last status: pending`,
          { code: 'POLLING_TIMEOUT', provider: this.primaryProvider.name }
        );
      }

      const wait = Math.min(intervalMs * Math.pow(1.5, attempt - 1), intervalMs * 4);
      await sleep(wait);
    }
  }

  async createSubscription(config: SubscriptionConfig): Promise<SubscriptionResult> {
    if (!this.primaryProvider.createSubscription) {
      throw new QuirkError('Subscriptions not supported by this provider', {
        code: 'NOT_SUPPORTED',
        provider: this.primaryProvider.name,
      });
    }
    return this.primaryProvider.createSubscription(config);
  }

  async cancelSubscription(code: string): Promise<{ success: boolean }> {
    if (!this.primaryProvider.cancelSubscription) {
      throw new QuirkError('Subscriptions not supported by this provider', {
        code: 'NOT_SUPPORTED',
        provider: this.primaryProvider.name,
      });
    }
    return this.primaryProvider.cancelSubscription(code);
  }

  verifyWebhook(payload: string | Buffer, signature: string, secret?: string): boolean {
    return this.primaryProvider.verifyWebhook(payload, signature, secret);
  }

  parseWebhook(payload: string | Buffer): WebhookEvent {
    return this.primaryProvider.parseWebhook(payload);
  }

  on(eventType: string, handler: WebhookHandler): void {
    const handlers = this.webhookHandlers.get(eventType) || [];
    handlers.push(handler);
    this.webhookHandlers.set(eventType, handlers);
  }

  async handleWebhook(payload: string | Buffer, signature: string): Promise<WebhookEvent> {
    if (!this.verifyWebhook(payload, signature)) {
      throw new QuirkError('Invalid webhook signature', {
        code: 'WEBHOOK_VERIFICATION_FAILED',
        provider: this.primaryProvider.name,
      });
    }

    const event = this.parseWebhook(payload);
    const handlers = this.webhookHandlers.get(event.type) || [];
    const wildcardHandlers = this.webhookHandlers.get('*') || [];

    await Promise.all([
      ...handlers.map(h => h(event)),
      ...wildcardHandlers.map(h => h(event)),
    ]);

    return event;
  }

  get providerName(): ProviderName {
    return this.primaryProvider.name;
  }

  static registerProvider(
    name: string,
    providerClass: new (config: QuirkConfig) => Provider
  ): void {
    BUILTIN_PROVIDERS[name] = providerClass;
  }
}
