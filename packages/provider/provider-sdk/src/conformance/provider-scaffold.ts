/**
 * @module provider-sdk/provider-scaffold
 * @description Automatic generation of provider boilerplate.
 */

import type { ProviderScaffoldOptions } from './interfaces.js';

export class ProviderScaffolder {
  generate(options: ProviderScaffoldOptions): Record<string, string> {
    return {
      'package.json': JSON.stringify(
        {
          name: `@agentx/provider-${options.name.toLowerCase()}`,
          version: '0.1.0',
          author: options.author,
          dependencies: { '@agentx/runtime-adapters': 'workspace:*' },
        },
        null,
        2,
      ),
      'src/index.ts': `export class ${options.name}Provider {}`,
      'README.md': `# ${options.name} Provider\nGenerated via PSCK.`,
    };
  }
}
