[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-collaboration](../README.md) / CollaborationMetricsCollector

# Class: CollaborationMetricsCollector

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L8)

## Implements

- [`CollaborationMetrics`](../interfaces/CollaborationMetrics.md)

## Constructors

### Constructor

> **new CollaborationMetricsCollector**(): `CollaborationMetricsCollector`

#### Returns

`CollaborationMetricsCollector`

## Properties

### agentsRegistered

> **agentsRegistered**: `number` = `0`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L9)

#### Implementation of

[`CollaborationMetrics`](../interfaces/CollaborationMetrics.md).[`agentsRegistered`](../interfaces/CollaborationMetrics.md#agentsregistered)

---

### averageConsensusTime

> **averageConsensusTime**: `number` = `0`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L19)

#### Implementation of

[`CollaborationMetrics`](../interfaces/CollaborationMetrics.md).[`averageConsensusTime`](../interfaces/CollaborationMetrics.md#averageconsensustime)

---

### averageDelegationTime

> **averageDelegationTime**: `number` = `0`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L18)

#### Implementation of

[`CollaborationMetrics`](../interfaces/CollaborationMetrics.md).[`averageDelegationTime`](../interfaces/CollaborationMetrics.md#averagedelegationtime)

---

### conflictsResolved

> **conflictsResolved**: `number` = `0`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L15)

#### Implementation of

[`CollaborationMetrics`](../interfaces/CollaborationMetrics.md).[`conflictsResolved`](../interfaces/CollaborationMetrics.md#conflictsresolved)

---

### consensusCount

> **consensusCount**: `number` = `0`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L14)

#### Implementation of

[`CollaborationMetrics`](../interfaces/CollaborationMetrics.md).[`consensusCount`](../interfaces/CollaborationMetrics.md#consensuscount)

---

### messagesRouted

> **messagesRouted**: `number` = `0`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L13)

#### Implementation of

[`CollaborationMetrics`](../interfaces/CollaborationMetrics.md).[`messagesRouted`](../interfaces/CollaborationMetrics.md#messagesrouted)

---

### recoveryCount

> **recoveryCount**: `number` = `0`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L16)

#### Implementation of

[`CollaborationMetrics`](../interfaces/CollaborationMetrics.md).[`recoveryCount`](../interfaces/CollaborationMetrics.md#recoverycount)

---

### replayCount

> **replayCount**: `number` = `0`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L17)

#### Implementation of

[`CollaborationMetrics`](../interfaces/CollaborationMetrics.md).[`replayCount`](../interfaces/CollaborationMetrics.md#replaycount)

---

### tasksCompleted

> **tasksCompleted**: `number` = `0`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L11)

#### Implementation of

[`CollaborationMetrics`](../interfaces/CollaborationMetrics.md).[`tasksCompleted`](../interfaces/CollaborationMetrics.md#taskscompleted)

---

### tasksDelegated

> **tasksDelegated**: `number` = `0`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L10)

#### Implementation of

[`CollaborationMetrics`](../interfaces/CollaborationMetrics.md).[`tasksDelegated`](../interfaces/CollaborationMetrics.md#tasksdelegated)

---

### tasksFailed

> **tasksFailed**: `number` = `0`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L12)

#### Implementation of

[`CollaborationMetrics`](../interfaces/CollaborationMetrics.md).[`tasksFailed`](../interfaces/CollaborationMetrics.md#tasksfailed)

## Methods

### recordAgentRegistration()

> **recordAgentRegistration**(): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L21)

#### Returns

`void`

---

### recordCompletion()

> **recordCompletion**(): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L29)

#### Returns

`void`

---

### recordConflictResolution()

> **recordConflictResolution**(): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L43)

#### Returns

`void`

---

### recordConsensus()

> **recordConsensus**(`durationMs`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L38)

#### Parameters

##### durationMs

`number`

#### Returns

`void`

---

### recordDelegation()

> **recordDelegation**(`durationMs`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L24)

#### Parameters

##### durationMs

`number`

#### Returns

`void`

---

### recordFailure()

> **recordFailure**(): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L32)

#### Returns

`void`

---

### recordMessage()

> **recordMessage**(): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L35)

#### Returns

`void`

---

### recordRecovery()

> **recordRecovery**(): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:46](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L46)

#### Returns

`void`

---

### recordReplay()

> **recordReplay**(): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/collaboration-metrics.ts#L49)

#### Returns

`void`
