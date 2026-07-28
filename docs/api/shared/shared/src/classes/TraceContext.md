[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/shared/src](../README.md) / TraceContext

# Class: TraceContext

Defined in: [packages/shared/shared/src/trace/context.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/trace/context.ts#L4)

## Constructors

### Constructor

> **new TraceContext**(): `TraceContext`

#### Returns

`TraceContext`

## Methods

### generateId()

> `static` **generateId**(): `string`

Defined in: [packages/shared/shared/src/trace/context.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/trace/context.ts#L35)

Create a new unique correlation ID.

#### Returns

`string`

---

### get()

> `static` **get**(): [`LogContext`](../interfaces/LogContext.md) \| `undefined`

Defined in: [packages/shared/shared/src/trace/context.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/trace/context.ts#L28)

Get the current trace context.

#### Returns

[`LogContext`](../interfaces/LogContext.md) \| `undefined`

---

### run()

> `static` **run**\<`T`>>>>\>(`context`, `fn`): `T`

Defined in: [packages/shared/shared/src/trace/context.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/trace/context.ts#L10)

Run a function within a new or extended trace context.

#### Type Parameters

##### T

`T`

#### Parameters

##### context

[`LogContext`](../interfaces/LogContext.md)

##### fn

() => `T`

#### Returns

`T`

---

### runAsync()

> `static` **runAsync**\<`T`>>>>\>(`context`, `fn`): `Promise`\<`T`>>>>\>

Defined in: [packages/shared/shared/src/trace/context.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/trace/context.ts#L19)

Run an asynchronous function within a new or extended trace context.

#### Type Parameters

##### T

`T`

#### Parameters

##### context

[`LogContext`](../interfaces/LogContext.md)

##### fn

() => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>
