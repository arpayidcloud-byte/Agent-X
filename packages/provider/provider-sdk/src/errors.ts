export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly providerId: string,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ProviderUnavailableError extends ProviderError {
  constructor(
    providerId: string,
    message: string = 'Provider service is unavailable.',
    originalError?: Error,
  ) {
    super(message, providerId, originalError);
  }
}

export class ProviderTimeoutError extends ProviderError {
  constructor(
    providerId: string,
    message: string = 'Provider request timed out.',
    originalError?: Error,
  ) {
    super(message, providerId, originalError);
  }
}

export class ProviderRateLimitError extends ProviderError {
  constructor(
    providerId: string,
    message: string = 'Provider rate limit exceeded.',
    originalError?: Error,
  ) {
    super(message, providerId, originalError);
  }
}

export class ProviderResponseMalformedError extends ProviderError {
  constructor(
    providerId: string,
    message: string = 'Provider returned a malformed response.',
    originalError?: Error,
  ) {
    super(message, providerId, originalError);
  }
}

export class ProviderInvalidCredentialsError extends ProviderError {
  constructor(
    providerId: string,
    message: string = 'Provider credentials are invalid or missing.',
    originalError?: Error,
  ) {
    super(message, providerId, originalError);
  }
}

export class CircuitBreakerOpenError extends ProviderError {
  constructor(providerId: string, message: string = 'Provider circuit breaker is open.') {
    super(message, providerId);
  }
}
