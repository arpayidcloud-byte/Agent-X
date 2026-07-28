[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/shared/src](../README.md) / JsonLogger

# Class: JsonLogger

Defined in: [packages/shared/shared/src/logger/loggers.ts:137](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L137)

## Extends

- [`BaseLogger`](BaseLogger.md)

## Constructors

### Constructor

> **new JsonLogger**(`moduleName`, `config`, `boundContext?`): `JsonLogger`

Defined in: [packages/shared/shared/src/logger/loggers.ts:138](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L138)

#### Parameters

##### moduleName

`string`

##### config

[`LoggerConfiguration`](../interfaces/LoggerConfiguration.md)

##### boundContext?

[`LogContext`](../interfaces/LogContext.md) = `{}`

#### Returns

`JsonLogger`

#### Overrides

[`BaseLogger`](BaseLogger.md).[`constructor`](BaseLogger.md#constructor)

## Properties

### boundContext

> `protected` `readonly` **boundContext**: [`LogContext`](../interfaces/LogContext.md) = `{}`

Defined in: [packages/shared/shared/src/logger/loggers.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L9)

#### Inherited from

[`BaseLogger`](BaseLogger.md).[`boundContext`](BaseLogger.md#boundcontext)

---

### config

> `protected` `readonly` **config**: [`LoggerConfiguration`](../interfaces/LoggerConfiguration.md)

Defined in: [packages/shared/shared/src/logger/loggers.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L8)

#### Inherited from

[`BaseLogger`](BaseLogger.md).[`config`](BaseLogger.md#config)

---

### moduleName

> `protected` `readonly` **moduleName**: `string`

Defined in: [packages/shared/shared/src/logger/loggers.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L7)

#### Inherited from

[`BaseLogger`](BaseLogger.md).[`moduleName`](BaseLogger.md#modulename)

## Methods

### debug()

> **debug**(`message`, `metadata?`, `context?`): `void`

Defined in: [packages/shared/shared/src/logger/loggers.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L18)

#### Parameters

##### message

`string`

##### metadata?

`Record`\<`string`, `unknown`\>

##### context?

[`LogContext`](../interfaces/LogContext.md)

#### Returns

`void`

#### Inherited from

[`BaseLogger`](BaseLogger.md).[`debug`](BaseLogger.md#debug)

---

### error()

> **error**(`message`, `error?`, `metadata?`, `context?`): `void`

Defined in: [packages/shared/shared/src/logger/loggers.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L30)

#### Parameters

##### message

`string`

##### error?

`Error`

##### metadata?

`Record`\<`string`, `unknown`\>

##### context?

[`LogContext`](../interfaces/LogContext.md)

#### Returns

`void`

#### Inherited from

[`BaseLogger`](BaseLogger.md).[`error`](BaseLogger.md#error)

---

### fatal()

> **fatal**(`message`, `error?`, `metadata?`, `context?`): `void`

Defined in: [packages/shared/shared/src/logger/loggers.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L39)

#### Parameters

##### message

`string`

##### error?

`Error`

##### metadata?

`Record`\<`string`, `unknown`\>

##### context?

[`LogContext`](../interfaces/LogContext.md)

#### Returns

`void`

#### Inherited from

[`BaseLogger`](BaseLogger.md).[`fatal`](BaseLogger.md#fatal)

---

### info()

> **info**(`message`, `metadata?`, `context?`): `void`

Defined in: [packages/shared/shared/src/logger/loggers.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L22)

#### Parameters

##### message

`string`

##### metadata?

`Record`\<`string`, `unknown`\>

##### context?

[`LogContext`](../interfaces/LogContext.md)

#### Returns

`void`

#### Inherited from

[`BaseLogger`](BaseLogger.md).[`info`](BaseLogger.md#info)

---

### log()

> `protected` **log**(`level`, `message`, `error?`, `metadata?`, `context?`): `void`

Defined in: [packages/shared/shared/src/logger/loggers.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L51)

#### Parameters

##### level

[`LogLevel`](../type-aliases/LogLevel.md)

##### message

`string`

##### error?

`Error`

##### metadata?

`Record`\<`string`, `unknown`\>

##### context?

[`LogContext`](../interfaces/LogContext.md)

#### Returns

`void`

#### Inherited from

[`BaseLogger`](BaseLogger.md).[`log`](BaseLogger.md#log)

---

### print()

> **print**(`entry`): `void`

Defined in: [packages/shared/shared/src/logger/loggers.ts:142](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L142)

#### Parameters

##### entry

[`LogEntry`](../interfaces/LogEntry.md)

#### Returns

`void`

#### Overrides

[`BaseLogger`](BaseLogger.md).[`print`](BaseLogger.md#print)

---

### trace()

> **trace**(`message`, `metadata?`, `context?`): `void`

Defined in: [packages/shared/shared/src/logger/loggers.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L14)

#### Parameters

##### message

`string`

##### metadata?

`Record`\<`string`, `unknown`\>

##### context?

[`LogContext`](../interfaces/LogContext.md)

#### Returns

`void`

#### Inherited from

[`BaseLogger`](BaseLogger.md).[`trace`](BaseLogger.md#trace)

---

### warn()

> **warn**(`message`, `metadata?`, `context?`): `void`

Defined in: [packages/shared/shared/src/logger/loggers.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L26)

#### Parameters

##### message

`string`

##### metadata?

`Record`\<`string`, `unknown`\>

##### context?

[`LogContext`](../interfaces/LogContext.md)

#### Returns

`void`

#### Inherited from

[`BaseLogger`](BaseLogger.md).[`warn`](BaseLogger.md#warn)

---

### withContext()

> **withContext**(`context`): [`ILogger`](../interfaces/ILogger.md)

Defined in: [packages/shared/shared/src/logger/loggers.ts:152](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L152)

#### Parameters

##### context

[`LogContext`](../interfaces/LogContext.md)

#### Returns

[`ILogger`](../interfaces/ILogger.md)

#### Overrides

[`BaseLogger`](BaseLogger.md).[`withContext`](BaseLogger.md#withcontext)

---

### withModule()

> **withModule**(`moduleName`): [`ILogger`](../interfaces/ILogger.md)

Defined in: [packages/shared/shared/src/logger/loggers.ts:156](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L156)

#### Parameters

##### moduleName

`string`

#### Returns

[`ILogger`](../interfaces/ILogger.md)

#### Overrides

[`BaseLogger`](BaseLogger.md).[`withModule`](BaseLogger.md#withmodule)
