[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / WorkflowIntelligenceMetricsCollector

# Class: WorkflowIntelligenceMetricsCollector

Defined in: [packages/workflow/workflow-orchestration/src/metrics.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/metrics.ts#L29)

## Constructors

### Constructor

> **new WorkflowIntelligenceMetricsCollector**(): `WorkflowIntelligenceMetricsCollector`

#### Returns

`WorkflowIntelligenceMetricsCollector`

## Properties

### conflictCount

> **conflictCount**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/metrics.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/metrics.ts#L40)

---

### goalsCancelled

> **goalsCancelled**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/metrics.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/metrics.ts#L34)

---

### goalsCompleted

> **goalsCompleted**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/metrics.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/metrics.ts#L33)

---

### goalsRunning

> **goalsRunning**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/metrics.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/metrics.ts#L32)

---

### parallelBranches

> **parallelBranches**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/metrics.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/metrics.ts#L38)

---

### recoveryCount

> **recoveryCount**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/metrics.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/metrics.ts#L41)

---

### replanningCount

> **replanningCount**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/metrics.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/metrics.ts#L39)

---

### tasksExecuted

> **tasksExecuted**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/metrics.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/metrics.ts#L35)

---

### tasksFailed

> **tasksFailed**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/metrics.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/metrics.ts#L36)

---

### tasksRecovered

> **tasksRecovered**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/metrics.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/metrics.ts#L37)

---

### workflowsCompleted

> **workflowsCompleted**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/metrics.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/metrics.ts#L31)

---

### workflowsCreated

> **workflowsCreated**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/metrics.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/metrics.ts#L30)

## Methods

### getMetrics()

> **getMetrics**(): [`WorkflowIntelligenceMetrics`](../interfaces/WorkflowIntelligenceMetrics.md)

Defined in: [packages/workflow/workflow-orchestration/src/metrics.ts:54](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/metrics.ts#L54)

#### Returns

[`WorkflowIntelligenceMetrics`](../interfaces/WorkflowIntelligenceMetrics.md)

---

### recordTask()

> **recordTask**(`failed`, `recovered`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/metrics.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/metrics.ts#L48)

#### Parameters

##### failed

`boolean`

##### recovered

`boolean`

#### Returns

`void`

---

### recordWorkflow()

> **recordWorkflow**(`completed`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/metrics.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/metrics.ts#L43)

#### Parameters

##### completed

`boolean`

#### Returns

`void`
