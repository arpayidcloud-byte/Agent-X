[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / ReleaseManager

# Class: ReleaseManager

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:158](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L158)

## Constructors

### Constructor

> **new ReleaseManager**(): `ReleaseManager`

#### Returns

`ReleaseManager`

## Methods

### archive()

> **archive**(`releaseId`): `void`

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:182](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L182)

#### Parameters

##### releaseId

`string`

#### Returns

`void`

---

### get()

> **get**(`releaseId`): [`ReleaseEntry`](../interfaces/ReleaseEntry.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:178](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L178)

#### Parameters

##### releaseId

`string`

#### Returns

[`ReleaseEntry`](../interfaces/ReleaseEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`ReleaseEntry`](../interfaces/ReleaseEntry.md)[]

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:189](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L189)

#### Returns

[`ReleaseEntry`](../interfaces/ReleaseEntry.md)[]

---

### publish()

> **publish**(`packageName`, `version`): [`ReleaseEntry`](../interfaces/ReleaseEntry.md)

Defined in: [packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts:161](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/developer/DeveloperManager.ts#L161)

#### Parameters

##### packageName

`string`

##### version

`string`

#### Returns

[`ReleaseEntry`](../interfaces/ReleaseEntry.md)
