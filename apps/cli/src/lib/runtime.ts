import { ProductionRuntime } from '@agentx-fast/runtime-production';
import { Scheduler, InMemoryEventBus } from '@agentx-fast/core-runtime';
import type { ITaskRepository, IEventBus } from '@agentx-fast/core-runtime';
import { InMemoryTaskRepository } from './in-memory-task-repository.js';
import { ProviderRegistry, CredentialResolver, ProviderFactory } from '@agentx-fast/provider-sdk';
import { CoderAgent, ReviewerAgent, TesterAgent, SecurityAgent } from '@agentx-fast/agent-platform';
import { AgentRegistry } from './agent-registry.js';

let _runtime: ProductionRuntime | null = null;
let _testRuntime: {
  scheduler: Scheduler;
  bus: IEventBus;
  taskRepo: ITaskRepository;
  agentRegistry: AgentRegistry;
  providerRegistry: ProviderRegistry;
} | null = null;

const USE_TEST_RUNTIME = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';

/**
 * Creates a ProviderRegistry with available providers.
 * @returns Configured ProviderRegistry with registered providers
 * @example
 * ```ts
 * const registry = createProviderRegistry();
 * ```
 */
function createProviderRegistry(): ProviderRegistry {
  const registry = new ProviderRegistry();
  const credentialResolver = new CredentialResolver();
  const factory = new ProviderFactory(credentialResolver);

  // Register Anthropic provider if API key is available
  try {
    const anthropic = factory.createProvider({
      providerId: 'anthropic',
      defaultModelId: 'claude-sonnet-4-20250514',
    });
    registry.register(anthropic);
  } catch (error) {
    console.warn('Anthropic provider not configured (missing API key)');
  }

  return registry;
}

/**
 * Creates an AgentRegistry with core agents registered.
 * @param providerRegistry - Registry of AI providers for agent execution
 * @returns Configured AgentRegistry with coder, reviewer, tester, and security agents
 * @example
 * ```ts
 * const agentRegistry = createAgentRegistry(providerRegistry);
 * ```
 */
function createAgentRegistry(providerRegistry: ProviderRegistry): AgentRegistry {
  const registry = new AgentRegistry();

  // Register core agents with shared ProviderRegistry
  registry.register(new CoderAgent('coder-1', { providerId: 'anthropic' }, providerRegistry));
  registry.register(new ReviewerAgent('reviewer-1', { providerId: 'anthropic' }, providerRegistry));
  registry.register(new TesterAgent('tester-1', { providerId: 'anthropic' }, providerRegistry));
  registry.register(new SecurityAgent('security-1', { providerId: 'anthropic' }, providerRegistry));

  return registry;
}

/**
 * Gets or creates the runtime instance for the application.
 * Returns a test runtime in test environments (NODE_ENV=test or VITEST=true),
 * otherwise returns a production runtime.
 * @returns Runtime components including scheduler, event bus, task repository, and registries
 * @example
 * ```ts
 * const runtime = getRuntime();
 * await runtime.scheduler.enqueue(task);
 * ```
 */
export function getRuntime(): {
  scheduler: Scheduler;
  bus: IEventBus;
  prisma?: unknown;
  taskRepo: ITaskRepository;
  agentRegistry: AgentRegistry;
  providerRegistry: ProviderRegistry;
} {
  if (USE_TEST_RUNTIME) {
    if (!_testRuntime) {
      const taskRepo = new InMemoryTaskRepository();
      const bus = new InMemoryEventBus();
      const providerRegistry = createProviderRegistry();
      const agentRegistry = createAgentRegistry(providerRegistry);
      const scheduler = new Scheduler(bus, taskRepo);
      // Wire agent registry to scheduler
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (scheduler as unknown as { setAgentRegistry: (r: unknown) => void }).setAgentRegistry(
        agentRegistry,
      );
      _testRuntime = { scheduler, bus, taskRepo, agentRegistry, providerRegistry };
    }
    return _testRuntime;
  }

  if (!_runtime) {
    _runtime = new ProductionRuntime(process.env.REDIS_URL || 'redis://localhost:6379');
    _runtime.start().catch(console.error);
  }
  return {
    scheduler: _runtime.scheduler,
    bus: _runtime.eventBus,
    prisma: _runtime.prisma,
    taskRepo: _runtime.taskRepo,
    agentRegistry: new AgentRegistry() as InstanceType<typeof AgentRegistry>,
    providerRegistry: new ProviderRegistry() as InstanceType<typeof ProviderRegistry>,
  };
}

/**
 * Resets and stops the runtime instance.
 * Clears both production and test runtime instances.
 * @example
 * ```ts
 * resetRuntime();
 * ```
 */
export function resetRuntime(): void {
  if (_runtime) {
    _runtime.stop().catch(console.error);
    _runtime = null;
  }
  if (_testRuntime) {
    _testRuntime = null;
  }
}
