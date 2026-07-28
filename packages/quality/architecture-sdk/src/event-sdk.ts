/**
 * @module architecture-sdk/event-sdk
 * @description Event system specifications.
 */

export class EventSDK {
  getSpecs(): string[] {
    return ['Trace propagation mandatory', 'Timestamp mandatory', 'Async delivery'];
  }
}
