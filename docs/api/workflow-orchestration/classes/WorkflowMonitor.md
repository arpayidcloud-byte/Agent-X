[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / WorkflowMonitor

# Class: WorkflowMonitor

Defined in: [packages/workflow/workflow-orchestration/src/workflow-monitor.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-monitor.ts#L6)

## Constructors

### Constructor

> **new WorkflowMonitor**(): `WorkflowMonitor`

#### Returns

`WorkflowMonitor`

## Methods

### getState()

> **getState**(`taskId`): `string` \| `undefined`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-monitor.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-monitor.ts#L13)

#### Parameters

##### taskId

`string`

#### Returns

`string` \| `undefined`

---

### getStateCount()

> **getStateCount**(`state`): `number`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-monitor.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-monitor.ts#L17)

#### Parameters

##### state

`string`

#### Returns

`number`

---

### updateState()

> **updateState**(`taskId`, `state`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-monitor.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-monitor.ts#L9)

#### Parameters

##### taskId

`string`

##### state

`string`

#### Returns

`void`
