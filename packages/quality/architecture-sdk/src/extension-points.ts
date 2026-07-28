/**
 * @module architecture-sdk/extension-points
 * @description Lists runtime extension limits and hook patterns.
 */

export class ExtensionPoints {
  listExtensionPoints(): string[] {
    return ['HookManager', 'LifecycleHooks', 'EventPublisher', 'EngineProviders'];
  }
}
