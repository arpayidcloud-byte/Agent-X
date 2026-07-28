export type ToolCategory = string;

export enum PermissionLevel {
  READ_ONLY = 'READ_ONLY',
  WRITE = 'WRITE',
  NETWORK = 'NETWORK',
  PROCESS = 'PROCESS',
  SYSTEM = 'SYSTEM',
  DESTRUCTIVE = 'DESTRUCTIVE',
}

export type RiskScore = number; // 0 to 100

export type ToolClassification = 'Safe' | 'PotentiallyDestructive' | 'Destructive';

export interface ToolCapability {
  supportsStreaming: boolean;
  supportsCancellation: boolean;
  requiresNetwork: boolean;
  requiresFilesystem: boolean;
}

export interface ToolPermission {
  level: PermissionLevel;
  reason: string;
}

export interface ToolMetadata {
  version: string;
  author: string;
  license?: string;
  tags?: string[];
  classification: ToolClassification;
  riskScore: RiskScore;
}

export interface ToolDefinition {
  name: string;
  description: string;
  category: ToolCategory;
  capabilities: ToolCapability;
  permissions: ToolPermission[];
  parametersSchema: Record<string, unknown>; // JSON Schema
}

export interface ToolManifest {
  id: string;
  version: string;
  kind: 'tool';
  entryPoint: string;
  declaredToolCategories: ToolCategory[];
  tools: ToolDefinition[];
}

export interface ToolResult {
  success: boolean;
  output: string;
  error?: string;
  exitCode?: number;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

export interface ToolExecutionContext {
  taskId: string;
  traceId: string;
  agentRole: string;
  workingDirectory: string;
  [key: string]: unknown;
}

export interface ToolExecutionRequest {
  toolName: string;
  category: ToolCategory;
  arguments: Record<string, unknown>;
  context: ToolExecutionContext;
}

export interface ToolExecutionResponse {
  result: ToolResult;
  executedAt: Date;
}

export interface ITool {
  readonly definition: ToolDefinition;
  readonly metadata: ToolMetadata;
  execute(req: ToolExecutionRequest): Promise<ToolExecutionResponse>;
}

export interface IToolRegistry {
  register(tool: ITool): void;
  unregister(toolName: string): void;
  find(toolName: string): ITool | undefined;
  list(): ITool[];
  resolve(toolName: string, category: ToolCategory): ITool | undefined;
  findByCategory(category: ToolCategory): ITool[];
  hasCapability(toolName: string, capability: keyof ToolCapability): boolean;
}

export interface IToolDiscovery {
  loadManifest(path: string): Promise<ToolManifest>;
  registerFromManifest(manifest: ToolManifest, tools: ITool[]): void;
  validateVersion(version: string): boolean;
  checkCompatibility(manifest: ToolManifest): boolean;
}

export interface PermissionPolicy {
  allowedCategories: ToolCategory[];
  blockedCategories?: ToolCategory[];
  maxRiskScore?: RiskScore;
}

export interface IPermissionResolver {
  resolvePolicyForAgent(agentRole: string): PermissionPolicy;
}

export interface IPermissionEvaluator {
  isAllowed(agentRole: string, category: ToolCategory, riskScore?: RiskScore): boolean;
  evaluate(req: ToolExecutionRequest, tool: ITool): boolean;
}

export interface IToolValidator {
  validateSchema(schema: Record<string, unknown>, args: Record<string, unknown>): boolean;
  validateManifest(manifest: ToolManifest): boolean;
  validateCapabilities(tool: ITool): boolean;
  detectDuplicate(registry: IToolRegistry, toolName: string): boolean;
}

export interface ExecutionHooks {
  preExecute?(req: ToolExecutionRequest, tool: ITool): Promise<void>;
  postExecute?(res: ToolExecutionResponse, req: ToolExecutionRequest, tool: ITool): Promise<void>;
  onError?(error: Error, req: ToolExecutionRequest, tool: ITool): Promise<void>;
}

export interface ToolExecutionPipeline {
  addHook(hook: ExecutionHooks): void;
  execute(req: ToolExecutionRequest, tool: ITool): Promise<ToolExecutionResponse>;
}

export interface IToolExecutor {
  execute(req: ToolExecutionRequest): Promise<ToolExecutionResponse>;
}
