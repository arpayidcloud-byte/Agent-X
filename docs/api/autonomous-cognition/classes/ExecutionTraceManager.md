[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [autonomous-cognition](../README.md) / ExecutionTraceManager

# Class: ExecutionTraceManager

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:122](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L122)

## Constructors

### Constructor

> **new ExecutionTraceManager**(): `ExecutionTraceManager`

#### Returns

`ExecutionTraceManager`

## Methods

### finishSpan()

> **finishSpan**(`spanId`, `traceId`, `goalId`, `operation`, `startTime`, `status`): [`TraceSpan`](../interfaces/TraceSpan.md)

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:129](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L129)

#### Parameters

##### spanId

`string`

##### traceId

`string`

##### goalId

`string`

##### operation

`string`

##### startTime

`Date`

##### status

`"OK"` \| `"ERROR"`

#### Returns

[`TraceSpan`](../interfaces/TraceSpan.md)

---

### getSpans()

> **getSpans**(`traceId`): [`TraceSpan`](../interfaces/TraceSpan.md)[]

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:157](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L157)

#### Parameters

##### traceId

`string`

#### Returns

[`TraceSpan`](../interfaces/TraceSpan.md)[]

---

### getTraceIds()

> **getTraceIds**(): `string`[]

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:178](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L178)

#### Returns

`string`[]

---

### startSpan()

> **startSpan**(`_traceId`, `_goalId`, `_operation`): `string`

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:125](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L125)

#### Parameters

##### \_traceId

`string`

##### \_goalId

`string`

##### \_operation

`string`

#### Returns

`string`

---

### validateTrace()

> **validateTrace**(`traceId`): `boolean`

Defined in: [packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts:161](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/infrastructure/observability/Observability.ts#L161)

#### Parameters

##### traceId

`string`

#### Returns

`boolean`
