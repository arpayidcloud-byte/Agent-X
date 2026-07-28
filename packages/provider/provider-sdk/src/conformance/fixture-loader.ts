/**
 * @module provider-sdk/fixture-loader
 * @description Loads testing fixtures dynamically.
 */

export class FixtureLoader {
  load(type: 'json' | 'yaml', data: string): Record<string, unknown> {
    if (type === 'json') {
      return JSON.parse(data) as Record<string, unknown>;
    }
    // simple YAML stub
    return { loaded: true };
  }
}
