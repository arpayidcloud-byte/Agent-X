/**
 * @module architecture-sdk/configuration-sdk
 * @description Centralized configuration specifications.
 */

export class ConfigurationSDK {
  getRules(): string[] {
    return ['No raw process.env', 'Fail-closed defaults', 'Schema validated'];
  }
}
