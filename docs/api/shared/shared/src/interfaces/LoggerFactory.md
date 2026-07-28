[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/shared/src](../README.md) / LoggerFactory

# Interface: LoggerFactory

Defined in: [packages/shared/shared/src/logger/interfaces.ts:55](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/interfaces.ts#L55)

## Methods

### configure()

> **configure**(`config`): `void`

Defined in: [packages/shared/shared/src/logger/interfaces.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/interfaces.ts#L57)

#### Parameters

##### config

`Partial`\<[`LoggerConfiguration`](LoggerConfiguration.md)\>

#### Returns

`void`

---

### createLogger()

> **createLogger**(`moduleName`): [`ILogger`](ILogger.md)

Defined in: [packages/shared/shared/src/logger/interfaces.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/interfaces.ts#L56)

#### Parameters

##### moduleName

`string`

#### Returns

[`ILogger`](ILogger.md)
