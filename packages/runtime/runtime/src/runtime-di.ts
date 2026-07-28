/**
 * @module runtime/runtime-di
 * @description Dependency injection container for the runtime.
 */

export class RuntimeDI {
  private services = new Map<string, unknown>();
  private factories = new Map<string, () => unknown>();

  register<T>(name: string, instance: T): void {
    this.services.set(name, instance);
  }

  registerFactory<T>(name: string, factory: () => T): void {
    this.factories.set(name, factory);
  }

  resolve<T>(name: string): T {
    if (this.services.has(name)) {
      return this.services.get(name) as T;
    }
    if (this.factories.has(name)) {
      const instance = (this.factories.get(name) as () => unknown)() as T;
      this.services.set(name, instance);
      return instance;
    }
    throw new Error(`Service '${name}' not registered`);
  }

  has(name: string): boolean {
    return this.services.has(name) || this.factories.has(name);
  }

  remove(name: string): void {
    this.services.delete(name);
    this.factories.delete(name);
  }

  clear(): void {
    this.services.clear();
    this.factories.clear();
  }
}
