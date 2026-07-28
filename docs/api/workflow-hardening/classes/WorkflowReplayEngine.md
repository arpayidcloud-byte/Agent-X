[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-hardening](../README.md) / WorkflowReplayEngine

# Class: WorkflowReplayEngine

Defined in: [packages/workflow/workflow-hardening/src/replay-engine.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/replay-engine.ts#L8)

## Constructors

### Constructor

> **new WorkflowReplayEngine**(): `WorkflowReplayEngine`

#### Returns

`WorkflowReplayEngine`

## Methods

### fullReplay()

> **fullReplay**(`sessionId`, `steps`): `Promise`\<[`ReplayResult`](../interfaces/ReplayResult.md)>>>>\>

Defined in: [packages/workflow/workflow-hardening/src/replay-engine.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/replay-engine.ts#L11)

#### Parameters

##### sessionId

`string`

##### steps

`string`[]

#### Returns

`Promise`\<[`ReplayResult`](../interfaces/ReplayResult.md)\>

---

### getHistory()

> **getHistory**(): [`ReplayResult`](../interfaces/ReplayResult.md)[]

Defined in: [packages/workflow/workflow-hardening/src/replay-engine.ts:103](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/replay-engine.ts#L103)

#### Returns

[`ReplayResult`](../interfaces/ReplayResult.md)[]

---

### partialReplay()

> **partialReplay**(`sessionId`, `steps`, `startStep`, `endStep`): `Promise`\<[`ReplayResult`](../interfaces/ReplayResult.md)>>>>\>

Defined in: [packages/workflow/workflow-hardening/src/replay-engine.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/replay-engine.ts#L34)

#### Parameters

##### sessionId

`string`

##### steps

`string`[]

##### startStep

`number`

##### endStep

`number`

#### Returns

`Promise`\<[`ReplayResult`](../interfaces/ReplayResult.md)\>

---

### replayFromCheckpoint()

> **replayFromCheckpoint**(`sessionId`, `checkpointData`): `Promise`\<[`ReplayResult`](../interfaces/ReplayResult.md)>>>>\>

Defined in: [packages/workflow/workflow-hardening/src/replay-engine.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/replay-engine.ts#L57)

#### Parameters

##### sessionId

`string`

##### checkpointData

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`ReplayResult`](../interfaces/ReplayResult.md)\>

---

### replayUntilStep()

> **replayUntilStep**(`sessionId`, `steps`, `untilStep`): `Promise`\<[`ReplayResult`](../interfaces/ReplayResult.md)>>>>\>

Defined in: [packages/workflow/workflow-hardening/src/replay-engine.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/replay-engine.ts#L77)

#### Parameters

##### sessionId

`string`

##### steps

`string`[]

##### untilStep

`number`

#### Returns

`Promise`\<[`ReplayResult`](../interfaces/ReplayResult.md)\>

---

### validateReplay()

> **validateReplay**(`replay`): `boolean`

Defined in: [packages/workflow/workflow-hardening/src/replay-engine.ts:99](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/replay-engine.ts#L99)

#### Parameters

##### replay

[`ReplayResult`](../interfaces/ReplayResult.md)

#### Returns

`boolean`
