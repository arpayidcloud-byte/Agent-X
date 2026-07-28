/**
 * @module runtime-adapters/errors
 * @description Error classes for Production Adapter Layer.
 */

export class AdapterError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'AdapterError';
  }
}

export class ProviderResolutionError extends AdapterError {
  constructor(message: string, source: string) {
    super(message, 'PROVIDER_RESOLUTION_ERROR', source);
    this.name = 'ProviderResolutionError';
  }
}

export class ProviderUnavailableError extends AdapterError {
  constructor(message: string, source: string) {
    super(message, 'PROVIDER_UNAVAILABLE_ERROR', source);
    this.name = 'ProviderUnavailableError';
  }
}

export class UnsupportedProviderCapabilityError extends AdapterError {
  constructor(message: string, source: string) {
    super(message, 'UNSUPPORTED_PROVIDER_CAPABILITY_ERROR', source);
    this.name = 'UnsupportedProviderCapabilityError';
  }
}
