[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-kernel](../README.md) / KernelTraceManager

# Class: KernelTraceManager

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-trace.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-trace.ts#L12)

## Constructors

### Constructor

> **new KernelTraceManager**(): `KernelTraceManager`

#### Returns

`KernelTraceManager`

## Methods

### addStep()

> **addStep**(`traceId`, `step`): `void`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-trace.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-trace.ts#L19)

#### Parameters

##### traceId

`string`

##### step

`string`

#### Returns

`void`

---

### getTrace()

> **getTrace**(`traceId`): [`KernelTrace`](../interfaces/KernelTrace.md) \| `undefined`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-trace.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-trace.ts#L26)

#### Parameters

##### traceId

`string`

#### Returns

[`KernelTrace`](../interfaces/KernelTrace.md) \| `undefined`

---

### startTrace()

> **startTrace**(`traceId`): `void`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-trace.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-trace.ts#L15)

#### Parameters

##### traceId

`string`

#### Returns

`void`
