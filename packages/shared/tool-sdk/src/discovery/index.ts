import type { IToolDiscovery, ToolManifest, ITool, IToolRegistry } from '../interfaces/index.js';
import type { IToolValidator } from '../interfaces/index.js';

export class ToolDiscovery implements IToolDiscovery {
  constructor(
    private readonly validator: IToolValidator,
    private readonly registry: IToolRegistry,
  ) {}

  public async loadManifest(_path: string): Promise<ToolManifest> {
    // Simulated manifest loading for foundation package.
    // In M2.2, this reads from the filesystem or imports a module.
    // Since ADR-0016 requires NO filesystem/network access in foundation:
    throw new Error('Filesystem access not permitted in M2.1 foundation package');
  }

  public registerFromManifest(manifest: ToolManifest, tools: ITool[]): void {
    this.validator.validateManifest(manifest);

    for (const tool of tools) {
      this.validator.detectDuplicate(this.registry, tool.definition.name);

      // Ensure the tool category matches one of the declared categories in the manifest
      if (!manifest.declaredToolCategories.includes(tool.definition.category)) {
        throw new Error(
          `Tool category '${tool.definition.category}' is not declared in the manifest`,
        );
      }

      this.registry.register(tool);
    }
  }

  public validateVersion(version: string): boolean {
    const semverRegex = /^\d+\.\d+\.\d+$/;
    return semverRegex.test(version);
  }

  public checkCompatibility(manifest: ToolManifest): boolean {
    return this.validateVersion(manifest.version);
  }
}
