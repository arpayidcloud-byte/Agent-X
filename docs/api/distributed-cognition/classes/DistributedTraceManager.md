[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [distributed-cognition](../README.md) / DistributedTraceManager

# Class: DistributedTraceManager

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedTraceManager.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedTraceManager.ts#L16)

## Constructors

### Constructor

> **new DistributedTraceManager**(): `DistributedTraceManager`

#### Returns

`DistributedTraceManager`

## Methods

### finishSpan()

> **finishSpan**(`spanId`, `traceId`, `nodeId`, `operation`, `startTime`, `parentSpanId`, `status`): [`TraceSpan`](../interfaces/TraceSpan.md)

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedTraceManager.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedTraceManager.ts#L28)

#### Parameters

##### spanId

`string`

##### traceId

`string`

##### nodeId

`string`

##### operation

`string`

##### startTime

`Date`

##### parentSpanId

`string` \| `null`

##### status

`"OK"` \| `"ERROR"` \| `"TIMEOUT"`

#### Returns

[`TraceSpan`](../interfaces/TraceSpan.md)

---

### getSpans()

> **getSpans**(`traceId`): [`TraceSpan`](../interfaces/TraceSpan.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedTraceManager.ts:58](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedTraceManager.ts#L58)

#### Parameters

##### traceId

`string`

#### Returns

[`TraceSpan`](../interfaces/TraceSpan.md)[]

---

### getSpansByNode()

> **getSpansByNode**(`nodeId`): [`TraceSpan`](../interfaces/TraceSpan.md)[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedTraceManager.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedTraceManager.ts#L62)

#### Parameters

##### nodeId

`string`

#### Returns

[`TraceSpan`](../interfaces/TraceSpan.md)[]

---

### getTraceIds()

> **getTraceIds**(): `string`[]

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedTraceManager.ts:84](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedTraceManager.ts#L84)

#### Returns

`string`[]

---

### startSpan()

> **startSpan**(`_traceId`, `_nodeId`, `_operation`, `_parentSpanId?`): `string`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedTraceManager.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedTraceManager.ts#L19)

#### Parameters

##### \_traceId

`string`

##### \_nodeId

`string`

##### \_operation

`string`

##### \_parentSpanId?

`string` \| `null`

#### Returns

`string`

---

### validateTrace()

> **validateTrace**(`traceId`): `boolean`

Defined in: [packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedTraceManager.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/distributed/distributed-cognition/src/infrastructure/observability/DistributedTraceManager.ts#L66)

#### Parameters

##### traceId

`string`

#### Returns

`boolean`
