export class SecretError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecretError';
  }
}

export class SecretNotFoundError extends SecretError {
  constructor(key: string) {
    super(`Secret not found: ${key}`);
    this.name = 'SecretNotFoundError';
  }
}

export class OperationNotSupportedError extends SecretError {
  constructor(operation?: string) {
    super(operation ? `Operation not supported: ${operation}` : 'Operation not supported');
    this.name = 'OperationNotSupportedError';
  }
}

export class SecretAccessError extends SecretError {
  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'SecretAccessError';
  }
}

export class CredentialResolutionError extends SecretError {
  constructor(logicalKey: string) {
    const envVarName = `AGENTX_SECRET_${logicalKey.toUpperCase().replace(/\./g, '_')}_API_KEY`;
    super(
      `Failed to resolve credential "${logicalKey}": environment variable ${envVarName} not found`,
    );
    this.name = 'CredentialResolutionError';
  }
}
