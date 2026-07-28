import { ToolError } from '../errors/index.js';

export class SandboxViolationError extends ToolError {
  constructor(message: string) {
    super(message, 'SANDBOX_VIOLATION');
  }
}

export class PathTraversalError extends SandboxViolationError {
  constructor(path: string, reason: string) {
    super(`Path traversal attempt detected on ${path}: ${reason}`);
  }
}

export class WorkspaceEscapeError extends SandboxViolationError {
  constructor(path: string, workspaceRoot: string) {
    super(`Path ${path} escaped the workspace jail root of ${workspaceRoot}`);
  }
}

export class AllowlistViolationError extends SandboxViolationError {
  constructor(path: string) {
    super(`Path ${path} violates the filesystem allowlist configuration policy`);
  }
}

export class FileTooLargeError extends SandboxViolationError {
  constructor(sizeBytes: number, maxBytes: number) {
    super(`File size ${sizeBytes} exceeds maximum permitted limit of ${maxBytes} bytes`);
  }
}

export class InvalidEncodingError extends SandboxViolationError {
  constructor(reason: string) {
    super(`Invalid encoding or binary content detected: ${reason}`);
  }
}

export class AtomicWriteError extends ToolError {
  constructor(message: string, originalError?: Error) {
    super(
      `Atomic write operation failed: ${message} (Original: ${originalError?.message})`,
      'ATOMIC_WRITE_ERROR',
    );
  }
}
