/**
 * @module provider-sdk/provider-config
 * @description Provider SDK configuration schema.
 */

export interface ProviderSDKConfig {
  rootDir: string;
  testDir: string;
  certDir: string;
}

export function getDefaultConfig(): ProviderSDKConfig {
  return {
    rootDir: './providers',
    testDir: './tests',
    certDir: './certs',
  };
}
