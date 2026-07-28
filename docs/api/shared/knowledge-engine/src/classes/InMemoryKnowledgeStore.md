[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/knowledge-engine/src](../README.md) / InMemoryKnowledgeStore

# Class: InMemoryKnowledgeStore

Defined in: [packages/shared/knowledge-engine/src/engine.ts:167](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L167)

## Implements

- [`IKnowledgeStore`](../interfaces/IKnowledgeStore.md)

## Constructors

### Constructor

> **new InMemoryKnowledgeStore**(): `InMemoryKnowledgeStore`

#### Returns

`InMemoryKnowledgeStore`

## Methods

### deleteDocument()

> **deleteDocument**(`id`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/knowledge-engine/src/engine.ts:180](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L180)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IKnowledgeStore`](../interfaces/IKnowledgeStore.md).[`deleteDocument`](../interfaces/IKnowledgeStore.md#deletedocument)

---

### getDocument()

> **getDocument**(`id`): `Promise`\<[`KnowledgeDocument`](../interfaces/KnowledgeDocument.md) \| `undefined`>>>>\>

Defined in: [packages/shared/knowledge-engine/src/engine.ts:176](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L176)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`KnowledgeDocument`](../interfaces/KnowledgeDocument.md) \| `undefined`\>

#### Implementation of

[`IKnowledgeStore`](../interfaces/IKnowledgeStore.md).[`getDocument`](../interfaces/IKnowledgeStore.md#getdocument)

---

### getNode()

> **getNode**(`id`): `Promise`\<[`KnowledgeNode`](../interfaces/KnowledgeNode.md) \| `undefined`>>>>\>

Defined in: [packages/shared/knowledge-engine/src/engine.ts:193](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L193)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`KnowledgeNode`](../interfaces/KnowledgeNode.md) \| `undefined`\>

#### Implementation of

[`IKnowledgeStore`](../interfaces/IKnowledgeStore.md).[`getNode`](../interfaces/IKnowledgeStore.md#getnode)

---

### getRelations()

> **getRelations**(`nodeId`): `Promise`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)[]\>

Defined in: [packages/shared/knowledge-engine/src/engine.ts:214](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L214)

#### Parameters

##### nodeId

`string`

#### Returns

`Promise`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)[]\>

#### Implementation of

[`IKnowledgeStore`](../interfaces/IKnowledgeStore.md).[`getRelations`](../interfaces/IKnowledgeStore.md#getrelations)

---

### listDocuments()

> **listDocuments**(): `Promise`\<[`KnowledgeDocument`](../interfaces/KnowledgeDocument.md)[]\>

Defined in: [packages/shared/knowledge-engine/src/engine.ts:185](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L185)

#### Returns

`Promise`\<[`KnowledgeDocument`](../interfaces/KnowledgeDocument.md)[]\>

#### Implementation of

[`IKnowledgeStore`](../interfaces/IKnowledgeStore.md).[`listDocuments`](../interfaces/IKnowledgeStore.md#listdocuments)

---

### saveDocument()

> **saveDocument**(`doc`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/knowledge-engine/src/engine.ts:172](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L172)

#### Parameters

##### doc

[`KnowledgeDocument`](../interfaces/KnowledgeDocument.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IKnowledgeStore`](../interfaces/IKnowledgeStore.md).[`saveDocument`](../interfaces/IKnowledgeStore.md#savedocument)

---

### saveNode()

> **saveNode**(`node`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/knowledge-engine/src/engine.ts:189](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L189)

#### Parameters

##### node

[`KnowledgeNode`](../interfaces/KnowledgeNode.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IKnowledgeStore`](../interfaces/IKnowledgeStore.md).[`saveNode`](../interfaces/IKnowledgeStore.md#savenode)

---

### saveRelation()

> **saveRelation**(`relation`): `Promise`\<`void`>>>>\>

Defined in: [packages/shared/knowledge-engine/src/engine.ts:208](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L208)

#### Parameters

##### relation

[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IKnowledgeStore`](../interfaces/IKnowledgeStore.md).[`saveRelation`](../interfaces/IKnowledgeStore.md#saverelation)

---

### searchNodes()

> **searchNodes**(`query`, `limit?`): `Promise`\<[`KnowledgeNode`](../interfaces/KnowledgeNode.md)[]\>

Defined in: [packages/shared/knowledge-engine/src/engine.ts:197](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/knowledge-engine/src/engine.ts#L197)

#### Parameters

##### query

`string`

##### limit?

`number`

#### Returns

`Promise`\<[`KnowledgeNode`](../interfaces/KnowledgeNode.md)[]\>

#### Implementation of

[`IKnowledgeStore`](../interfaces/IKnowledgeStore.md).[`searchNodes`](../interfaces/IKnowledgeStore.md#searchnodes)
