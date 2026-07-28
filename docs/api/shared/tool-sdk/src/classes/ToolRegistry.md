[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ToolRegistry

# Class: ToolRegistry

Defined in: [packages/shared/tool-sdk/src/registry/index.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/registry/index.ts#L34)

## Implements

- [`IToolRegistry`](../interfaces/IToolRegistry.md)

## Constructors

### Constructor

> **new ToolRegistry**(): `ToolRegistry`

#### Returns

`ToolRegistry`

## Methods

### find()

> **find**(`toolName`): [`ITool`](../interfaces/ITool.md) \| `undefined`

Defined in: [packages/shared/tool-sdk/src/registry/index.ts:69](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/registry/index.ts#L69)

#### Parameters

##### toolName

`string`

#### Returns

[`ITool`](../interfaces/ITool.md) \| `undefined`

#### Implementation of

[`IToolRegistry`](../interfaces/IToolRegistry.md).[`find`](../interfaces/IToolRegistry.md#find)

---

### findByCategory()

> **findByCategory**(`category`): [`ITool`](../interfaces/ITool.md)[]

Defined in: [packages/shared/tool-sdk/src/registry/index.ts:85](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/registry/index.ts#L85)

#### Parameters

##### category

`string`

#### Returns

[`ITool`](../interfaces/ITool.md)[]

#### Implementation of

[`IToolRegistry`](../interfaces/IToolRegistry.md).[`findByCategory`](../interfaces/IToolRegistry.md#findbycategory)

---

### hasCapability()

> **hasCapability**(`toolName`, `capability`): `boolean`

Defined in: [packages/shared/tool-sdk/src/registry/index.ts:97](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/registry/index.ts#L97)

#### Parameters

##### toolName

`string`

##### capability

keyof [`ToolCapability`](../interfaces/ToolCapability.md)

#### Returns

`boolean`

#### Implementation of

[`IToolRegistry`](../interfaces/IToolRegistry.md).[`hasCapability`](../interfaces/IToolRegistry.md#hascapability)

---

### list()

> **list**(): [`ITool`](../interfaces/ITool.md)[]

Defined in: [packages/shared/tool-sdk/src/registry/index.ts:73](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/registry/index.ts#L73)

#### Returns

[`ITool`](../interfaces/ITool.md)[]

#### Implementation of

[`IToolRegistry`](../interfaces/IToolRegistry.md).[`list`](../interfaces/IToolRegistry.md#list)

---

### register()

> **register**(`tool`): `void`

Defined in: [packages/shared/tool-sdk/src/registry/index.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/registry/index.ts#L38)

#### Parameters

##### tool

[`ITool`](../interfaces/ITool.md)

#### Returns

`void`

#### Implementation of

[`IToolRegistry`](../interfaces/IToolRegistry.md).[`register`](../interfaces/IToolRegistry.md#register)

---

### resolve()

> **resolve**(`toolName`, `category`): [`ITool`](../interfaces/ITool.md) \| `undefined`

Defined in: [packages/shared/tool-sdk/src/registry/index.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/registry/index.ts#L77)

#### Parameters

##### toolName

`string`

##### category

`string`

#### Returns

[`ITool`](../interfaces/ITool.md) \| `undefined`

#### Implementation of

[`IToolRegistry`](../interfaces/IToolRegistry.md).[`resolve`](../interfaces/IToolRegistry.md#resolve)

---

### unregister()

> **unregister**(`toolName`): `void`

Defined in: [packages/shared/tool-sdk/src/registry/index.ts:55](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/registry/index.ts#L55)

#### Parameters

##### toolName

`string`

#### Returns

`void`

#### Implementation of

[`IToolRegistry`](../interfaces/IToolRegistry.md).[`unregister`](../interfaces/IToolRegistry.md#unregister)
