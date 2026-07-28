[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedReplayEngine

# Class: DistributedReplayEngine

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedReplayEngine.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedReplayEngine.ts#L13)

## Constructors

### Constructor

> **new DistributedReplayEngine**(): `DistributedReplayEngine`

#### Returns

`DistributedReplayEngine`

## Methods

### getEntries()

> **getEntries**(`sessionId`): [`ReplayEntry`](../interfaces/ReplayEntry.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedReplayEngine.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedReplayEngine.ts#L41)

#### Parameters

##### sessionId

`string`

#### Returns

[`ReplayEntry`](../interfaces/ReplayEntry.md)[]

---

### getSessions()

> **getSessions**(): `string`[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedReplayEngine.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedReplayEngine.ts#L66)

#### Returns

`string`[]

---

### record()

> **record**(`sessionId`, `nodeId`, `action`, `state`): [`ReplayEntry`](../interfaces/ReplayEntry.md)

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedReplayEngine.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedReplayEngine.ts#L16)

#### Parameters

##### sessionId

`string`

##### nodeId

`string`

##### action

`string`

##### state

`Record`\<`string`, `unknown`\>

#### Returns

[`ReplayEntry`](../interfaces/ReplayEntry.md)

---

### replay()

> **replay**(`sessionId`): [`ReplayEntry`](../interfaces/ReplayEntry.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedReplayEngine.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedReplayEngine.ts#L62)

#### Parameters

##### sessionId

`string`

#### Returns

[`ReplayEntry`](../interfaces/ReplayEntry.md)[]

---

### validate()

> **validate**(`sessionId`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/state/DistributedReplayEngine.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/state/DistributedReplayEngine.ts#L45)

#### Parameters

##### sessionId

`string`

#### Returns

`boolean`
