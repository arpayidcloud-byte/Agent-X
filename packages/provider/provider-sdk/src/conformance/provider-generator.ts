/**
 * @module provider-sdk/provider-generator
 * @description Generates boilerplate code for a new provider.
 */

export class ProviderGenerator {
  generateCode(name: string): string {
    return `
export class ${name}Provider {
  getMetadata() {
    return { id: '${name.toLowerCase()}', name: '${name}', type: 'queue', version: '1.0.0' };
  }
}
`;
  }
}
