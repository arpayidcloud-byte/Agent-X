[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [provider/provider-sdk/src](../README.md) / SDKMocks

# Class: SDKMocks

Defined in: [packages/provider/provider-sdk/src/conformance/provider-mocks.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/conformance/provider-mocks.ts#L6)

## Constructors

### Constructor

> **new SDKMocks**(): `SDKMocks`

#### Returns

`SDKMocks`

## Methods

### getValidQueue()

> `static` **getValidQueue**(): `object`

Defined in: [packages/provider/provider-sdk/src/conformance/provider-mocks.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/conformance/provider-mocks.ts#L7)

#### Returns

`object`

##### ack

> **ack**: () => `Promise`\<`void`>>>>\>

###### Returns

`Promise`\<`void`\>

##### deadLetter

> **deadLetter**: () => `Promise`\<`void`>>>>\>

###### Returns

`Promise`\<`void`\>

##### dequeue

> **dequeue**: () => `Promise`\<`undefined`>>>>\>

###### Returns

`Promise`\<`undefined`\>

##### enqueue

> **enqueue**: () => `Promise`\<`void`>>>>\>

###### Returns

`Promise`\<`void`\>

##### getCapabilities

> **getCapabilities**: () => `object`

###### Returns

`object`

###### priorityQueue

> **priorityQueue**: `boolean` = `true`

##### getDepth

> **getDepth**: () => `Promise`\<`number`>>>>\>

###### Returns

`Promise`\<`number`\>

##### getMetadata

> **getMetadata**: () => `object`

###### Returns

`object`

###### id

> **id**: `string` = `'mock-q'`

###### name

> **name**: `string` = `'Mock Q'`

###### type

> **type**: `string` = `'queue'`

###### version

> **version**: `string` = `'1.0'`

##### getMetrics

> **getMetrics**: () => `object`

###### Returns

`object`

###### averageLatencyMs

> **averageLatencyMs**: `number` = `0`

###### failedRequests

> **failedRequests**: `number` = `0`

###### successfulRequests

> **successfulRequests**: `number` = `0`

###### totalRequests

> **totalRequests**: `number` = `0`

##### healthCheck

> **healthCheck**: () => `Promise`\<\{ `healthy`: `boolean`; `lastChecked`: `Date`; `latencyMs`: `number`; `status`: `string`; \}\>

###### Returns

`Promise`\<\{ `healthy`: `boolean`; `lastChecked`: `Date`; `latencyMs`: `number`; `status`: `string`; \}\>

##### peek

> **peek**: () => `Promise`\<`undefined`>>>>\>

###### Returns

`Promise`\<`undefined`\>

##### purge

> **purge**: () => `Promise`\<`void`>>>>\>

###### Returns

`Promise`\<`void`\>

##### retry

> **retry**: () => `Promise`\<`void`>>>>\>

###### Returns

`Promise`\<`void`\>
