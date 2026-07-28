/**
 * @module provider-sdk/errors
 * @description Error classes for the Provider SDK Conformance Kit.
 */

export class ProviderSDKError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'ProviderSDKError';
  }
}

export class HarnessError extends ProviderSDKError {
  constructor(message: string, source: string) {
    super(message, 'HARNESS_ERROR', source);
    this.name = 'HarnessError';
  }
}

export class ValidationFailedError extends ProviderSDKError {
  constructor(message: string, source: string) {
    super(message, 'VALIDATION_FAILED', source);
    this.name = 'ValidationFailedError';
  }
}
