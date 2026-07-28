/**
 * @module runtime-production/lease-manager
 * @description Manages worker leases and renewals.
 */

import type { LeaseInfo } from './interfaces.js';
import { LeaseError } from './errors.js';

export class ExecutionLeaseManager {
  private leases = new Map<string, LeaseInfo>();

  acquireLease(
    workerId: string,
    resourceType: string,
    resourceId: string,
    ttlMs: number,
  ): LeaseInfo {
    const key = `${resourceType}:${resourceId}`;
    const existing = this.leases.get(key);

    if (existing && existing.expiresAt.getTime() > Date.now()) {
      throw new LeaseError(`Resource already leased: ${key}`, 'lease-manager');
    }

    const lease: LeaseInfo = {
      workerId,
      resourceType,
      resourceId,
      leasedAt: new Date(),
      expiresAt: new Date(Date.now() + ttlMs),
      heartbeatMs: ttlMs,
    };

    this.leases.set(key, lease);
    return lease;
  }

  renewLease(workerId: string, resourceType: string, resourceId: string): void {
    const key = `${resourceType}:${resourceId}`;
    const existing = this.leases.get(key);

    if (!existing) {
      throw new LeaseError(`Lease not found: ${key}`, 'lease-manager');
    }
    if (existing.workerId !== workerId) {
      throw new LeaseError(
        `Lease owned by different worker: ${existing.workerId}`,
        'lease-manager',
      );
    }

    existing.expiresAt = new Date(Date.now() + existing.heartbeatMs);
  }

  releaseLease(workerId: string, resourceType: string, resourceId: string): void {
    const key = `${resourceType}:${resourceId}`;
    const existing = this.leases.get(key);

    if (existing && existing.workerId === workerId) {
      this.leases.delete(key);
    }
  }

  takeoverLease(
    newWorkerId: string,
    resourceType: string,
    resourceId: string,
    ttlMs: number,
  ): LeaseInfo {
    const key = `${resourceType}:${resourceId}`;
    const existing = this.leases.get(key);

    if (existing && existing.expiresAt.getTime() > Date.now()) {
      throw new LeaseError(`Cannot takeover active lease: ${key}`, 'lease-manager');
    }

    return this.acquireLease(newWorkerId, resourceType, resourceId, ttlMs);
  }

  isLeased(resourceType: string, resourceId: string): boolean {
    const key = `${resourceType}:${resourceId}`;
    const existing = this.leases.get(key);
    return !!existing && existing.expiresAt.getTime() > Date.now();
  }

  clear(): void {
    this.leases.clear();
  }
}
