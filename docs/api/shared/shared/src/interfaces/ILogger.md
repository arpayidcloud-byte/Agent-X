[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/shared/src](../README.md) / ILogger

# Interface: ILogger

Defined in: [packages/shared/shared/src/logger/interfaces.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/interfaces.ts#L26)

## Methods

### debug()

> **debug**(`message`, `metadata?`, `context?`): `void`

Defined in: [packages/shared/shared/src/logger/interfaces.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/interfaces.ts#L28)

#### Parameters

##### message

`string`

##### metadata?

`Record`\<`string`, `unknown`\>

##### context?

[`LogContext`](LogContext.md)

#### Returns

`void`

---

### error()

> **error**(`message`, `error?`, `metadata?`, `context?`): `void`

Defined in: [packages/shared/shared/src/logger/interfaces.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/interfaces.ts#L31)

#### Parameters

##### message

`string`

##### error?

`Error`

##### metadata?

`Record`\<`string`, `unknown`\>

##### context?

[`LogContext`](LogContext.md)

#### Returns

`void`

---

### fatal()

> **fatal**(`message`, `error?`, `metadata?`, `context?`): `void`

Defined in: [packages/shared/shared/src/logger/interfaces.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/interfaces.ts#L37)

#### Parameters

##### message

`string`

##### error?

`Error`

##### metadata?

`Record`\<`string`, `unknown`\>

##### context?

[`LogContext`](LogContext.md)

#### Returns

`void`

---

### info()

> **info**(`message`, `metadata?`, `context?`): `void`

Defined in: [packages/shared/shared/src/logger/interfaces.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/interfaces.ts#L29)

#### Parameters

##### message

`string`

##### metadata?

`Record`\<`string`, `unknown`\>

##### context?

[`LogContext`](LogContext.md)

#### Returns

`void`

---

### trace()

> **trace**(`message`, `metadata?`, `context?`): `void`

Defined in: [packages/shared/shared/src/logger/interfaces.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/interfaces.ts#L27)

#### Parameters

##### message

`string`

##### metadata?

`Record`\<`string`, `unknown`\>

##### context?

[`LogContext`](LogContext.md)

#### Returns

`void`

---

### warn()

> **warn**(`message`, `metadata?`, `context?`): `void`

Defined in: [packages/shared/shared/src/logger/interfaces.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/interfaces.ts#L30)

#### Parameters

##### message

`string`

##### metadata?

`Record`\<`string`, `unknown`\>

##### context?

[`LogContext`](LogContext.md)

#### Returns

`void`

---

### withContext()

> **withContext**(`context`): `ILogger`

Defined in: [packages/shared/shared/src/logger/interfaces.ts:44](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/interfaces.ts#L44)

#### Parameters

##### context

[`LogContext`](LogContext.md)

#### Returns

`ILogger`

---

### withModule()

> **withModule**(`moduleName`): `ILogger`

Defined in: [packages/shared/shared/src/logger/interfaces.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/logger/interfaces.ts#L45)

#### Parameters

##### moduleName

`string`

#### Returns

`ILogger`
