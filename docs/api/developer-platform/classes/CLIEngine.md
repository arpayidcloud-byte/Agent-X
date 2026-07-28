[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / CLIEngine

# Class: CLIEngine

Defined in: [packages/platform/developer-platform/src/domain/sdk/SDKManager.ts:165](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/sdk/SDKManager.ts#L165)

## Constructors

### Constructor

> **new CLIEngine**(): `CLIEngine`

#### Returns

`CLIEngine`

## Methods

### execute()

> **execute**(`commandId`): `string`

Defined in: [packages/platform/developer-platform/src/domain/sdk/SDKManager.ts:178](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/sdk/SDKManager.ts#L178)

#### Parameters

##### commandId

`string`

#### Returns

`string`

---

### get()

> **get**(`commandId`): [`CLICommand`](../interfaces/CLICommand.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/domain/sdk/SDKManager.ts:184](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/sdk/SDKManager.ts#L184)

#### Parameters

##### commandId

`string`

#### Returns

[`CLICommand`](../interfaces/CLICommand.md) \| `undefined`

---

### getAll()

> **getAll**(): [`CLICommand`](../interfaces/CLICommand.md)[]

Defined in: [packages/platform/developer-platform/src/domain/sdk/SDKManager.ts:188](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/sdk/SDKManager.ts#L188)

#### Returns

[`CLICommand`](../interfaces/CLICommand.md)[]

---

### register()

> **register**(`name`, `description`, `handler`): [`CLICommand`](../interfaces/CLICommand.md)

Defined in: [packages/platform/developer-platform/src/domain/sdk/SDKManager.ts:168](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/domain/sdk/SDKManager.ts#L168)

#### Parameters

##### name

`string`

##### description

`string`

##### handler

`string`

#### Returns

[`CLICommand`](../interfaces/CLICommand.md)
