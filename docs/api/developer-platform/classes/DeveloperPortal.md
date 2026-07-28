[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / DeveloperPortal

# Class: DeveloperPortal

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L11)

## Constructors

### Constructor

> **new DeveloperPortal**(): `DeveloperPortal`

#### Returns

`DeveloperPortal`

## Methods

### createPage()

> **createPage**(`title`, `content`, `type`): [`PortalPage`](../interfaces/PortalPage.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L14)

#### Parameters

##### title

`string`

##### content

`string`

##### type

`string`

#### Returns

[`PortalPage`](../interfaces/PortalPage.md)

---

### getAll()

> **getAll**(): [`PortalPage`](../interfaces/PortalPage.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L28)

#### Returns

[`PortalPage`](../interfaces/PortalPage.md)[]

---

### getPage()

> **getPage**(`pageId`): [`PortalPage`](../interfaces/PortalPage.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L24)

#### Parameters

##### pageId

`string`

#### Returns

[`PortalPage`](../interfaces/PortalPage.md) \| `undefined`
