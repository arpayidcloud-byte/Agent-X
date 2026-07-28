[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/knowledge-engine/src](../README.md) / IKnowledgeStore

# Interface: IKnowledgeStore

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:64](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L64)

## Methods

### deleteDocument()

> **deleteDocument**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:67](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L67)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

---

### getDocument()

> **getDocument**(`id`): `Promise`\<[`KnowledgeDocument`](KnowledgeDocument.md) \| `undefined`>>>>\>

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L66)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`KnowledgeDocument`](KnowledgeDocument.md) \| `undefined`\>

---

### getNode()

> **getNode**(`id`): `Promise`\<[`KnowledgeNode`](KnowledgeNode.md) \| `undefined`>>>>\>

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:71](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L71)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`KnowledgeNode`](KnowledgeNode.md) \| `undefined`\>

---

### getRelations()

> **getRelations**(`nodeId`): `Promise`\<[`KnowledgeRelation`](KnowledgeRelation.md)[]\>

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:75](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L75)

#### Parameters

##### nodeId

`string`

#### Returns

`Promise`\<[`KnowledgeRelation`](KnowledgeRelation.md)[]\>

---

### listDocuments()

> **listDocuments**(): `Promise`\<[`KnowledgeDocument`](KnowledgeDocument.md)[]\>

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:68](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L68)

#### Returns

`Promise`\<[`KnowledgeDocument`](KnowledgeDocument.md)[]\>

---

### saveDocument()

> **saveDocument**(`doc`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:65](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L65)

#### Parameters

##### doc

[`KnowledgeDocument`](KnowledgeDocument.md)

#### Returns

`Promise`\<`void`\>

---

### saveNode()

> **saveNode**(`node`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:70](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L70)

#### Parameters

##### node

[`KnowledgeNode`](KnowledgeNode.md)

#### Returns

`Promise`\<`void`\>

---

### saveRelation()

> **saveRelation**(`relation`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:74](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L74)

#### Parameters

##### relation

[`KnowledgeRelation`](KnowledgeRelation.md)

#### Returns

`Promise`\<`void`\>

---

### searchNodes()

> **searchNodes**(`query`, `limit?`): `Promise`\<[`KnowledgeNode`](KnowledgeNode.md)[]\>

Defined in: [packages/shared/knowledge-engine/src/interfaces.ts:72](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/interfaces.ts#L72)

#### Parameters

##### query

`string`

##### limit?

`number`

#### Returns

`Promise`\<[`KnowledgeNode`](KnowledgeNode.md)[]\>
