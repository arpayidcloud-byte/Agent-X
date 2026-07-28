[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedConsensusEngine

# Class: DistributedConsensusEngine

Defined in: [packages/distributed/distributed-cognition/src/domain/consensus/DistributedConsensusEngine.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/consensus/DistributedConsensusEngine.ts#L9)

Invariant: propose() always initializes both this.proposals
and this.votes for the same proposalId.

## Constructors

### Constructor

> **new DistributedConsensusEngine**(): `DistributedConsensusEngine`

#### Returns

`DistributedConsensusEngine`

## Methods

### castVote()

> **castVote**(`proposalId`, `nodeId`, `vote`, `reason`): [`ConsensusVote`](../interfaces/ConsensusVote.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/consensus/DistributedConsensusEngine.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/consensus/DistributedConsensusEngine.ts#L47)

#### Parameters

##### proposalId

`string`

##### nodeId

`string`

##### vote

`boolean`

##### reason

`string`

#### Returns

[`ConsensusVote`](../interfaces/ConsensusVote.md)

---

### getProposal()

> **getProposal**(`proposalId`): [`DistributedProposal`](../interfaces/DistributedProposal.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/domain/consensus/DistributedConsensusEngine.ts:80](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/consensus/DistributedConsensusEngine.ts#L80)

#### Parameters

##### proposalId

`string`

#### Returns

[`DistributedProposal`](../interfaces/DistributedProposal.md) \| `undefined`

---

### getResults()

> **getResults**(): [`ConsensusResult`](../interfaces/ConsensusResult.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/consensus/DistributedConsensusEngine.ts:88](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/consensus/DistributedConsensusEngine.ts#L88)

#### Returns

[`ConsensusResult`](../interfaces/ConsensusResult.md)[]

---

### getVotes()

> **getVotes**(`proposalId`): [`ConsensusVote`](../interfaces/ConsensusVote.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/consensus/DistributedConsensusEngine.ts:84](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/consensus/DistributedConsensusEngine.ts#L84)

#### Parameters

##### proposalId

`string`

#### Returns

[`ConsensusVote`](../interfaces/ConsensusVote.md)[]

---

### propose()

> **propose**(`proposerNode`, `content`): [`DistributedProposal`](../interfaces/DistributedProposal.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/consensus/DistributedConsensusEngine.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/consensus/DistributedConsensusEngine.ts#L29)

#### Parameters

##### proposerNode

`string`

##### content

`Record`\<`string`, `unknown`\>

#### Returns

[`DistributedProposal`](../interfaces/DistributedProposal.md)

---

### resolve()

> **resolve**(`proposalId`, `quorum`): [`ConsensusResult`](../interfaces/ConsensusResult.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/consensus/DistributedConsensusEngine.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/consensus/DistributedConsensusEngine.ts#L63)

#### Parameters

##### proposalId

`string`

##### quorum

`number`

#### Returns

[`ConsensusResult`](../interfaces/ConsensusResult.md)
