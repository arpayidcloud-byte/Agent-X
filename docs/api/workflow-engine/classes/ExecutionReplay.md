[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / ExecutionReplay

# Class: ExecutionReplay

Defined in: [packages/workflow/workflow-engine/src/replay.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/replay.ts#L8)

## Constructors

### Constructor

> **new ExecutionReplay**(): `ExecutionReplay`

#### Returns

`ExecutionReplay`

## Methods

### getSnapshot()

> **getSnapshot**(`_workflowId`, `step`): `Promise`\<[`ReplaySnapshot`](../interfaces/ReplaySnapshot.md) \| `undefined`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/replay.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/replay.ts#L26)

#### Parameters

##### \_workflowId

`string`

##### step

`number`

#### Returns

`Promise`\<[`ReplaySnapshot`](../interfaces/ReplaySnapshot.md) \| `undefined`\>

---

### startReplay()

> **startReplay**(`workflowId`, `_mode`): `Promise`\<[`ReplayHistory`](../interfaces/ReplayHistory.md)>>>>\>

Defined in: [packages/workflow/workflow-engine/src/replay.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/replay.ts#L9)

#### Parameters

##### workflowId

`string`

##### \_mode

[`ReplayMode`](../type-aliases/ReplayMode.md)

#### Returns

`Promise`\<[`ReplayHistory`](../interfaces/ReplayHistory.md)\>

---

### stepForward()

> **stepForward**(`_workflowId`): `Promise`\<[`ReplaySnapshot`](../interfaces/ReplaySnapshot.md)>>>>\>

Defined in: [packages/workflow/workflow-engine/src/replay.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/replay.ts#L36)

#### Parameters

##### \_workflowId

`string`

#### Returns

`Promise`\<[`ReplaySnapshot`](../interfaces/ReplaySnapshot.md)\>
