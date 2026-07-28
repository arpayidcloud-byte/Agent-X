[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / WorkflowStatisticsCollector

# Class: WorkflowStatisticsCollector

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L23)

## Constructors

### Constructor

> **new WorkflowStatisticsCollector**(): `WorkflowStatisticsCollector`

#### Returns

`WorkflowStatisticsCollector`

## Properties

### conflictCount

> **conflictCount**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L34)

---

### goalsCancelled

> **goalsCancelled**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L28)

---

### goalsCompleted

> **goalsCompleted**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L27)

---

### goalsRunning

> **goalsRunning**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L26)

---

### parallelBranches

> **parallelBranches**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L32)

---

### recoveryCount

> **recoveryCount**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L35)

---

### replanningCount

> **replanningCount**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L33)

---

### tasksExecuted

> **tasksExecuted**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L29)

---

### tasksFailed

> **tasksFailed**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L30)

---

### tasksRecovered

> **tasksRecovered**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L31)

---

### workflowsCompleted

> **workflowsCompleted**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L25)

---

### workflowsCreated

> **workflowsCreated**: `number` = `0`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L24)

## Methods

### getMetrics()

> **getMetrics**(): [`WorkflowMetrics`](../interfaces/WorkflowMetrics.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:52](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L52)

#### Returns

[`WorkflowMetrics`](../interfaces/WorkflowMetrics.md)

---

### recordFailure()

> **recordFailure**(): `void`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L48)

#### Returns

`void`

---

### recordTask()

> **recordTask**(`failed`, `recovered`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L42)

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

Defined in: [packages/workflow/workflow-orchestration/src/workflow-statistics.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-statistics.ts#L37)

#### Parameters

##### completed

`boolean`

#### Returns

`void`
