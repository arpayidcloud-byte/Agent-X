/**
 * @module cognitive-kernel/kernel-capabilities
 * @description Supported operational features list.
 */

export class KernelCapabilities {
  getCapabilities(): string[] {
    return ['Thinking', 'Reasoning', 'Planning', 'Checkpointing', 'Recovery'];
  }
}
