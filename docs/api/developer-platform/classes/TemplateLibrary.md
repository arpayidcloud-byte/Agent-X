[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / TemplateLibrary

# Class: TemplateLibrary

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:113](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L113)

## Constructors

### Constructor

> **new TemplateLibrary**(): `TemplateLibrary`

#### Returns

`TemplateLibrary`

## Methods

### add()

> **add**(`name`, `language`, `content`): [`TemplateEntry`](../interfaces/TemplateEntry.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:116](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L116)

#### Parameters

##### name

`string`

##### language

`string`

##### content

`string`

#### Returns

[`TemplateEntry`](../interfaces/TemplateEntry.md)

---

### get()

> **get**(`templateId`): [`TemplateEntry`](../interfaces/TemplateEntry.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:126](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L126)

#### Parameters

##### templateId

`string`

#### Returns

[`TemplateEntry`](../interfaces/TemplateEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`TemplateEntry`](../interfaces/TemplateEntry.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:134](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L134)

#### Returns

[`TemplateEntry`](../interfaces/TemplateEntry.md)[]

---

### getByLanguage()

> **getByLanguage**(`language`): [`TemplateEntry`](../interfaces/TemplateEntry.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:130](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L130)

#### Parameters

##### language

`string`

#### Returns

[`TemplateEntry`](../interfaces/TemplateEntry.md)[]
