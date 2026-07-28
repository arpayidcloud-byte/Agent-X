// V8 Plugin SDK - Extensibility Layer
export interface Plugin {
  name: string;
  version: string;
  activate(): Promise<void>;
  deactivate(): Promise<void>;
}

export class PluginLoader {
  private plugins = new Map<string, Plugin>();
  
  async load(plugin: Plugin): Promise<void> {
    await plugin.activate();
    this.plugins.set(plugin.name, plugin);
  }
  
  unload(name: string): void {
    const plugin = this.plugins.get(name);
    if (plugin) plugin.deactivate();
    this.plugins.delete(name);
  }
}
