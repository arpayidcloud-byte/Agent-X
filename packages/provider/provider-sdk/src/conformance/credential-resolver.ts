/**
 * @module provider-sdk/credential-resolver
 * @description Credential resolver that reads from environment variables.
 * Maps provider keys to env vars: provider.anthropic.api_key → ANTHROPIC_API_KEY
 */

export class CredentialResolver {
  async resolve(key: string): Promise<string> {
    // Map provider key to env var: provider.anthropic.api_key → ANTHROPIC_API_KEY
    const envKey = key
      .replace(/^provider\./, '')
      .replace(/\.api_key$/, '_API_KEY')
      .replace(/\./g, '_')
      .toUpperCase();

    const value = process.env[envKey];
    if (!value) {
      throw new Error(`Credential not found: ${key} (env: ${envKey})`);
    }
    return value;
  }
}
