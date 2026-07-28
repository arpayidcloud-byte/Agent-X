/**
 * @module coordinator/reservation
 * @description Reservation manager for critical system resources.
 */

import type { ExecutionReservation } from './interfaces.js';
import { CoordinatorReservationError } from './errors.js';

export class ExecutionReservationManager {
  private reservations = new Map<string, ExecutionReservation>();

  reserve(
    type: 'worker' | 'token' | 'provider' | 'tool' | 'memory' | 'cost',
    capacity: number,
    durationMs: number,
  ): ExecutionReservation {
    const expiresAt = new Date(Date.now() + durationMs);
    const reservation: ExecutionReservation = {
      id: `reserve-${type}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      type,
      capacity,
      used: 0,
      expiresAt,
    };
    this.reservations.set(reservation.id, reservation);
    return reservation;
  }

  allocate(id: string, amount: number): void {
    const res = this.reservations.get(id);
    if (!res) {
      throw new CoordinatorReservationError('Reservation not found', 'reservation');
    }
    if (res.expiresAt.getTime() < Date.now()) {
      throw new CoordinatorReservationError('Reservation expired', 'reservation');
    }
    if (res.used + amount > res.capacity) {
      throw new CoordinatorReservationError('Exceeds reservation capacity', 'reservation');
    }
    res.used += amount;
  }

  release(id: string): void {
    this.reservations.delete(id);
  }

  getReservations(): ExecutionReservation[] {
    // Expire old reservations
    const now = Date.now();
    for (const [id, res] of this.reservations.entries() as IterableIterator<
      [string, ExecutionReservation]
    >) {
      if (res.expiresAt.getTime() < now) {
        this.reservations.delete(id);
      }
    }
    return Array.from(this.reservations.values());
  }

  clear(): void {
    this.reservations.clear();
  }
}
