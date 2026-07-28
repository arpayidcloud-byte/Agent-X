/**
 * @module runtime/runtime-registry
 * @description Runtime component registry for dependency injection.
 */

export interface ComponentEntry {
  name: string;
  instance: unknown;
  registeredAt: Date;
}

export class RuntimeRegistry {
  private components = new Map<string, ComponentEntry>();

  register(name: string, instance: unknown): void {
    this.components.set(name, { name, instance, registeredAt: new Date() });
  }

  get<T>(name: string): T | undefined {
    return this.components.get(name)?.instance as T | undefined;
  }

  has(name: string): boolean {
    return this.components.has(name);
  }

  remove(name: string): void {
    this.components.delete(name);
  }

  list(): ComponentEntry[] {
    return Array.from(this.components.values());
  }

  clear(): void {
    this.components.clear();
  }
}
