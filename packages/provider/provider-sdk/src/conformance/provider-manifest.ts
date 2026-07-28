/**
 * @module provider-sdk/provider-manifest
 * @description Master definition file representation for an AgentX provider.
 */

import type { ProviderManifest } from './interfaces.js';

export function createManifest(id: string, name: string, type: string): ProviderManifest {
  return {
    id,
    name,
    version: '0.1.0',
    type,
    author: 'AgentX',
    capabilities: [],
    dependencies: {},
  };
}
