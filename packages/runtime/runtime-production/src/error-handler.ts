/**
 * @module runtime-production/error-handler
 * @description Centralized error handling with classification, recovery strategies, and dead letter queue integration.
 */

import type { TaskModel } from '@agentx-fast/core-runtime';
import type { DeadLetterQueue } from './dead-letter-queue.js';
import type { CircuitBreaker } from './circuit-breaker.js';

// Simple console logger for error handling
const logger = {
  error: (message: string, meta?: Record<string, unknown>) => {
    console.error(`[ERROR] ${message}`, meta || '');
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    console.warn(`[WARN] ${message}`, meta || '');
  },
  info: (message: string, meta?: Record<string, unknown>) => {
    console.log(`[INFO] ${message}`, meta || '');
  },
};

/**
 * Error severity levels for classification.
 */
export enum ErrorSeverity {
  /** Critical errors that require immediate attention */
  CRITICAL = 'critical',
  /** High severity errors that should be retried */
  HIGH = 'high',
  /** Medium severity errors with standard retry */
  MEDIUM = 'medium',
  /** Low severity informational errors */
  LOW = 'low',
}

/**
 * Error categories for classification.
 */
export enum ErrorCategory {
  /** Transient errors that can be retried */
  TRANSIENT = 'transient',
  /** Configuration errors that need manual fix */
  CONFIGURATION = 'configuration',
  /** Validation errors from invalid input */
  VALIDATION = 'validation',
  /** External service errors */
  EXTERNAL = 'external',
  /** Internal system errors */
  INTERNAL = 'internal',
  /** Resource exhaustion errors */
  RESOURCE_EXHAUSTED = 'resource_exhausted',
}

/**
 * Error classification result.
 */
export interface ErrorClassification {
  severity: ErrorSeverity;
  category: ErrorCategory;
  isRetryable: boolean;
  shouldAlert: boolean;
  recoveryStrategy?: RecoveryStrategy;
}

/**
 * Recovery strategies for different error types.
 */
export enum RecoveryStrategy {
  /** Retry with exponential backoff */
  RETRY_EXPONENTIAL = 'retry_exponential',
  /** Retry with fixed delay */
  RETRY_FIXED = 'retry_fixed',
  /** Move to dead letter queue */
  DEAD_LETTER = 'dead_letter',
  /** Fail immediately */
  FAIL_IMMEDIATE = 'fail_immediate',
  /** Circuit breaker open */
  CIRCUIT_BREAKER = 'circuit_breaker',
}

/**
 * Error context for better debugging.
 */
export interface ErrorContext {
  taskId?: string;
  userId?: string;
  operation: string;
  metadata?: Record<string, unknown>;
  originalError: Error;
  timestamp: Date;
}

/**
 * Centralized error handler with classification and recovery.
 */
export class ErrorHandler {
  private deadLetterQueue: DeadLetterQueue;
  private circuitBreaker?: CircuitBreaker;
  private errorCounts: Map<string, number> = new Map();

  constructor(deadLetterQueue: DeadLetterQueue, circuitBreaker?: CircuitBreaker) {
    this.deadLetterQueue = deadLetterQueue;
    this.circuitBreaker = circuitBreaker;
  }

  /**
   * Classify an error to determine handling strategy.
   */
  classifyError(error: Error): ErrorClassification {
    const errorName = error.name.toLowerCase();
    const errorMessage = error.message.toLowerCase();

    // Transient errors - retryable
    if (
      errorName.includes('timeout') ||
      errorName.includes('rate_limit') ||
      errorName.includes('network') ||
      errorMessage.includes('econnrefused') ||
      errorMessage.includes('etimedout')
    ) {
      return {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.TRANSIENT,
        isRetryable: true,
        shouldAlert: false,
        recoveryStrategy: RecoveryStrategy.RETRY_EXPONENTIAL,
      };
    }

    // Configuration errors - not retryable
    if (
      errorName.includes('configuration') ||
      errorName.includes('config') ||
      errorMessage.includes('api_key') ||
      errorMessage.includes('missing') ||
      errorMessage.includes('required')
    ) {
      return {
        severity: ErrorSeverity.CRITICAL,
        category: ErrorCategory.CONFIGURATION,
        isRetryable: false,
        shouldAlert: true,
        recoveryStrategy: RecoveryStrategy.FAIL_IMMEDIATE,
      };
    }

    // Validation errors - not retryable
    if (
      errorName.includes('validation') ||
      errorName.includes('invalid') ||
      errorName.includes('argument')
    ) {
      return {
        severity: ErrorSeverity.MEDIUM,
        category: ErrorCategory.VALIDATION,
        isRetryable: false,
        shouldAlert: false,
        recoveryStrategy: RecoveryStrategy.FAIL_IMMEDIATE,
      };
    }

    // Resource exhausted - circuit breaker
    if (
      errorName.includes('resource') ||
      errorName.includes('quota') ||
      errorName.includes('limit') ||
      errorMessage.includes('too many')
    ) {
      return {
        severity: ErrorSeverity.CRITICAL,
        category: ErrorCategory.RESOURCE_EXHAUSTED,
        isRetryable: true,
        shouldAlert: true,
        recoveryStrategy: RecoveryStrategy.CIRCUIT_BREAKER,
      };
    }

    // External service errors
    if (
      errorName.includes('provider') ||
      errorName.includes('external') ||
      errorName.includes('upstream')
    ) {
      return {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.EXTERNAL,
        isRetryable: true,
        shouldAlert: true,
        recoveryStrategy: RecoveryStrategy.RETRY_EXPONENTIAL,
      };
    }

    // Default - internal error
    return {
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.INTERNAL,
      isRetryable: false,
      shouldAlert: true,
      recoveryStrategy: RecoveryStrategy.DEAD_LETTER,
    };
  }

  /**
   * Handle an error with appropriate recovery strategy.
   */
  async handleError(error: Error, context: ErrorContext, task?: TaskModel): Promise<void> {
    const classification = this.classifyError(error);
    const errorKey = `${context.operation}-${classification.category}`;

    // Track error count
    const count = (this.errorCounts.get(errorKey) || 0) + 1;
    this.errorCounts.set(errorKey, count);

    // Log error with classification
    logger.error('Error handled', {
      error: error.message,
      classification,
      context,
      count,
    });

    // Apply recovery strategy
    switch (classification.recoveryStrategy) {
      case RecoveryStrategy.RETRY_EXPONENTIAL:
      case RecoveryStrategy.RETRY_FIXED:
        // Retry will be handled by caller
        logger.info('Error will be retried', { classification, context });
        break;

      case RecoveryStrategy.CIRCUIT_BREAKER:
        if (this.circuitBreaker) {
          this.circuitBreaker['onFailure']?.();
        }
        logger.warn('Circuit breaker triggered', { classification, context });
        break;

      case RecoveryStrategy.DEAD_LETTER:
        if (task) {
          await this.sendToDeadLetter(task, error, context);
        }
        break;

      case RecoveryStrategy.FAIL_IMMEDIATE:
        logger.error('Failing immediately', { classification, context });
        break;
    }

    // Alert if needed
    if (classification.shouldAlert) {
      await this.sendAlert(error, classification, context);
    }
  }

  /**
   * Send task to dead letter queue.
   */
  private async sendToDeadLetter(
    task: TaskModel,
    error: Error,
    context: ErrorContext,
  ): Promise<void> {
    logger.warn('Sending task to dead letter queue', {
      taskId: task.id,
      error: error.message,
    });

    // Convert TaskModel to QueueMessage format for DLQ
    const dlqEntry = {
      id: task.id,
      traceId: task.traceId || '',
      workflowId: task.rootTaskId,
      payload: task,
      priority: task.priority,
      retryCount: task.metadata?.retryCount ? Number(task.metadata.retryCount) : 0,
      status: 'FAILED' as const,
      createdAt: task.createdAt,
      metadata: {
        ...task.metadata,
        errorType: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
        failedAt: new Date().toISOString(),
        context,
      },
    };

    this.deadLetterQueue.send(dlqEntry);
  }

  /**
   * Send alert for critical errors.
   */
  private async sendAlert(
    error: Error,
    classification: ErrorClassification,
    context: ErrorContext,
  ): Promise<void> {
    // In production, integrate with PagerDuty, Slack, etc.
    logger.error('ALERT: Critical error detected', {
      error: error.message,
      severity: classification.severity,
      category: classification.category,
      context,
    });
  }

  /**
   * Get error statistics.
   */
  getErrorStats(): Record<string, number> {
    return Object.fromEntries(this.errorCounts);
  }

  /**
   * Reset error counts.
   */
  resetCounts(): void {
    this.errorCounts.clear();
  }

  /**
   * Get dead letter queue size.
   */
  getDeadLetterQueueSize(): number {
    return this.deadLetterQueue.size();
  }

  /**
   * List dead letter queue entries.
   */
  listDeadLetterQueue(): unknown[] {
    return this.deadLetterQueue.list();
  }

  /**
   * Clear dead letter queue.
   */
  clearDeadLetterQueue(): void {
    this.deadLetterQueue.clear();
  }
}

/**
 * Error boundary wrapper for safe execution.
 */
export class ErrorBoundary {
  private errorHandler: ErrorHandler;

  constructor(errorHandler: ErrorHandler) {
    this.errorHandler = errorHandler;
  }

  /**
   * Execute operation with error boundary.
   */
  async execute<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    task?: TaskModel,
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      await this.errorHandler.handleError(
        error instanceof Error ? error : new Error(String(error)),
        context,
        task,
      );
      return null;
    }
  }

  /**
   * Execute operation and rethrow if not retryable.
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    task?: TaskModel,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      const classification = this.errorHandler.classifyError(err);

      if (!classification.isRetryable) {
        await this.errorHandler.handleError(err, context, task);
        throw err;
      }

      // Will be retried by caller
      throw err;
    }
  }
}
