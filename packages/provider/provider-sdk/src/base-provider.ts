import type {
  Provider,
  ProviderCapabilities,
  ProviderConfiguration,
  ProviderStatus,
  CompletionRequest,
  CompletionResponse,
} from './interfaces.js';
import { CircuitBreaker, executeWithRetry } from './resilience.js';
import { CostCalculator } from './metrics.js';
import { ProviderTimeoutError } from './errors.js';
import { Tracer, Metrics } from '@agentx-fast/observability';

/**
 * Abstract base class for AI provider implementations.
 * Provides common functionality for completion, health checks, and error handling.
 * @example
 * ```ts
 * class MyProvider extends BaseProvider {
 *   protected async doComplete(req, signal) { ... }
 *   protected mapError(error) { ... }
 * }
 * ```
 */
export abstract class BaseProvider implements Provider {
  public readonly id: string;
  public abstract readonly capabilities: ProviderCapabilities;

  protected config: ProviderConfiguration;
  protected circuitBreaker?: CircuitBreaker;
  protected costCalculator: CostCalculator;
  protected tracer: Tracer;
  protected otelMetrics: Metrics;

  /**
   * Creates a new BaseProvider instance.
   * @param config - Provider configuration including ID, timeouts, and retry policies
   */
  constructor(config: ProviderConfiguration) {
    this.id = config.providerId;
    this.config = config;
    if (config.circuitBreaker) {
      this.circuitBreaker = new CircuitBreaker(config.circuitBreaker);
    }
    this.costCalculator = new CostCalculator();
    this.tracer = new Tracer(`provider-${this.id}`);
    this.otelMetrics = new Metrics();
  }

  /**
   * Executes a completion request with retry and circuit breaker support.
   * @param req - Completion request with prompt, model, and options
   * @returns Completion response with text, tool calls, and usage metrics
   * @throws ProviderTimeoutError if request exceeds timeout
   * @throws Error if circuit breaker is open or request fails
   */
  public async complete(req: CompletionRequest): Promise<CompletionResponse> {
    const span = this.tracer.startSpan('provider-complete');
    span.setAttribute('provider.id', this.id);
    if (req.traceId) {
      span.setAttribute('request.traceId', req.traceId);
    }
    if (req.cancellationToken) {
      span.setAttribute('request.cancellationToken', true);
    }

    const action = async () => {
      const abortController = new AbortController();
      let timeoutId: NodeJS.Timeout | undefined;

      if (req.cancellationToken) {
        req.cancellationToken.addEventListener('abort', () => abortController.abort());
      }

      if (this.config.timeoutPolicy) {
        timeoutId = setTimeout(() => {
          abortController.abort(new ProviderTimeoutError(this.id));
        }, this.config.timeoutPolicy.timeoutMs);
      }

      try {
        const start = Date.now();
        const response = await this.doComplete(req, abortController.signal);
        const latencyMs = Date.now() - start;

        const metrics = this.costCalculator.createMetrics(
          req.traceId,
          this.generateRequestId(),
          this.id,
          response.modelId,
          latencyMs,
          response.usage,
        );

        response.latencyMs = latencyMs;
        response.metrics = metrics;

        span.setAttribute('response.modelId', response.modelId);
        span.setAttribute('response.latencyMs', latencyMs);
        if (response.usage) {
          span.setAttribute('usage.inputTokens', response.usage.inputTokens);
          span.setAttribute('usage.outputTokens', response.usage.outputTokens);
          if (response.usage.totalTokens) {
            span.setAttribute('usage.totalTokens', response.usage.totalTokens);
          }
        }

        return response;
      } catch (e: unknown) {
        if (e instanceof Error && (e.name === 'AbortError' || e instanceof ProviderTimeoutError)) {
          throw new ProviderTimeoutError(this.id, undefined, e);
        }
        throw this.mapError(e);
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    try {
      let res: CompletionResponse;
      if (this.config.retryPolicy) {
        res = await executeWithRetry(action, this.config.retryPolicy, this.id, this.circuitBreaker);
      } else if (this.circuitBreaker && this.circuitBreaker.isOpen()) {
        throw new Error('CircuitBreakerOpenError');
      } else {
        try {
          res = await action();
          if (this.circuitBreaker) this.circuitBreaker.recordSuccess();
        } catch (e) {
          if (this.circuitBreaker) this.circuitBreaker.recordFailure();
          throw e;
        }
      }

      this.otelMetrics.counter('provider_completions_success', 1, { provider: this.id });
      if (res.latencyMs) {
        this.otelMetrics.histogram('provider_latency', res.latencyMs, { provider: this.id });
      }
      span.setStatus({ code: 0 });
      return res;
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      this.otelMetrics.counter('provider_completions_error', 1, {
        provider: this.id,
        error: error.name,
      });
      span.setStatus({ code: 1, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  }

  /**
   * Checks the health status of the provider.
   * @returns Provider status including health and circuit breaker state
   */
  public async checkHealth(): Promise<ProviderStatus> {
    return {
      providerId: this.id,
      health: this.circuitBreaker && this.circuitBreaker.isOpen() ? 'unhealthy' : 'healthy',
      lastCheckedAt: new Date(),
      activeCircuitBreaker: this.circuitBreaker ? this.circuitBreaker.isOpen() : false,
    };
  }

  protected generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  protected abstract doComplete(
    req: CompletionRequest,
    signal: AbortSignal,
  ): Promise<CompletionResponse>;
  protected abstract mapError(error: unknown): Error;
}
