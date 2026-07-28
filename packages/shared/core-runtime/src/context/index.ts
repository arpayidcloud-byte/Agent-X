import type { ILogger } from '@agentx-fast/shared';
import type { TaskModel } from '../interfaces/task.js';

export interface ICredentialResolver {
  resolve(logicalKey: string): Promise<string>;
}

export interface ExecutionContextConfig {
  traceId: string;
  taskId: string;
  workflowId?: string;
  agentId?: string;
  providerId?: string;
  logger: ILogger;
  credentialResolver: ICredentialResolver;
  task: TaskModel;
}

export class ExecutionContext {
  public readonly traceId: string;
  public readonly taskId: string;
  public readonly workflowId?: string;
  public readonly agentId?: string;
  public readonly providerId?: string;
  public readonly logger: ILogger;
  public readonly credentialResolver: ICredentialResolver;
  public readonly task: TaskModel;

  private scopedVars = new Map<string, unknown>();

  constructor(config: ExecutionContextConfig) {
    this.traceId = config.traceId;
    this.taskId = config.taskId;
    this.workflowId = config.workflowId;
    this.agentId = config.agentId;
    this.providerId = config.providerId;
    this.logger = config.logger.withContext({
      traceId: this.traceId,
      taskId: this.taskId,
      workflowId: this.workflowId,
      agentId: this.agentId,
      providerId: this.providerId,
    });
    this.credentialResolver = config.credentialResolver;
    this.task = config.task;
  }

  public setScopedVar(key: string, value: unknown): void {
    this.scopedVars.set(key, value);
  }

  public getScopedVar<T>(key: string): T | undefined {
    return this.scopedVars.get(key) as T | undefined;
  }

  public cloneWithAgent(agentId: string): ExecutionContext {
    return new ExecutionContext({
      traceId: this.traceId,
      taskId: this.taskId,
      workflowId: this.workflowId,
      agentId,
      providerId: this.providerId,
      logger: this.logger,
      credentialResolver: this.credentialResolver,
      task: this.task,
    });
  }

  public cloneWithProvider(providerId: string): ExecutionContext {
    return new ExecutionContext({
      traceId: this.traceId,
      taskId: this.taskId,
      workflowId: this.workflowId,
      agentId: this.agentId,
      providerId,
      logger: this.logger,
      credentialResolver: this.credentialResolver,
      task: this.task,
    });
  }
}

export * from './task-context-builder.js';
