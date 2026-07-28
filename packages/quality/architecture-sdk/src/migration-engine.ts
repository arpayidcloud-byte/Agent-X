/**
 * @module architecture-sdk/migration-engine
 * @description Migration step tracking across architecture updates.
 */

import type { MigrationStep } from './interfaces.js';

export class MigrationEngine {
  private migrations: MigrationStep[] = [];

  addMigration(step: MigrationStep): void {
    this.migrations.push(step);
  }

  getMigrations(): MigrationStep[] {
    return [...this.migrations];
  }
}
