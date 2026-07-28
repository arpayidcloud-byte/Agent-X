[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-reasoning](../README.md) / ConsensusManager

# Class: ConsensusManager

Defined in: [packages/agent/multi-agent-reasoning/src/domain/consensus/ConsensusManager.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/consensus/ConsensusManager.ts#L16)

## Constructors

### Constructor

> **new ConsensusManager**(): `ConsensusManager`

#### Returns

`ConsensusManager`

## Methods

### castVote()

> **castVote**(`roundId`, `agentId`, `vote`): `void`

Defined in: [packages/agent/multi-agent-reasoning/src/domain/consensus/ConsensusManager.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/consensus/ConsensusManager.ts#L32)

#### Parameters

##### roundId

`string`

##### agentId

`string`

##### vote

`boolean`

#### Returns

`void`

---

### getResults()

> **getResults**(): [`ConsensusResult`](../interfaces/ConsensusResult.md)[]

Defined in: [packages/agent/multi-agent-reasoning/src/domain/consensus/ConsensusManager.ts:76](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/consensus/ConsensusManager.ts#L76)

#### Returns

[`ConsensusResult`](../interfaces/ConsensusResult.md)[]

---

### getRound()

> **getRound**(`roundId`): [`ConsensusRound`](../interfaces/ConsensusRound.md) \| `undefined`

Defined in: [packages/agent/multi-agent-reasoning/src/domain/consensus/ConsensusManager.ts:72](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/consensus/ConsensusManager.ts#L72)

#### Parameters

##### roundId

`string`

#### Returns

[`ConsensusRound`](../interfaces/ConsensusRound.md) \| `undefined`

---

### resolveRound()

> **resolveRound**(`roundId`): [`ConsensusResult`](../interfaces/ConsensusResult.md)

Defined in: [packages/agent/multi-agent-reasoning/src/domain/consensus/ConsensusManager.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/consensus/ConsensusManager.ts#L49)

#### Parameters

##### roundId

`string`

#### Returns

[`ConsensusResult`](../interfaces/ConsensusResult.md)

---

### startRound()

> **startRound**(`proposalId`, `agents`): [`ConsensusRound`](../interfaces/ConsensusRound.md)

Defined in: [packages/agent/multi-agent-reasoning/src/domain/consensus/ConsensusManager.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/consensus/ConsensusManager.ts#L20)

#### Parameters

##### proposalId

`string`

##### agents

`string`[]

#### Returns

[`ConsensusRound`](../interfaces/ConsensusRound.md)
