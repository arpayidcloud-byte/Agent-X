[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / IToolRegistry

# Interface: IToolRegistry

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:90](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L90)

## Methods

### find()

> **find**(`toolName`): [`ITool`](ITool.md) \| `undefined`

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:93](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L93)

#### Parameters

##### toolName

`string`

#### Returns

[`ITool`](ITool.md) \| `undefined`

---

### findByCategory()

> **findByCategory**(`category`): [`ITool`](ITool.md)[]

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:96](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L96)

#### Parameters

##### category

`string`

#### Returns

[`ITool`](ITool.md)[]

---

### hasCapability()

> **hasCapability**(`toolName`, `capability`): `boolean`

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:97](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L97)

#### Parameters

##### toolName

`string`

##### capability

keyof [`ToolCapability`](ToolCapability.md)

#### Returns

`boolean`

---

### list()

> **list**(): [`ITool`](ITool.md)[]

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:94](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L94)

#### Returns

[`ITool`](ITool.md)[]

---

### register()

> **register**(`tool`): `void`

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:91](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L91)

#### Parameters

##### tool

[`ITool`](ITool.md)

#### Returns

`void`

---

### resolve()

> **resolve**(`toolName`, `category`): [`ITool`](ITool.md) \| `undefined`

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:95](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L95)

#### Parameters

##### toolName

`string`

##### category

`string`

#### Returns

[`ITool`](ITool.md) \| `undefined`

---

### unregister()

> **unregister**(`toolName`): `void`

Defined in: [packages/shared/tool-sdk/src/interfaces/index.ts:92](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/interfaces/index.ts#L92)

#### Parameters

##### toolName

`string`

#### Returns

`void`
