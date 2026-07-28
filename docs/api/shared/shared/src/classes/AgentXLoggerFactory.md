[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/shared/src](../README.md) / AgentXLoggerFactory

# Class: AgentXLoggerFactory

Defined in: [packages/shared/shared/src/logger/factory.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/factory.ts#L4)

## Implements

- [`LoggerFactory`](../interfaces/LoggerFactory.md)

## Constructors

### Constructor

> **new AgentXLoggerFactory**(): `AgentXLoggerFactory`

Defined in: [packages/shared/shared/src/logger/factory.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/factory.ts#L12)

#### Returns

`AgentXLoggerFactory`

## Methods

### configure()

> **configure**(`config`): `void`

Defined in: [packages/shared/shared/src/logger/factory.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/factory.ts#L30)

#### Parameters

##### config

`Partial`\<[`LoggerConfiguration`](../interfaces/LoggerConfiguration.md)\>

#### Returns

`void`

#### Implementation of

[`LoggerFactory`](../interfaces/LoggerFactory.md).[`configure`](../interfaces/LoggerFactory.md#configure)

---

### createLogger()

> **createLogger**(`moduleName`): [`ILogger`](../interfaces/ILogger.md)

Defined in: [packages/shared/shared/src/logger/factory.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/factory.ts#L34)

#### Parameters

##### moduleName

`string`

#### Returns

[`ILogger`](../interfaces/ILogger.md)

#### Implementation of

[`LoggerFactory`](../interfaces/LoggerFactory.md).[`createLogger`](../interfaces/LoggerFactory.md#createlogger)
