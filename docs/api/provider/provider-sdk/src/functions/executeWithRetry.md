[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [provider/provider-sdk/src](../README.md) / executeWithRetry

# Function: executeWithRetry()

> **executeWithRetry**\<`T`>>>>\>(`action`, `policy`, `providerId`, `circuitBreaker?`): `Promise`\<`T`>>>>\>

Defined in: [packages/provider/provider-sdk/src/resilience.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/resilience.ts#L41)

## Type Parameters

### T

`T`

## Parameters

### action

() => `Promise`\<`T`\>

### policy

`RetryPolicy`

### providerId

`string`

### circuitBreaker?

[`CircuitBreaker`](../classes/CircuitBreaker.md)

## Returns

`Promise`\<`T`\>
