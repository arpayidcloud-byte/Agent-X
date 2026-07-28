[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / RetryPolicy

# Class: RetryPolicy

Defined in: [packages/shared/core-runtime/src/retry/index.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/retry/index.ts#L4)

Defines a retry policy for failed tasks.

## Example

```ts
const policy: IRetryPolicy = {
  type: 'exponential',
  maxAttempts: 5,
  initialDelayMs: 1000,
  backoffMultiplier: 2,
  maxDelayMs: 30000,
  calculateDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  isRetryable: (err) => !(err instanceof FatalError),
};
```

## Implements

- [`IRetryPolicy`](../interfaces/IRetryPolicy.md)

## Constructors

### Constructor

> **new RetryPolicy**(`config?`): `RetryPolicy`

Defined in: [packages/shared/core-runtime/src/retry/index.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/retry/index.ts#L13)

#### Parameters

##### config?

###### backoffMultiplier?

`number`

###### initialDelayMs?

`number`

###### maxAttempts?

`number`

###### maxDelayMs?

`number`

###### retryableErrors?

`string`[]

###### type?

`"exponential"` \| `"linear"` \| `"constant"`

#### Returns

`RetryPolicy`

## Properties

### backoffMultiplier

> `readonly` **backoffMultiplier**: `number`

Defined in: [packages/shared/core-runtime/src/retry/index.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/retry/index.ts#L8)

Multiplier applied to the delay on each subsequent retry

#### Implementation of

[`IRetryPolicy`](../interfaces/IRetryPolicy.md).[`backoffMultiplier`](../interfaces/IRetryPolicy.md#backoffmultiplier)

---

### initialDelayMs

> `readonly` **initialDelayMs**: `number`

Defined in: [packages/shared/core-runtime/src/retry/index.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/retry/index.ts#L7)

Initial delay in milliseconds before the first retry

#### Implementation of

[`IRetryPolicy`](../interfaces/IRetryPolicy.md).[`initialDelayMs`](../interfaces/IRetryPolicy.md#initialdelayms)

---

### maxAttempts

> `readonly` **maxAttempts**: `number`

Defined in: [packages/shared/core-runtime/src/retry/index.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/retry/index.ts#L6)

Maximum number of retry attempts

#### Implementation of

[`IRetryPolicy`](../interfaces/IRetryPolicy.md).[`maxAttempts`](../interfaces/IRetryPolicy.md#maxattempts)

---

### maxDelayMs?

> `readonly` `optional` **maxDelayMs?**: `number`

Defined in: [packages/shared/core-runtime/src/retry/index.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/retry/index.ts#L9)

Optional upper bound on the delay in milliseconds

#### Implementation of

[`IRetryPolicy`](../interfaces/IRetryPolicy.md).[`maxDelayMs`](../interfaces/IRetryPolicy.md#maxdelayms)

---

### type

> `readonly` **type**: `"exponential"` \| `"linear"` \| `"constant"`

Defined in: [packages/shared/core-runtime/src/retry/index.ts:5](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/retry/index.ts#L5)

The backoff strategy type

#### Implementation of

[`IRetryPolicy`](../interfaces/IRetryPolicy.md).[`type`](../interfaces/IRetryPolicy.md#type)

## Methods

### calculateDelay()

> **calculateDelay**(`attempt`): `number`

Defined in: [packages/shared/core-runtime/src/retry/index.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/retry/index.ts#L39)

Calculate the delay in milliseconds for a given attempt number.

#### Parameters

##### attempt

`number`

The current attempt number (0-indexed)

#### Returns

`number`

Delay in milliseconds

#### Implementation of

[`IRetryPolicy`](../interfaces/IRetryPolicy.md).[`calculateDelay`](../interfaces/IRetryPolicy.md#calculatedelay)

---

### execute()

> **execute**\<`T`>>>>\>(`operation`, `cancellationToken?`): `Promise`\<`T`>>>>\>

Defined in: [packages/shared/core-runtime/src/retry/index.ts:69](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/retry/index.ts#L69)

#### Type Parameters

##### T

`T`

#### Parameters

##### operation

() => `Promise`\<`T`\>

##### cancellationToken?

[`CancellationToken`](CancellationToken.md)

#### Returns

`Promise`\<`T`\>

---

### isRetryable()

> **isRetryable**(`error`): `boolean`

Defined in: [packages/shared/core-runtime/src/retry/index.ts:64](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/retry/index.ts#L64)

Determine whether an error is retryable.

#### Parameters

##### error

`Error`

The error to evaluate

#### Returns

`boolean`

`true` if the task should be retried, `false` otherwise

#### Implementation of

[`IRetryPolicy`](../interfaces/IRetryPolicy.md).[`isRetryable`](../interfaces/IRetryPolicy.md#isretryable)
