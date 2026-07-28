export class ToolError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ToolNotFoundError extends ToolError {
  constructor(toolName: string) {
    super(`Tool not found: ${toolName}`, 'TOOL_NOT_FOUND');
  }
}

export class DuplicateToolError extends ToolError {
  constructor(toolName: string) {
    super(`Duplicate tool detected: ${toolName}`, 'DUPLICATE_TOOL');
  }
}

export class PermissionDeniedError extends ToolError {
  constructor(agentRole: string, category: string, reason: string) {
    super(
      `Permission denied for agent ${agentRole} on category ${category}: ${reason}`,
      'PERMISSION_DENIED',
    );
  }
}

export class SchemaValidationError extends ToolError {
  constructor(errors: string[]) {
    super(`Schema validation failed: ${errors.join(', ')}`, 'SCHEMA_VALIDATION_FAILED');
  }
}

export class ManifestValidationError extends ToolError {
  constructor(message: string) {
    super(`Manifest validation failed: ${message}`, 'MANIFEST_VALIDATION_FAILED');
  }
}

export class SandboxViolationError extends ToolError {
  constructor(message: string) {
    super(`Sandbox violation: ${message}`, 'SANDBOX_VIOLATION');
  }
}

export class CapabilityViolationError extends ToolError {
  constructor(message: string) {
    super(`Capability violation: ${message}`, 'CAPABILITY_VIOLATION');
  }
}
