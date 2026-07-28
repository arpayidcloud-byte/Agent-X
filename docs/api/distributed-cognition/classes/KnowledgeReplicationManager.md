[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / KnowledgeReplicationManager

# Class: KnowledgeReplicationManager

Defined in: [packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeReplicationManager.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeReplicationManager.ts#L11)

## Constructors

### Constructor

> **new KnowledgeReplicationManager**(): `KnowledgeReplicationManager`

#### Returns

`KnowledgeReplicationManager`

## Methods

### get()

> **get**(`entryId`): [`KnowledgeEntry`](../interfaces/KnowledgeEntry.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeReplicationManager.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeReplicationManager.ts#L20)

#### Parameters

##### entryId

`string`

#### Returns

[`KnowledgeEntry`](../interfaces/KnowledgeEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`KnowledgeEntry`](../interfaces/KnowledgeEntry.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeReplicationManager.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeReplicationManager.ts#L56)

#### Returns

[`KnowledgeEntry`](../interfaces/KnowledgeEntry.md)[]

---

### getByKey()

> **getByKey**(`key`): [`KnowledgeEntry`](../interfaces/KnowledgeEntry.md) \| `undefined`

Defined in: [packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeReplicationManager.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeReplicationManager.ts#L24)

#### Parameters

##### key

`string`

#### Returns

[`KnowledgeEntry`](../interfaces/KnowledgeEntry.md) \| `undefined`

---

### getReplicas()

> **getReplicas**(`entryId`): [`KnowledgeReplica`](../interfaces/KnowledgeReplica.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeReplicationManager.ts:52](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeReplicationManager.ts#L52)

#### Parameters

##### entryId

`string`

#### Returns

[`KnowledgeReplica`](../interfaces/KnowledgeReplica.md)[]

---

### replicate()

> **replicate**(`entryId`, `nodeId`): [`KnowledgeReplica`](../interfaces/KnowledgeReplica.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeReplicationManager.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeReplicationManager.ts#L31)

#### Parameters

##### entryId

`string`

##### nodeId

`string`

#### Returns

[`KnowledgeReplica`](../interfaces/KnowledgeReplica.md)

---

### store()

> **store**(`entry`): [`KnowledgeEntry`](../interfaces/KnowledgeEntry.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeReplicationManager.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeReplicationManager.ts#L15)

#### Parameters

##### entry

[`KnowledgeEntry`](../interfaces/KnowledgeEntry.md)

#### Returns

[`KnowledgeEntry`](../interfaces/KnowledgeEntry.md)
