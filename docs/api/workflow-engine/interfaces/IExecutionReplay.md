[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / IExecutionReplay

# Interface: IExecutionReplay

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:178](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L178)

## Description

Execution replay interface

## Methods

### getSnapshot()

> **getSnapshot**(`workflowId`, `step`): `Promise`\<[`ReplaySnapshot`](ReplaySnapshot.md) \| `undefined`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:180](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L180)

#### Parameters

##### workflowId

`string`

##### step

`number`

#### Returns

`Promise`\<[`ReplaySnapshot`](ReplaySnapshot.md) \| `undefined`\>

---

### startReplay()

> **startReplay**(`workflowId`, `mode`): `Promise`\<[`ReplayHistory`](ReplayHistory.md)>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:179](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L179)

#### Parameters

##### workflowId

`string`

##### mode

[`ReplayMode`](../type-aliases/ReplayMode.md)

#### Returns

`Promise`\<[`ReplayHistory`](ReplayHistory.md)\>

---

### stepForward()

> **stepForward**(`workflowId`): `Promise`\<[`ReplaySnapshot`](ReplaySnapshot.md)>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:181](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L181)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`ReplaySnapshot`](ReplaySnapshot.md)\>
