[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/shared/src](../README.md) / BaseLogger

# Abstract Class: BaseLogger

Defined in: [packages/shared/shared/src/logger/loggers.ts:5](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L5)

## Extended by

- [`JsonLogger`](JsonLogger.md)
- [`ConsoleLogger`](ConsoleLogger.md)

## Implements

- [`ILogger`](../interfaces/ILogger.md)

## Constructors

### Constructor

> `protected` **new BaseLogger**(`moduleName`, `config`, `boundContext?`): `BaseLogger`

Defined in: [packages/shared/shared/src/logger/loggers.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L6)

#### Parameters

##### moduleName

`string`

##### config

[`LoggerConfiguration`](../interfaces/LoggerConfiguration.md)

##### boundContext?

[`LogContext`](../interfaces/LogContext.md) = `{}`

#### Returns

`BaseLogger`

## Properties

### boundContext

> `protected` `readonly` **boundContext**: [`LogContext`](../interfaces/LogContext.md) = `{}`

Defined in: [packages/shared/shared/src/logger/loggers.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L9)

---

### config

> `protected` `readonly` **config**: [`LoggerConfiguration`](../interfaces/LoggerConfiguration.md)

Defined in: [packages/shared/shared/src/logger/loggers.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L8)

---

### moduleName

> `protected` `readonly` **moduleName**: `string`

Defined in: [packages/shared/shared/src/logger/loggers.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L7)

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

#### Implementation of

[`ILogger`](../interfaces/ILogger.md).[`debug`](../interfaces/ILogger.md#debug)

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

#### Implementation of

[`ILogger`](../interfaces/ILogger.md).[`error`](../interfaces/ILogger.md#error)

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

#### Implementation of

[`ILogger`](../interfaces/ILogger.md).[`fatal`](../interfaces/ILogger.md#fatal)

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

#### Implementation of

[`ILogger`](../interfaces/ILogger.md).[`info`](../interfaces/ILogger.md#info)

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

---

### print()

> `abstract` **print**(`entry`): `void`

Defined in: [packages/shared/shared/src/logger/loggers.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L12)

#### Parameters

##### entry

[`LogEntry`](../interfaces/LogEntry.md)

#### Returns

`void`

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

#### Implementation of

[`ILogger`](../interfaces/ILogger.md).[`trace`](../interfaces/ILogger.md#trace)

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

#### Implementation of

[`ILogger`](../interfaces/ILogger.md).[`warn`](../interfaces/ILogger.md#warn)

---

### withContext()

> `abstract` **withContext**(`context`): [`ILogger`](../interfaces/ILogger.md)

Defined in: [packages/shared/shared/src/logger/loggers.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L48)

#### Parameters

##### context

[`LogContext`](../interfaces/LogContext.md)

#### Returns

[`ILogger`](../interfaces/ILogger.md)

#### Implementation of

[`ILogger`](../interfaces/ILogger.md).[`withContext`](../interfaces/ILogger.md#withcontext)

---

### withModule()

> `abstract` **withModule**(`moduleName`): [`ILogger`](../interfaces/ILogger.md)

Defined in: [packages/shared/shared/src/logger/loggers.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/loggers.ts#L49)

#### Parameters

##### moduleName

`string`

#### Returns

[`ILogger`](../interfaces/ILogger.md)

#### Implementation of

[`ILogger`](../interfaces/ILogger.md).[`withModule`](../interfaces/ILogger.md#withmodule)
