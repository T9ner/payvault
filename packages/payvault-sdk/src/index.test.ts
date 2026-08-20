import { describe, it, expect, vi } from 'vitest';
import { Quirk, Payvault, PayvaultClient } from './index';

describe('payvault-sdk bridge', () => {
  it('exports Quirk and Payvault aliases pointing to the same class', () => {
    expect(Payvault).toBe(Quirk);
    expect(PayvaultClient).toBe(Quirk);
  });

  it('instantiates client via legacy Payvault alias', () => {
    const client = new Payvault({
      providers: {
        paystack: 'sk_test_123',
      },
    });

    expect(client.payments).toBeDefined();
    expect(client.webhooks).toBeDefined();
    expect(client.refunds).toBeDefined();
  });
});
