[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / BackgroundJobScheduler

# Class: BackgroundJobScheduler

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L49)

## Constructors

### Constructor

> **new BackgroundJobScheduler**(): `BackgroundJobScheduler`

#### Returns

`BackgroundJobScheduler`

## Methods

### getAll()

> **getAll**(): [`JobEntry`](../interfaces/JobEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:73](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L73)

#### Returns

[`JobEntry`](../interfaces/JobEntry.md)[]

---

### getPending()

> **getPending**(): [`JobEntry`](../interfaces/JobEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:69](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L69)

#### Returns

[`JobEntry`](../interfaces/JobEntry.md)[]

---

### schedule()

> **schedule**(`type`, `payload`): [`JobEntry`](../interfaces/JobEntry.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts:52](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/platform/Platform.ts#L52)

#### Parameters

##### type

`string`

##### payload

`Record`\<`string`, `unknown`\>

#### Returns

[`JobEntry`](../interfaces/JobEntry.md)
