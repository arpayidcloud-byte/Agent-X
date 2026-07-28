[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [provider/provider-sdk/src](../README.md) / BaseProvider

# Abstract Class: BaseProvider

Defined in: [packages/provider/provider-sdk/src/base-provider.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/base-provider.ts#L25)

Abstract base class for AI provider implementations.
Provides common functionality for completion, health checks, and error handling.

## Example

```ts
class MyProvider extends BaseProvider {
  protected async doComplete(req, signal) { ... }
  protected mapError(error) { ... }
}
```

## Implements

- [`Provider`](../interfaces/Provider.md)

## Constructors

### Constructor

> **new BaseProvider**(`config`): `BaseProvider`

Defined in: [packages/provider/provider-sdk/src/base-provider.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/base-provider.ts#L39)

Creates a new BaseProvider instance.

#### Parameters

##### config

[`ProviderConfiguration`](../interfaces/ProviderConfiguration.md)

Provider configuration including ID, timeouts, and retry policies

#### Returns

`BaseProvider`

## Properties

### capabilities

> `abstract` `readonly` **capabilities**: `ProviderCapabilities`

Defined in: [packages/provider/provider-sdk/src/base-provider.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/base-provider.ts#L27)

#### Implementation of

[`Provider`](../interfaces/Provider.md).[`capabilities`](../interfaces/Provider.md#capabilities)

---

### circuitBreaker?

> `protected` `optional` **circuitBreaker?**: [`CircuitBreaker`](CircuitBreaker.md)

Defined in: [packages/provider/provider-sdk/src/base-provider.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/base-provider.ts#L30)

---

### config

> `protected` **config**: [`ProviderConfiguration`](../interfaces/ProviderConfiguration.md)

Defined in: [packages/provider/provider-sdk/src/base-provider.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/base-provider.ts#L29)

---

### costCalculator

> `protected` **costCalculator**: [`CostCalculator`](CostCalculator.md)

Defined in: [packages/provider/provider-sdk/src/base-provider.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/base-provider.ts#L31)

---

### id

> `readonly` **id**: `string`

Defined in: [packages/provider/provider-sdk/src/base-provider.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/base-provider.ts#L26)

#### Implementation of

[`Provider`](../interfaces/Provider.md).[`id`](../interfaces/Provider.md#id)

---

### otelMetrics

> `protected` **otelMetrics**: `Metrics`

Defined in: [packages/provider/provider-sdk/src/base-provider.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/base-provider.ts#L33)

---

### tracer

> `protected` **tracer**: `Tracer`

Defined in: [packages/provider/provider-sdk/src/base-provider.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/base-provider.ts#L32)

## Methods

### checkHealth()

> **checkHealth**(): `Promise`\<`ProviderStatus`>>>>\>

Defined in: [packages/provider/provider-sdk/src/base-provider.ts:158](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/base-provider.ts#L158)

Checks the health status of the provider.

#### Returns

`Promise`\<`ProviderStatus`\>

Provider status including health and circuit breaker state

#### Implementation of

[`Provider`](../interfaces/Provider.md).[`checkHealth`](../interfaces/Provider.md#checkhealth)

---

### complete()

> **complete**(`req`): `Promise`\<[`CompletionResponse`](../interfaces/CompletionResponse.md)>>>>\>

Defined in: [packages/provider/provider-sdk/src/base-provider.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/base-provider.ts#L57)

Executes a completion request with retry and circuit breaker support.

#### Parameters

##### req

[`CompletionRequest`](../interfaces/CompletionRequest.md)

Completion request with prompt, model, and options

#### Returns

`Promise`\<[`CompletionResponse`](../interfaces/CompletionResponse.md)\>

Completion response with text, tool calls, and usage metrics

#### Throws

ProviderTimeoutError if request exceeds timeout

#### Throws

Error if circuit breaker is open or request fails

#### Implementation of

[`Provider`](../interfaces/Provider.md).[`complete`](../interfaces/Provider.md#complete)

---

### doComplete()

> `abstract` `protected` **doComplete**(`req`, `signal`): `Promise`\<[`CompletionResponse`](../interfaces/CompletionResponse.md)>>>>\>

Defined in: [packages/provider/provider-sdk/src/base-provider.ts:171](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/base-provider.ts#L171)

#### Parameters

##### req

[`CompletionRequest`](../interfaces/CompletionRequest.md)

##### signal

`AbortSignal`

#### Returns

`Promise`\<[`CompletionResponse`](../interfaces/CompletionResponse.md)\>

---

### generateRequestId()

> `protected` **generateRequestId**(): `string`

Defined in: [packages/provider/provider-sdk/src/base-provider.ts:167](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/base-provider.ts#L167)

#### Returns

`string`

---

### mapError()

> `abstract` `protected` **mapError**(`error`): `Error`

Defined in: [packages/provider/provider-sdk/src/base-provider.ts:175](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/base-provider.ts#L175)

#### Parameters

##### error

`unknown`

#### Returns

`Error`
