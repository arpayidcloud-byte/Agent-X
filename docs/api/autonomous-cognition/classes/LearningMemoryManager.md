[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [autonomous-cognition](../README.md) / LearningMemoryManager

# Class: LearningMemoryManager

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts#L48)

## Constructors

### Constructor

> **new LearningMemoryManager**(): `LearningMemoryManager`

#### Returns

`LearningMemoryManager`

## Methods

### delete()

> **delete**(`key`): `boolean`

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts#L77)

#### Parameters

##### key

`string`

#### Returns

`boolean`

---

### getAll()

> **getAll**(): [`MemoryEntry`](../interfaces/MemoryEntry.md)[]

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts:81](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts#L81)

#### Returns

[`MemoryEntry`](../interfaces/MemoryEntry.md)[]

---

### retrieve()

> **retrieve**(`key`): [`MemoryEntry`](../interfaces/MemoryEntry.md) \| `undefined`

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts:67](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts#L67)

#### Parameters

##### key

`string`

#### Returns

[`MemoryEntry`](../interfaces/MemoryEntry.md) \| `undefined`

---

### store()

> **store**(`key`, `value`, `source`, `ttlMs?`): [`MemoryEntry`](../interfaces/MemoryEntry.md)

Defined in: [packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/planning/KnowledgeEngine.ts#L51)

#### Parameters

##### key

`string`

##### value

`unknown`

##### source

`string`

##### ttlMs?

`number` = `600000`

#### Returns

[`MemoryEntry`](../interfaces/MemoryEntry.md)
