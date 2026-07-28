[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / WorkflowEngine

# Class: WorkflowEngine

Defined in: [packages/workflow/workflow-orchestration/src/workflow-engine.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-engine.ts#L11)

## Constructors

### Constructor

> **new WorkflowEngine**(): `WorkflowEngine`

#### Returns

`WorkflowEngine`

## Properties

### dispatcher

> **dispatcher**: [`WorkflowDispatcher`](WorkflowDispatcher.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-engine.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-engine.ts#L13)

---

### executor

> **executor**: [`WorkflowExecutor`](WorkflowExecutor.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-engine.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-engine.ts#L14)

---

### scheduler

> **scheduler**: [`WorkflowScheduler`](WorkflowScheduler.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-engine.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-engine.ts#L12)

## Methods

### executeGraph()

> **executeGraph**(`graph`, `taskGenerator`): `Promise`\<`unknown`[]\>

Defined in: [packages/workflow/workflow-orchestration/src/workflow-engine.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-engine.ts#L16)

#### Parameters

##### graph

[`WorkflowGraph`](../interfaces/WorkflowGraph.md)

##### taskGenerator

(`nodeId`) => [`WorkflowTask`](../interfaces/WorkflowTask.md)

#### Returns

`Promise`\<`unknown`[]\>
