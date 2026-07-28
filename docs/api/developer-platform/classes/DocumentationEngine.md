[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / DocumentationEngine

# Class: DocumentationEngine

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:202](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L202)

## Constructors

### Constructor

> **new DocumentationEngine**(): `DocumentationEngine`

#### Returns

`DocumentationEngine`

## Methods

### create()

> **create**(`title`, `content`, `category`): [`DocPage`](../interfaces/DocPage.md)

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:205](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L205)

#### Parameters

##### title

`string`

##### content

`string`

##### category

`string`

#### Returns

[`DocPage`](../interfaces/DocPage.md)

---

### get()

> **get**(`pageId`): [`DocPage`](../interfaces/DocPage.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:215](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L215)

#### Parameters

##### pageId

`string`

#### Returns

[`DocPage`](../interfaces/DocPage.md) \| `undefined`

---

### getAll()

> **getAll**(): [`DocPage`](../interfaces/DocPage.md)[]

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:223](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L223)

#### Returns

[`DocPage`](../interfaces/DocPage.md)[]

---

### getByCategory()

> **getByCategory**(`category`): [`DocPage`](../interfaces/DocPage.md)[]

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:219](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L219)

#### Parameters

##### category

`string`

#### Returns

[`DocPage`](../interfaces/DocPage.md)[]
