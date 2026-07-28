/**
 * @module architecture-sdk/agent-sdk
 * @description Agent platform specification limits.
 */

export class AgentSDK {
  getConstraints(): string[] {
    return ['Max parallel 10', 'Memory limit 500MB', 'Timeout 120s'];
  }
}
