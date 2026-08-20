import { describe, it, expect, vi } from 'vitest';
import { RailEngine } from './rail-engine';
import type { Provider, ProviderName, QuirkConfig } from '../types';
import { NetworkError, QuirkError } from '../errors';

describe('RailEngine Transport Core', () => {
  const createMockProvider = (name: ProviderName, shouldFail = false) => {
    return {
      name,
      initializeTransaction: vi.fn(async (config: any) => {
        if (shouldFail) {
          throw new NetworkError(`Network connection dropped for ${name}`);
        }
        return {
          reference: `ref_${name}_123`,
          authorizationUrl: `https://${name}.com/pay`,
          accessCode: 'code_123',
          status: 'pending' as const,
        };
      }),
      verifyTransaction: vi.fn(),
      charge: vi.fn(),
      submitAuthorization: vi.fn(),
      refund: vi.fn(),
      verifyWebhook: vi.fn(),
      parseWebhook: vi.fn(),
    } as unknown as Provider;
  };

  it('executes against primary rail under normal conditions', async () => {
    const paystack = createMockProvider('paystack');
    const flutterwave = createMockProvider('flutterwave');

    const providers = new Map<ProviderName, Provider>([
      ['paystack', paystack],
      ['flutterwave', flutterwave],
    ]);

    const config: QuirkConfig = {
      provider: 'paystack',
      secretKey: 'sk_test_xxx',
      strategy: 'dynamic_failover',
    };

    const engine = new RailEngine(providers, 'paystack', config);

    const result = await engine.execute(async (prov, name) => {
      return prov.initializeTransaction({ amount: 5000, currency: 'NGN', email: 'test@example.com' });
    });

    expect(result.reference).toBe('ref_paystack_123');
    expect(paystack.initializeTransaction).toHaveBeenCalledTimes(1);
    expect(flutterwave.initializeTransaction).not.toHaveBeenCalled();
  });

  it('autonomously fails over to secondary rail when primary rail encounters network error', async () => {
    const paystack = createMockProvider('paystack', true); // Failing Paystack
    const flutterwave = createMockProvider('flutterwave', false); // Working Flutterwave

    const providers = new Map<ProviderName, Provider>([
      ['paystack', paystack],
      ['flutterwave', flutterwave],
    ]);

    const config: QuirkConfig = {
      providers: {
        paystack: 'sk_test_xxx',
        flutterwave: 'flw_test_xxx',
      },
      fallbackOrder: ['paystack', 'flutterwave'],
      strategy: 'dynamic_failover',
    };

    const engine = new RailEngine(providers, 'paystack', config);

    const result = await engine.execute(async (prov, name) => {
      return prov.initializeTransaction({ amount: 5000, currency: 'NGN', email: 'test@example.com' });
    });

    expect(result.reference).toBe('ref_flutterwave_123');
    expect(paystack.initializeTransaction).toHaveBeenCalledTimes(1);
    expect(flutterwave.initializeTransaction).toHaveBeenCalledTimes(1);
  });

  it('trips circuit breaker after exceeding failure threshold', async () => {
    const paystack = createMockProvider('paystack', true);
    const flutterwave = createMockProvider('flutterwave', false);

    const providers = new Map<ProviderName, Provider>([
      ['paystack', paystack],
      ['flutterwave', flutterwave],
    ]);

    const config: QuirkConfig = {
      providers: {
        paystack: 'sk_test_xxx',
        flutterwave: 'flw_test_xxx',
      },
      fallbackOrder: ['paystack', 'flutterwave'],
      strategy: 'dynamic_failover',
    };

    const engine = new RailEngine(providers, 'paystack', config);

    // Run 3 failing attempts on paystack to trip the circuit breaker
    await engine.execute(async (p) => p.initializeTransaction({ amount: 100, currency: 'NGN', email: 'a@b.com' }));
    await engine.execute(async (p) => p.initializeTransaction({ amount: 100, currency: 'NGN', email: 'a@b.com' }));
    await engine.execute(async (p) => p.initializeTransaction({ amount: 100, currency: 'NGN', email: 'a@b.com' }));

    expect(engine.isRailAvailable('paystack')).toBe(false);

    // On 4th attempt, Paystack should be skipped immediately without calling initializeTransaction
    paystack.initializeTransaction = vi.fn();
    const result = await engine.execute(async (p) => p.initializeTransaction({ amount: 100, currency: 'NGN', email: 'a@b.com' }));
    
    expect(result.reference).toBe('ref_flutterwave_123');
    expect(paystack.initializeTransaction).not.toHaveBeenCalled();
  });
});
