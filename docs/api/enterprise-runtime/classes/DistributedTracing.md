[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / DistributedTracing

# Class: DistributedTracing

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:100](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L100)

## Constructors

### Constructor

> **new DistributedTracing**(`tracerName?`): `DistributedTracing`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:105](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L105)

#### Parameters

##### tracerName?

`string` = `'agentx'`

#### Returns

`DistributedTracing`

## Methods

### clearSpans()

> **clearSpans**(): `void`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:217](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L217)

#### Returns

`void`

---

### extractContext()

> **extractContext**(`headers`): `string` \| `null`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:200](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L200)

#### Parameters

##### headers

`Record`\<`string`, `string`\>

#### Returns

`string` \| `null`

---

### finishSpan()

> **finishSpan**(`spanId`, `traceId`, `operation`, `startTime`, `status`): [`TraceSpan`](../interfaces/TraceSpan.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:132](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L132)

#### Parameters

##### spanId

`string`

##### traceId

`string`

##### operation

`string`

##### startTime

`Date`

##### status

`"ERROR"` \| `"OK"`

#### Returns

[`TraceSpan`](../interfaces/TraceSpan.md)

---

### getCurrentTraceId()

> **getCurrentTraceId**(`spanId`): `string` \| `null`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:213](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L213)

#### Parameters

##### spanId

`string`

#### Returns

`string` \| `null`

---

### getSpans()

> **getSpans**(`traceId`): [`TraceSpan`](../interfaces/TraceSpan.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:169](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L169)

#### Parameters

##### traceId

`string`

#### Returns

[`TraceSpan`](../interfaces/TraceSpan.md)[]

---

### injectContext()

> **injectContext**(`spanId`): `Record`\<`string`, `string`>>>>\>

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:189](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L189)

#### Parameters

##### spanId

`string`

#### Returns

`Record`\<`string`, `string`\>

---

### startSpan()

> **startSpan**(`traceId`, `operation`): `string`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:109](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L109)

#### Parameters

##### traceId

`string`

##### operation

`string`

#### Returns

`string`

---

### validateTrace()

> **validateTrace**(`traceId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:173](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L173)

#### Parameters

##### traceId

`string`

#### Returns

`boolean`
