[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/knowledge-engine/src](../README.md) / IKnowledgeEngine

# Interface: IKnowledgeEngine

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L6)

## Methods

### createRelationship()

> **createRelationship**(`sourceId`, `targetId`, `type`, `metadata?`): `Promise`\<[`KnowledgeRelation`](KnowledgeRelation.md)>>>>\>

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L11)

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

`Promise`\<[`KnowledgeRelation`](KnowledgeRelation.md)\>

---

### delete()

> **delete**(`documentId`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L10)

#### Parameters

##### documentId

`string`

#### Returns

`Promise`\<`void`\>

---

### getMetrics()

> **getMetrics**(): [`KnowledgeMetrics`](KnowledgeMetrics.md)

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L18)

#### Returns

[`KnowledgeMetrics`](KnowledgeMetrics.md)

---

### ingest()

> **ingest**(`document`): `Promise`\<[`KnowledgeDocument`](KnowledgeDocument.md)>>>>\>

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L7)

#### Parameters

##### document

`Partial`\<[`KnowledgeDocument`](KnowledgeDocument.md)\>

#### Returns

`Promise`\<[`KnowledgeDocument`](KnowledgeDocument.md)\>

---

### retrieve()

> **retrieve**(`query`): `Promise`\<[`KnowledgeNode`](KnowledgeNode.md)[]\>

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L8)

#### Parameters

##### query

[`KnowledgeQuery`](KnowledgeQuery.md)

#### Returns

`Promise`\<[`KnowledgeNode`](KnowledgeNode.md)[]\>

---

### traverse()

> **traverse**(`startNodeId`, `maxDepth?`): `Promise`\<[`KnowledgeGraph`](KnowledgeGraph.md)>>>>\>

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L17)

#### Parameters

##### startNodeId

`string`

##### maxDepth?

`number`

#### Returns

`Promise`\<[`KnowledgeGraph`](KnowledgeGraph.md)\>

---

### update()

> **update**(`documentId`, `updates`): `Promise`\<[`KnowledgeDocument`](KnowledgeDocument.md)>>>>\>

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L9)

#### Parameters

##### documentId

`string`

##### updates

`Partial`\<[`KnowledgeDocument`](KnowledgeDocument.md)\>

#### Returns

`Promise`\<[`KnowledgeDocument`](KnowledgeDocument.md)\>
