[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/knowledge-engine/src](../README.md) / KnowledgeEngine

# Class: KnowledgeEngine

Defined in: [packages/shared/knowledge-engine/src/engine.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L13)

## Implements

- [`IKnowledgeEngine`](../interfaces/IKnowledgeEngine.md)

## Constructors

### Constructor

> **new KnowledgeEngine**(`store`, `eventBus`): `KnowledgeEngine`

Defined in: [packages/shared/knowledge-engine/src/engine.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L21)

#### Parameters

##### store

[`IKnowledgeStore`](../interfaces/IKnowledgeStore.md)

##### eventBus

`IEventBus`

#### Returns

`KnowledgeEngine`

## Methods

### createRelationship()

> **createRelationship**(`sourceId`, `targetId`, `type`, `metadata?`): `Promise`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)>>>>\>

Defined in: [packages/shared/knowledge-engine/src/engine.ts:105](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L105)

#### Parameters

##### sourceId

`string`

##### targetId

`string`

##### type

`string`

##### metadata?

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)\>

#### Implementation of

[`IKnowledgeEngine`](../interfaces/IKnowledgeEngine.md).[`createRelationship`](../interfaces/IKnowledgeEngine.md#createrelationship)

---

### delete()

> **delete**(`documentId`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/knowledge-engine/src/engine.ts:99](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L99)

#### Parameters

##### documentId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IKnowledgeEngine`](../interfaces/IKnowledgeEngine.md).[`delete`](../interfaces/IKnowledgeEngine.md#delete)

---

### getMetrics()

> **getMetrics**(): [`KnowledgeMetrics`](../interfaces/KnowledgeMetrics.md)

Defined in: [packages/shared/knowledge-engine/src/engine.ts:153](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L153)

#### Returns

[`KnowledgeMetrics`](../interfaces/KnowledgeMetrics.md)

#### Implementation of

[`IKnowledgeEngine`](../interfaces/IKnowledgeEngine.md).[`getMetrics`](../interfaces/IKnowledgeEngine.md#getmetrics)

---

### ingest()

> **ingest**(`data`): `Promise`\<[`KnowledgeDocument`](../interfaces/KnowledgeDocument.md)>>>>\>

Defined in: [packages/shared/knowledge-engine/src/engine.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L26)

#### Parameters

##### data

`Partial`\<[`KnowledgeDocument`](../interfaces/KnowledgeDocument.md)\>

#### Returns

`Promise`\<[`KnowledgeDocument`](../interfaces/KnowledgeDocument.md)\>

#### Implementation of

[`IKnowledgeEngine`](../interfaces/IKnowledgeEngine.md).[`ingest`](../interfaces/IKnowledgeEngine.md#ingest)

---

### retrieve()

> **retrieve**(`query`): `Promise`\<[`KnowledgeNode`](../interfaces/KnowledgeNode.md)[]\>

Defined in: [packages/shared/knowledge-engine/src/engine.ts:58](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L58)

#### Parameters

##### query

[`KnowledgeQuery`](../interfaces/KnowledgeQuery.md)

#### Returns

`Promise`\<[`KnowledgeNode`](../interfaces/KnowledgeNode.md)[]\>

#### Implementation of

[`IKnowledgeEngine`](../interfaces/IKnowledgeEngine.md).[`retrieve`](../interfaces/IKnowledgeEngine.md#retrieve)

---

### traverse()

> **traverse**(`startNodeId`, `maxDepth?`): `Promise`\<[`KnowledgeGraph`](../interfaces/KnowledgeGraph.md)>>>>\>

Defined in: [packages/shared/knowledge-engine/src/engine.ts:126](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L126)

#### Parameters

##### startNodeId

`string`

##### maxDepth?

`number` = `1`

#### Returns

`Promise`\<[`KnowledgeGraph`](../interfaces/KnowledgeGraph.md)\>

#### Implementation of

[`IKnowledgeEngine`](../interfaces/IKnowledgeEngine.md).[`traverse`](../interfaces/IKnowledgeEngine.md#traverse)

---

### update()

> **update**(`documentId`, `updates`): `Promise`\<[`KnowledgeDocument`](../interfaces/KnowledgeDocument.md)>>>>\>

Defined in: [packages/shared/knowledge-engine/src/engine.ts:69](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L69)

#### Parameters

##### documentId

`string`

##### updates

`Partial`\<[`KnowledgeDocument`](../interfaces/KnowledgeDocument.md)\>

#### Returns

`Promise`\<[`KnowledgeDocument`](../interfaces/KnowledgeDocument.md)\>

#### Implementation of

[`IKnowledgeEngine`](../interfaces/IKnowledgeEngine.md).[`update`](../interfaces/IKnowledgeEngine.md#update)
