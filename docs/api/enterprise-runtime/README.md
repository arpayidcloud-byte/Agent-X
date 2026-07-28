[**agentx-workspace**](../README.md)

---

[agentx-workspace](../README.md) / enterprise-runtime

# enterprise-runtime

## Description

Enterprise Runtime, Platform Services & Production Infrastructure barrel exports.

## Enumerations

- [RBACRole](enumerations/RBACRole.md)
- [SpanStatusCode](enumerations/SpanStatusCode.md)

## Classes

- [APIGateway](classes/APIGateway.md)
- [APIKeyManager](classes/APIKeyManager.md)
- [AuditLogging](classes/AuditLogging.md)
- [AuthenticationManager](classes/AuthenticationManager.md)
- [AuthorizationManager](classes/AuthorizationManager.md)
- [AutoscalingSupport](classes/AutoscalingSupport.md)
- [BackgroundJobScheduler](classes/BackgroundJobScheduler.md)
- [ConfigurationCoordinator](classes/ConfigurationCoordinator.md)
- [ConfigurationManager](classes/ConfigurationManager.md)
- [DiagnosticEngine](classes/DiagnosticEngine.md)
- [DistributedCache](classes/DistributedCache.md)
- [DistributedLockManager](classes/DistributedLockManager.md)
- [DistributedTracing](classes/DistributedTracing.md)
- [DockerRuntime](classes/DockerRuntime.md)
- [EventStreaming](classes/EventStreaming.md)
- [ExtensionManager](classes/ExtensionManager.md)
- [FeatureFlagManager](classes/FeatureFlagManager.md)
- [GracefulShutdown](classes/GracefulShutdown.md)
- [HealthEndpoint](classes/HealthEndpoint.md)
- [HighAvailabilitySupport](classes/HighAvailabilitySupport.md)
- [InternalServiceBus](classes/InternalServiceBus.md)
- [InvariantViolationError](classes/InvariantViolationError.md)
- [KubernetesRuntime](classes/KubernetesRuntime.md)
- [LivenessProbe](classes/LivenessProbe.md)
- [MetricsCollector](classes/MetricsCollector.md)
- [MultiTenantManager](classes/MultiTenantManager.md)
- [PluginCoordinator](classes/PluginCoordinator.md)
- [PluginManager](classes/PluginManager.md)
- [QueueManager](classes/QueueManager.md)
- [RBACEngine](classes/RBACEngine.md)
- [ReadinessProbe](classes/ReadinessProbe.md)
- [ResourceManager](classes/ResourceManager.md)
- [RESTGateway](classes/RESTGateway.md)
- [RollingUpgradeSupport](classes/RollingUpgradeSupport.md)
- [RuntimeBootstrapper](classes/RuntimeBootstrapper.md)
- [RuntimeCompatibilityEngine](classes/RuntimeCompatibilityEngine.md)
- [RuntimeConfigurationLoader](classes/RuntimeConfigurationLoader.md)
- [RuntimeEnvironmentManager](classes/RuntimeEnvironmentManager.md)
- [RuntimeHealthManager](classes/RuntimeHealthManager.md)
- [RuntimeLifecycleManager](classes/RuntimeLifecycleManager.md)
- [RuntimeMigrationCoordinator](classes/RuntimeMigrationCoordinator.md)
- [RuntimeOrchestrator](classes/RuntimeOrchestrator.md)
- [RuntimePolicyEngine](classes/RuntimePolicyEngine.md)
- [RuntimeSecurityEngine](classes/RuntimeSecurityEngine.md)
- [RuntimeStateManager](classes/RuntimeStateManager.md)
- [RuntimeSupervisor](classes/RuntimeSupervisor.md)
- [RuntimeUpgradeCoordinator](classes/RuntimeUpgradeCoordinator.md)
- [SecretManager](classes/SecretManager.md)
- [SecretRotation](classes/SecretRotation.md)
- [ServiceCoordinator](classes/ServiceCoordinator.md)
- [ServiceDiscovery](classes/ServiceDiscovery.md)
- [ServiceRegistry](classes/ServiceRegistry.md)
- [SessionManager](classes/SessionManager.md)
- [StructuredLogging](classes/StructuredLogging.md)
- [TenantCoordinator](classes/TenantCoordinator.md)
- [TokenManager](classes/TokenManager.md)
- [WebSocketGateway](classes/WebSocketGateway.md)
- [WorkspaceManager](classes/WorkspaceManager.md)

## Interfaces

- [APIKey](interfaces/APIKey.md)
- [AuditLogEntry](interfaces/AuditLogEntry.md)
- [AuthToken](interfaces/AuthToken.md)
- [AutoscalingPolicy](interfaces/AutoscalingPolicy.md)
- [BusMessage](interfaces/BusMessage.md)
- [CompatibilityEntry](interfaces/CompatibilityEntry.md)
- [ConfigEntry](interfaces/ConfigEntry.md)
- [ContainerConfig](interfaces/ContainerConfig.md)
- [DiagnosticResult](interfaces/DiagnosticResult.md)
- [FeatureFlag](interfaces/FeatureFlag.md)
- [GatewayRoute](interfaces/GatewayRoute.md)
- [HAConfig](interfaces/HAConfig.md)
- [HealthCheckResult](interfaces/HealthCheckResult.md)
- [HealthStatus](interfaces/HealthStatus.md)
- [JobEntry](interfaces/JobEntry.md)
- [KubernetesDeployment](interfaces/KubernetesDeployment.md)
- [LogEntry](interfaces/LogEntry.md)
- [MetricEntry](interfaces/MetricEntry.md)
- [MigrationPlan](interfaces/MigrationPlan.md)
- [OTelBootstrapConfig](interfaces/OTelBootstrapConfig.md)
- [Permission](interfaces/Permission.md)
- [PluginEntry](interfaces/PluginEntry.md)
- [PolicyRule](interfaces/PolicyRule.md)
- [QueueMessage](interfaces/QueueMessage.md)
- [RBACRule](interfaces/RBACRule.md)
- [ResourceQuota](interfaces/ResourceQuota.md)
- [RollingUpgradePlan](interfaces/RollingUpgradePlan.md)
- [RotationEntry](interfaces/RotationEntry.md)
- [RuntimeConfig](interfaces/RuntimeConfig.md)
- [RuntimeInfo](interfaces/RuntimeInfo.md)
- [SecretEntry](interfaces/SecretEntry.md)
- [SecurityEvent](interfaces/SecurityEvent.md)
- [ServiceEntry](interfaces/ServiceEntry.md)
- [SessionEntry](interfaces/SessionEntry.md)
- [Span](interfaces/Span.md)
- [SpanContext](interfaces/SpanContext.md)
- [StreamEvent](interfaces/StreamEvent.md)
- [TenantEntry](interfaces/TenantEntry.md)
- [TenantQuota](interfaces/TenantQuota.md)
- [TokenEntry](interfaces/TokenEntry.md)
- [Tracer](interfaces/Tracer.md)
- [TraceSpan](interfaces/TraceSpan.md)
- [UpgradePlan](interfaces/UpgradePlan.md)
- [WorkspaceEntry](interfaces/WorkspaceEntry.md)

## Type Aliases

- [RuntimeState](type-aliases/RuntimeState.md)

## Variables

- [context](variables/context.md)
- [trace](variables/trace.md)

## Functions

- [bootstrapOpenTelemetry](functions/bootstrapOpenTelemetry.md)
- [getPermissionsForRole](functions/getPermissionsForRole.md)
- [getTracer](functions/getTracer.md)
- [hasPermission](functions/hasPermission.md)
- [shutdownOpenTelemetry](functions/shutdownOpenTelemetry.md)
