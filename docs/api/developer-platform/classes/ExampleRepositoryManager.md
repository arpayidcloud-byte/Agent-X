[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / ExampleRepositoryManager

# Class: ExampleRepositoryManager

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:236](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L236)

## Constructors

### Constructor

> **new ExampleRepositoryManager**(): `ExampleRepositoryManager`

#### Returns

`ExampleRepositoryManager`

## Methods

### add()

> **add**(`title`, `language`, `content`): [`ExampleEntry`](../interfaces/ExampleEntry.md)

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:239](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L239)

#### Parameters

##### title

`string`

##### language

`string`

##### content

`string`

#### Returns

[`ExampleEntry`](../interfaces/ExampleEntry.md)

---

### get()

> **get**(`exampleId`): [`ExampleEntry`](../interfaces/ExampleEntry.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:249](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L249)

#### Parameters

##### exampleId

`string`

#### Returns

[`ExampleEntry`](../interfaces/ExampleEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`ExampleEntry`](../interfaces/ExampleEntry.md)[]

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:257](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L257)

#### Returns

[`ExampleEntry`](../interfaces/ExampleEntry.md)[]

---

### getByLanguage()

> **getByLanguage**(`language`): [`ExampleEntry`](../interfaces/ExampleEntry.md)[]

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:253](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L253)

#### Parameters

##### language

`string`

#### Returns

[`ExampleEntry`](../interfaces/ExampleEntry.md)[]
