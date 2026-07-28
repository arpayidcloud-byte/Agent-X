/**
 * @module native-providers/errors
 * @description Native provider integration errors.
 */

export class NativeProviderError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly source: string,
  ) {
    super(message);
    this.name = 'NativeProviderError';
  }
}

export class ConnectionError extends NativeProviderError {
  constructor(message: string, source: string) {
    super(message, 'CONNECTION_ERROR', source);
    this.name = 'ConnectionError';
  }
}

export class ConfigurationError extends NativeProviderError {
  constructor(message: string, source: string) {
    super(message, 'CONFIGURATION_ERROR', source);
    this.name = 'ConfigurationError';
  }
}

export class VendorSDKError extends NativeProviderError {
  constructor(message: string, source: string) {
    super(message, 'VENDOR_SDK_ERROR', source);
    this.name = 'VendorSDKError';
  }
}
