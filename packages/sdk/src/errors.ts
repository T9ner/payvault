export class QuirkError extends Error {
  public code: string;
  public provider: string;
  public statusCode?: number;
  public raw?: any;

  constructor(message: string, options?: {
    code?: string;
    provider?: string;
    statusCode?: number;
    raw?: any;
  }) {
    super(message);
    this.name = 'QuirkError';
    this.code = options?.code || 'QUIRK_ERROR';
    this.provider = options?.provider || 'quirk';
    this.statusCode = options?.statusCode;
    this.raw = options?.raw;
  }
}

// Authentication errors (invalid API key, expired token)
export class AuthenticationError extends QuirkError {
  constructor(provider: string, raw?: any) {
    super(`Authentication failed for ${provider}. Check your API keys.`, {
      code: 'AUTHENTICATION_ERROR',
      provider,
      statusCode: 401,
      raw,
    });
    this.name = 'AuthenticationError';
  }
}

// Validation errors (bad input)
export class ValidationError extends QuirkError {
  public field?: string;

  constructor(message: string, provider: string, field?: string) {
    super(message, {
      code: 'VALIDATION_ERROR',
      provider,
      statusCode: 400,
    });
    this.name = 'ValidationError';
    this.field = field;
  }
}

// Provider API errors (rate limits, server errors)
export class ProviderError extends QuirkError {
  constructor(message: string, provider: string, statusCode: number, raw?: any) {
    super(message, {
      code: 'PROVIDER_ERROR',
      provider,
      statusCode,
      raw,
    });
    this.name = 'ProviderError';
  }
}

// Network/timeout errors
export class NetworkError extends QuirkError {
  constructor(provider: string, originalError?: Error) {
    super(`Network error communicating with ${provider}: ${originalError?.message || 'Connection failed'}`, {
      code: 'NETWORK_ERROR',
      provider,
      raw: originalError,
    });
    this.name = 'NetworkError';
  }
}

// Transaction-specific errors
export class TransactionError extends QuirkError {
  public reference?: string;

  constructor(message: string, provider: string, reference?: string, raw?: any) {
    super(message, {
      code: 'TRANSACTION_ERROR',
      provider,
      raw,
    });
    this.name = 'TransactionError';
    this.reference = reference;
  }
}
