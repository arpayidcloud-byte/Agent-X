[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/context-engine/src](../README.md) / IContextEngine

# Interface: IContextEngine

Defined in: [packages/shared/context-engine/src/interfaces.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/interfaces.ts#L6)

## Methods

### compressContext()

> **compressContext**(`contextId`, `targetTokens`): `Promise`\<[`ContextSnapshot`](ContextSnapshot.md)>>>>\>

Defined in: [packages/shared/context-engine/src/interfaces.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/interfaces.ts#L14)

#### Parameters

##### contextId

`string`

##### targetTokens

`number`

#### Returns

`Promise`\<[`ContextSnapshot`](ContextSnapshot.md)\>

---

### createContext()

> **createContext**(`scope`, `initialData?`): `Promise`\<[`ContextSnapshot`](ContextSnapshot.md)>>>>\>

Defined in: [packages/shared/context-engine/src/interfaces.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/interfaces.ts#L7)

#### Parameters

##### scope

[`ContextScope`](../type-aliases/ContextScope.md)

##### initialData?

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`ContextSnapshot`](ContextSnapshot.md)\>

---

### getContext()

> **getContext**(`contextId`): `Promise`\<[`ContextSnapshot`](ContextSnapshot.md) \| `undefined`>>>>\>

Defined in: [packages/shared/context-engine/src/interfaces.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/interfaces.ts#L12)

#### Parameters

##### contextId

`string`

#### Returns

`Promise`\<[`ContextSnapshot`](ContextSnapshot.md) \| `undefined`\>

---

### mergeContexts()

> **mergeContexts**(`sourceIds`, `targetScope`): `Promise`\<[`ContextSnapshot`](ContextSnapshot.md)>>>>\>

Defined in: [packages/shared/context-engine/src/interfaces.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/interfaces.ts#L13)

#### Parameters

##### sourceIds

`string`[]

##### targetScope

[`ContextScope`](../type-aliases/ContextScope.md)

#### Returns

`Promise`\<[`ContextSnapshot`](ContextSnapshot.md)\>

---

### updateContext()

> **updateContext**(`contextId`, `updates`): `Promise`\<[`ContextSnapshot`](ContextSnapshot.md)>>>>\>

Defined in: [packages/shared/context-engine/src/interfaces.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/interfaces.ts#L11)

#### Parameters

##### contextId

`string`

##### updates

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`ContextSnapshot`](ContextSnapshot.md)\>

---

### validateContext()

> **validateContext**(`contextId`): `Promise`\<`boolean`>>>>\>

Defined in: [packages/shared/context-engine/src/interfaces.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/interfaces.ts#L15)

#### Parameters

##### contextId

`string`

#### Returns

`Promise`\<`boolean`\>
