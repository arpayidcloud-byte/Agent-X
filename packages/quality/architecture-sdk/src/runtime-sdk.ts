/**
 * @module architecture-sdk/runtime-sdk
 * @description Core runtime lifecycle specifications.
 */

export class RuntimeSDK {
  getLifecycle(): string[] {
    return ['INIT', 'READY', 'RUNNING', 'PAUSED', 'STOPPED'];
  }
}
