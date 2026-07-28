[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / IRetryPolicy

# Interface: IRetryPolicy

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L24)

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

## Properties

### backoffMultiplier

> `readonly` **backoffMultiplier**: `number`

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L32)

Multiplier applied to the delay on each subsequent retry

---

### initialDelayMs

> `readonly` **initialDelayMs**: `number`

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L30)

Initial delay in milliseconds before the first retry

---

### maxAttempts

> `readonly` **maxAttempts**: `number`

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L28)

Maximum number of retry attempts

---

### maxDelayMs?

> `readonly` `optional` **maxDelayMs?**: `number`

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L34)

Optional upper bound on the delay in milliseconds

---

### type

> `readonly` **type**: `"exponential"` \| `"linear"` \| `"constant"`

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L26)

The backoff strategy type

## Methods

### calculateDelay()

> **calculateDelay**(`attempt`): `number`

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L42)

Calculate the delay in milliseconds for a given attempt number.

#### Parameters

##### attempt

`number`

The current attempt number (0-indexed)

#### Returns

`number`

Delay in milliseconds

---

### isRetryable()

> **isRetryable**(`error`): `boolean`

Defined in: [packages/shared/core-runtime/src/interfaces/scheduler.ts:50](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/scheduler.ts#L50)

Determine whether an error is retryable.

#### Parameters

##### error

`Error`

The error to evaluate

#### Returns

`boolean`

`true` if the task should be retried, `false` otherwise
