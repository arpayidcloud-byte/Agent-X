[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedLearningSynchronizer

# Class: DistributedLearningSynchronizer

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedLearningSynchronizer.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedLearningSynchronizer.ts#L12)

## Constructors

### Constructor

> **new DistributedLearningSynchronizer**(`knowledgeReplication`): `DistributedLearningSynchronizer`

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedLearningSynchronizer.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedLearningSynchronizer.ts#L15)

#### Parameters

##### knowledgeReplication

[`KnowledgeReplicationManager`](KnowledgeReplicationManager.md)

#### Returns

`DistributedLearningSynchronizer`

## Methods

### getResults()

> **getResults**(): [`LearningSyncResult`](../interfaces/LearningSyncResult.md)[]

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedLearningSynchronizer.ts:46](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedLearningSynchronizer.ts#L46)

#### Returns

[`LearningSyncResult`](../interfaces/LearningSyncResult.md)[]

---

### synchronize()

> **synchronize**(`sessionId`, `remoteEntries`): [`LearningSyncResult`](../interfaces/LearningSyncResult.md)

Defined in: [packages/distributed/distributed-cognition/src/application/coordinator/DistributedLearningSynchronizer.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/application/coordinator/DistributedLearningSynchronizer.ts#L17)

#### Parameters

##### sessionId

`string`

##### remoteEntries

[`KnowledgeEntry`](../interfaces/KnowledgeEntry.md)[]

#### Returns

[`LearningSyncResult`](../interfaces/LearningSyncResult.md)
