[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / KnowledgeSynchronizationEngine

# Class: KnowledgeSynchronizationEngine

Defined in: [packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeSynchronizationEngine.ts:3](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeSynchronizationEngine.ts#L3)

## Constructors

### Constructor

> **new KnowledgeSynchronizationEngine**(): `KnowledgeSynchronizationEngine`

#### Returns

`KnowledgeSynchronizationEngine`

## Methods

### detectConflict()

> **detectConflict**(`localEntry`, `remoteEntry`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeSynchronizationEngine.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeSynchronizationEngine.ts#L30)

#### Parameters

##### localEntry

[`KnowledgeEntry`](../interfaces/KnowledgeEntry.md)

##### remoteEntry

[`KnowledgeEntry`](../interfaces/KnowledgeEntry.md)

#### Returns

`boolean`

---

### getSyncHistory()

> **getSyncHistory**(): [`SyncResult`](../interfaces/SyncResult.md)[]

Defined in: [packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeSynchronizationEngine.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeSynchronizationEngine.ts#L47)

#### Returns

[`SyncResult`](../interfaces/SyncResult.md)[]

---

### merge()

> **merge**(`localEntry`, `remoteEntry`): [`KnowledgeEntry`](../interfaces/KnowledgeEntry.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeSynchronizationEngine.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeSynchronizationEngine.ts#L36)

#### Parameters

##### localEntry

[`KnowledgeEntry`](../interfaces/KnowledgeEntry.md)

##### remoteEntry

[`KnowledgeEntry`](../interfaces/KnowledgeEntry.md)

#### Returns

[`KnowledgeEntry`](../interfaces/KnowledgeEntry.md)

---

### synchronize()

> **synchronize**(`localEntry`, `remoteEntry`): [`SyncResult`](../interfaces/SyncResult.md)

Defined in: [packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeSynchronizationEngine.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/domain/knowledge/KnowledgeSynchronizationEngine.ts#L6)

#### Parameters

##### localEntry

[`KnowledgeEntry`](../interfaces/KnowledgeEntry.md)

##### remoteEntry

[`KnowledgeEntry`](../interfaces/KnowledgeEntry.md)

#### Returns

[`SyncResult`](../interfaces/SyncResult.md)
