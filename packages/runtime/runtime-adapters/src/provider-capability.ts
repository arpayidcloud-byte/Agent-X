/**
 * @module runtime-adapters/provider-capability
 * @description Validates provider capabilities against required features.
 */

import type { ProviderCapabilities } from './interfaces.js';
import { UnsupportedProviderCapabilityError } from './errors.js';

export class ProviderCapabilityResolver {
  validateCapabilities(
    required: Partial<ProviderCapabilities>,
    actual: ProviderCapabilities,
  ): void {
    if (required.transactions && !actual.transactions) {
      throw new UnsupportedProviderCapabilityError(
        'Transactions not supported',
        'capability-resolver',
      );
    }
    if (required.priorityQueue && !actual.priorityQueue) {
      throw new UnsupportedProviderCapabilityError(
        'Priority Queue not supported',
        'capability-resolver',
      );
    }
    if (required.distributedLocks && !actual.distributedLocks) {
      throw new UnsupportedProviderCapabilityError(
        'Distributed Locks not supported',
        'capability-resolver',
      );
    }
    if (required.leaderElection && !actual.leaderElection) {
      throw new UnsupportedProviderCapabilityError(
        'Leader Election not supported',
        'capability-resolver',
      );
    }
    if (required.telemetry && !actual.telemetry) {
      throw new UnsupportedProviderCapabilityError(
        'Telemetry not supported',
        'capability-resolver',
      );
    }
    if (required.secretRotation && !actual.secretRotation) {
      throw new UnsupportedProviderCapabilityError(
        'Secret Rotation not supported',
        'capability-resolver',
      );
    }
  }

  supportsTransactions(capabilities: ProviderCapabilities): boolean {
    return capabilities.transactions === true;
  }

  supportsPriorityQueue(capabilities: ProviderCapabilities): boolean {
    return capabilities.priorityQueue === true;
  }

  supportsDistributedLocks(capabilities: ProviderCapabilities): boolean {
    return capabilities.distributedLocks === true;
  }

  supportsLeaderElection(capabilities: ProviderCapabilities): boolean {
    return capabilities.leaderElection === true;
  }

  supportsTelemetry(capabilities: ProviderCapabilities): boolean {
    return capabilities.telemetry === true;
  }

  supportsSecretRotation(capabilities: ProviderCapabilities): boolean {
    return capabilities.secretRotation === true;
  }
}
