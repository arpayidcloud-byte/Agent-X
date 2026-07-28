/**
 * @module runtime-production/graceful-shutdown-manager
 * @description Manages process termination and resource cleanup with graceful shutdown handling.
 */

import { ShutdownError } from './errors.js';

export type ShutdownHook = () => Promise<void>;

export interface ShutdownOptions {
  /** Timeout in milliseconds before forcing shutdown */
  timeoutMs?: number;
  /** Reason for shutdown */
  reason?: string;
  /** Signal that triggered shutdown (SIGTERM, SIGINT, etc) */
  signal?: NodeJS.Signals;
}

/**
 * Tracks in-flight operations during shutdown.
 */
export class InFlightTracker {
  private operations: Map<string, Promise<unknown>> = new Map();
  private idCounter = 0;

  /**
   * Register an in-flight operation.
   */
  register<T>(operation: Promise<T>, name?: string): Promise<T> {
    const id = name || `op-${++this.idCounter}`;
    this.operations.set(id, operation);

    void operation.finally(() => {
      this.operations.delete(id);
    });

    return operation;
  }

  /**
   * Get count of active operations.
   */
  getCount(): number {
    return this.operations.size;
  }

  /**
   * Wait for all operations to complete with timeout.
   */
  async waitForAll(timeoutMs: number): Promise<void> {
    const start = Date.now();

    while (this.operations.size > 0) {
      if (Date.now() - start > timeoutMs) {
        throw new Error(`Timeout waiting for ${this.operations.size} in-flight operations`);
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
}

/**
 * Graceful shutdown manager with signal handling and resource cleanup.
 */
export class GracefulShutdownManager {
  private hooks: ShutdownHook[] = [];
  private isShuttingDown = false;
  private inFlightTracker: InFlightTracker;
  private shutdownPromise: Promise<void> | null = null;

  constructor() {
    this.inFlightTracker = new InFlightTracker();
  }

  /**
   * Register a shutdown hook to be called during shutdown.
   */
  registerHook(hook: ShutdownHook): void {
    this.hooks.push(hook);
  }

  /**
   * Register an in-flight operation to track during shutdown.
   */
  trackOperation<T>(operation: Promise<T>, name?: string): Promise<T> {
    return this.inFlightTracker.register(operation, name);
  }

  /**
   * Initiate graceful shutdown with timeout.
   */
  async initiateShutdown(options: ShutdownOptions = {}): Promise<void> {
    const { timeoutMs = 30000, reason = 'Graceful shutdown', signal } = options;

    if (this.isShuttingDown) {
      return this.shutdownPromise ?? Promise.resolve();
    }

    this.isShuttingDown = true;

    console.log(
      `[SHUTDOWN] Starting graceful shutdown (${reason}) - Signal: ${signal || 'UNKNOWN'}`,
    );
    console.log(`[SHUTDOWN] Timeout: ${timeoutMs}ms`);
    console.log(`[SHUTDOWN] Registered hooks: ${this.hooks.length}`);

    const shutdownTimeout = new Promise<void>((_, reject) => {
      setTimeout(() => {
        reject(new ShutdownError(`Shutdown timeout after ${timeoutMs}ms`, 'shutdown-timeout'));
      }, timeoutMs);
    });

    this.shutdownPromise = Promise.race([this.executeShutdownHooks(), shutdownTimeout]).catch(
      (error) => {
        console.error('[SHUTDOWN] Error during shutdown:', error);
        throw error;
      },
    ) as Promise<void>;

    return this.shutdownPromise;
  }

  /**
   * Execute all registered shutdown hooks.
   */
  private async executeShutdownHooks(): Promise<void> {
    console.log('[SHUTDOWN] Waiting for in-flight operations...');

    // Wait for in-flight operations (max 5 seconds)
    try {
      await this.inFlightTracker.waitForAll(5000);
      console.log('[SHUTDOWN] All in-flight operations completed');
    } catch (error) {
      console.warn('[SHUTDOWN] Timeout waiting for operations, proceeding with cleanup:', error);
    }

    console.log('[SHUTDOWN] Executing shutdown hooks...');

    const results: Array<{ hook: string; success: boolean; error?: string }> = [];

    for (const hook of this.hooks) {
      try {
        await hook();
        results.push({ hook: hook.name || 'anonymous', success: true });
        console.log(`[SHUTDOWN] ✓ Hook completed: ${hook.name || 'anonymous'}`);
      } catch (error) {
        results.push({
          hook: hook.name || 'anonymous',
          success: false,
          error: (error as Error).message,
        });
        console.error(
          `[SHUTDOWN] ✗ Hook failed: ${hook.name || 'anonymous'} - ${(error as Error).message}`,
        );
      }
    }

    const failedCount = results.filter((r) => !r.success).length;
    if (failedCount > 0) {
      console.warn(`[SHUTDOWN] Completed with ${failedCount} failed hook(s)`);
    } else {
      console.log('[SHUTDOWN] All hooks completed successfully');
    }

    console.log('[SHUTDOWN] Graceful shutdown complete');
  }

  /**
   * Check if shutdown is in progress or complete.
   */
  isShutdown(): boolean {
    return this.isShuttingDown;
  }

  /**
   * Get count of in-flight operations.
   */
  getInFlightCount(): number {
    return this.inFlightTracker.getCount();
  }

  /**
   * Get shutdown promise (if shutdown initiated).
   */
  getShutdownPromise(): Promise<void> | null {
    return this.shutdownPromise;
  }

  /**
   * Clear all hooks and reset state (for testing).
   */
  clear(): void {
    this.hooks = [];
    this.isShuttingDown = false;
    this.shutdownPromise = null;
    this.inFlightTracker = new InFlightTracker();
  }

  /**
   * Install signal handlers for graceful shutdown.
   */
  installSignalHandlers(): void {
    const handleSignal = (signal: NodeJS.Signals): void => {
      console.log(`[SHUTDOWN] Received ${signal}`);

      this.initiateShutdown({
        reason: `Received ${signal}`,
        signal,
        timeoutMs: 30000,
      })
        .then(() => {
          console.log('[SHUTDOWN] Exiting process');
          process.exit(0);
        })
        .catch((error) => {
          console.error('[SHUTDOWN] Forced exit due to error:', error);
          process.exit(1);
        });
    };

    process.on('SIGTERM', () => handleSignal('SIGTERM'));
    process.on('SIGINT', () => handleSignal('SIGINT'));

    // Handle uncaught errors gracefully
    process.on('uncaughtException', (error) => {
      console.error('[FATAL] Uncaught exception:', error);
      handleSignal('SIGUSR1');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('[FATAL] Unhandled rejection at:', promise, 'reason:', reason);
    });

    console.log('[SHUTDOWN] Signal handlers installed (SIGTERM, SIGINT)');
  }
}
