import type { IToolValidator, ToolManifest, ITool, IToolRegistry } from '../interfaces/index.js';
import {
  SchemaValidationError,
  ManifestValidationError,
  DuplicateToolError,
} from '../errors/index.js';

export class ToolValidator implements IToolValidator {
  public validateSchema(schema: Record<string, unknown>, args: Record<string, unknown>): boolean {
    // Basic structural validation for demonstration.
    // In production, an AJV or JSON Schema validator is used.
    if (!schema || typeof schema !== 'object') {
      throw new SchemaValidationError(['Invalid schema definition']);
    }

    const required = schema.required;
    if (Array.isArray(required)) {
      const missing = required.filter((key: string) => args[key] === undefined);
      if (missing.length > 0) {
        throw new SchemaValidationError([`Missing required arguments: ${missing.join(', ')}`]);
      }
    }
    return true;
  }

  public validateManifest(manifest: ToolManifest): boolean {
    if (!manifest.id || typeof manifest.id !== 'string') {
      throw new ManifestValidationError('Manifest is missing required string field: id');
    }
    if (!manifest.version || typeof manifest.version !== 'string') {
      throw new ManifestValidationError('Manifest is missing required string field: version');
    }
    if (manifest.kind !== 'tool') {
      throw new ManifestValidationError(
        `Manifest kind must be 'tool', got '${String(manifest.kind)}'`,
      );
    }
    if (!manifest.entryPoint || typeof manifest.entryPoint !== 'string') {
      throw new ManifestValidationError('Manifest is missing required string field: entryPoint');
    }
    if (
      !Array.isArray(manifest.declaredToolCategories) ||
      manifest.declaredToolCategories.length === 0
    ) {
      throw new ManifestValidationError('Manifest must declare at least one tool category');
    }
    if (!Array.isArray(manifest.tools) || manifest.tools.length === 0) {
      throw new ManifestValidationError('Manifest must define at least one tool');
    }
    return true;
  }

  public validateCapabilities(tool: ITool): boolean {
    const caps = tool.definition.capabilities;
    if (!caps || typeof caps !== 'object') {
      return false;
    }
    return (
      typeof caps.supportsStreaming === 'boolean' &&
      typeof caps.supportsCancellation === 'boolean' &&
      typeof caps.requiresNetwork === 'boolean' &&
      typeof caps.requiresFilesystem === 'boolean'
    );
  }

  public detectDuplicate(registry: IToolRegistry, toolName: string): boolean {
    if (registry.find(toolName)) {
      throw new DuplicateToolError(toolName);
    }
    return false;
  }
}
