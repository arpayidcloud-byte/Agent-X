export class PluginError extends Error {
  public readonly code: string;
  public readonly pluginId?: string;

  constructor(message: string, code: string, pluginId?: string) {
    super(message);
    this.name = 'PluginError';
    this.code = code;
    this.pluginId = pluginId;
  }
}

export class ManifestValidationError extends PluginError {
  constructor(message: string, pluginId?: string) {
    super(message, 'MANIFEST_VALIDATION_FAILED', pluginId);
  }
}

export class PluginNotFoundError extends PluginError {
  constructor(pluginId: string) {
    super(`Plugin not found: ${pluginId}`, 'PLUGIN_NOT_FOUND', pluginId);
  }
}

export class PluginRoleCollisionError extends PluginError {
  constructor(role: string) {
    super(
      `Agent role '${role}' collides with the fixed v0.1 roster (coding, review, test, security)`,
      'ROLE_COLLISION',
    );
  }
}

export class PluginPermissionDeniedError extends PluginError {
  constructor(pluginId: string) {
    super(
      `Plugin '${pluginId}' has not been approved by the operator`,
      'PERMISSION_DENIED',
      pluginId,
    );
  }
}
