import type { Provider, ProviderName, QuirkConfig } from '../types';
import { QuirkError, NetworkError, ProviderError } from '../errors';

export type CircuitStatus = 'closed' | 'open' | 'half_open';

export interface CircuitBreakerState {
  status: CircuitStatus;
  failureCount: number;
  lastFailureTime: number;
  failureThreshold: number;
  cooldownMs: number;
}

export interface RailExecutionOptions {
  preferredRail?: ProviderName;
  fallbackOrder?: ProviderName[];
  operationName?: string;
  allowFailover?: boolean;
}

/**
 * RailEngine is the deep multi-rail transport core in @quirk/sdk.
 * It encapsulates circuit-breaker tracking, autonomous dynamic failover,
 * and resilient execution across configured payment rails behind a single entry point.
 */
export class RailEngine {
  private providers: Map<ProviderName, Provider> = new Map();
  private circuitBreakers: Map<ProviderName, CircuitBreakerState> = new Map();
  private primaryRailName: ProviderName;
  private config: QuirkConfig;

  constructor(
    providers: Map<ProviderName, Provider>,
    primaryRailName: ProviderName,
    config: QuirkConfig
  ) {
    this.providers = providers;
    this.primaryRailName = primaryRailName;
    this.config = config;

    // Initialize Circuit Breakers for each configured rail
    for (const rail of providers.keys()) {
      this.circuitBreakers.set(rail, {
        status: 'closed',
        failureCount: 0,
        lastFailureTime: 0,
        failureThreshold: 3,
        cooldownMs: 30000, // 30s probe cooldown
      });
    }
  }

  /**
   * Evaluates whether a payment rail's circuit allows traffic.
   */
  public isRailAvailable(rail: ProviderName): boolean {
    const breaker = this.circuitBreakers.get(rail);
    if (!breaker) return false;

    if (breaker.status === 'closed') return true;

    if (breaker.status === 'open') {
      const now = Date.now();
      if (now - breaker.lastFailureTime > breaker.cooldownMs) {
        breaker.status = 'half_open';
        return true;
      }
      return false;
    }

    return true; // half_open permits probe
  }

  /**
   * Records successful execution on a payment rail.
   */
  private recordSuccess(rail: ProviderName): void {
    const breaker = this.circuitBreakers.get(rail);
    if (breaker) {
      breaker.status = 'closed';
      breaker.failureCount = 0;
    }
  }

  /**
   * Records failure on a payment rail and trips the circuit if threshold is exceeded.
   */
  private recordFailure(rail: ProviderName): void {
    const breaker = this.circuitBreakers.get(rail);
    if (breaker) {
      breaker.failureCount += 1;
      breaker.lastFailureTime = Date.now();
      if (breaker.failureCount >= breaker.failureThreshold) {
        breaker.status = 'open';
      }
    }
  }

  /**
   * Deep Execution Seam: Executes an operation across rails with autonomous dynamic failover.
   */
  public async execute<T>(
    operation: (provider: Provider, railName: ProviderName) => Promise<T>,
    options: RailExecutionOptions = {}
  ): Promise<T> {
    const isDynamicFailover =
      options.allowFailover ??
      (this.config.strategy === 'dynamic_failover' && this.providers.size > 1);

    // If failover is not enabled or single rail requested explicitly
    if (!isDynamicFailover || (options.preferredRail && !options.fallbackOrder)) {
      const targetRail = options.preferredRail || this.primaryRailName;
      const provider = this.providers.get(targetRail);
      if (!provider) {
        throw new QuirkError(`Payment rail "${targetRail}" is not configured.`, {
          code: 'PROVIDER_NOT_CONFIGURED',
          provider: targetRail,
        });
      }

      try {
        const result = await operation(provider, targetRail);
        this.recordSuccess(targetRail);
        return result;
      } catch (err: any) {
        this.recordFailure(targetRail);
        throw err;
      }
    }

    // Determine fallback sequence
    const sequence: ProviderName[] = [];
    if (options.preferredRail && this.providers.has(options.preferredRail)) {
      sequence.push(options.preferredRail);
    }

    const configuredOrder = options.fallbackOrder || this.config.fallbackOrder || Array.from(this.providers.keys());
    for (const rail of configuredOrder) {
      if (!sequence.includes(rail) && this.providers.has(rail)) {
        sequence.push(rail);
      }
    }

    let lastError: any = null;

    for (const railName of sequence) {
      if (!this.isRailAvailable(railName)) {
        continue;
      }

      const provider = this.providers.get(railName);
      if (!provider) continue;

      try {
        const result = await operation(provider, railName);
        this.recordSuccess(railName);
        return result;
      } catch (err: any) {
        this.recordFailure(railName);
        lastError = err;

        // Only failover on network errors, 5xx server errors, or gateway timeouts
        const shouldFailover =
          err instanceof NetworkError ||
          err instanceof ProviderError ||
          err?.statusCode >= 500 ||
          err?.code === 'GATEWAY_TIMEOUT' ||
          err?.code === 'NETWORK_ERROR' ||
          err?.message?.includes('fetch failed') ||
          err?.message?.includes('timeout') ||
          err?.message?.includes('ECONNREFUSED');

        if (!shouldFailover) {
          // Client errors (4xx validation errors, bad cards) should not failover
          throw err;
        }

        continue;
      }
    }

    throw (
      lastError ||
      new QuirkError(`All payment rails failed to execute ${options.operationName || 'operation'}.`, {
        code: 'FAILOVER_EXHAUSTED',
      })
    );
  }

  public getPrimaryRail(): Provider {
    const provider = this.providers.get(this.primaryRailName);
    if (!provider) {
      throw new QuirkError(`Primary payment rail "${this.primaryRailName}" is not available.`);
    }
    return provider;
  }

  public getRail(name: ProviderName): Provider | undefined {
    return this.providers.get(name);
  }

  public getRailNames(): ProviderName[] {
    return Array.from(this.providers.keys());
  }
}
