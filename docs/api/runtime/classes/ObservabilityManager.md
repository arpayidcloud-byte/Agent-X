[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / ObservabilityManager

# Class: ObservabilityManager

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:64](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L64)

## Constructors

### Constructor

> **new ObservabilityManager**(`auditStore`): `ObservabilityManager`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:68](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L68)

#### Parameters

##### auditStore

[`IAuditStore`](../interfaces/IAuditStore.md)

#### Returns

`ObservabilityManager`

## Methods

### getAggregatedMetrics()

> **getAggregatedMetrics**(): `Promise`\<[`ObservabilityMetrics`](../interfaces/ObservabilityMetrics.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:94](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L94)

#### Returns

`Promise`\<[`ObservabilityMetrics`](../interfaces/ObservabilityMetrics.md)\>

---

### updateAgentMetrics()

> **updateAgentMetrics**(`total`, `active`, `avgTime`): `void`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:129](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L129)

#### Parameters

##### total

`number`

##### active

`number`

##### avgTime

`number`

#### Returns

`void`

---

### updateApprovalMetrics()

> **updateApprovalMetrics**(`total`, `approved`, `rejected`, `expired`, `avgDelay`): `void`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:137](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L137)

#### Parameters

##### total

`number`

##### approved

`number`

##### rejected

`number`

##### expired

`number`

##### avgDelay

`number`

#### Returns

`void`

---

### updateHealthMetrics()

> **updateHealthMetrics**(`healthy`, `componentCount`, `unhealthy`): `void`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:153](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L153)

#### Parameters

##### healthy

`boolean`

##### componentCount

`number`

##### unhealthy

`number`

#### Returns

`void`

---

### updateRuntimeMetrics()

> **updateRuntimeMetrics**(`executionTimeMs`, `sessionCount`, `activeSessions`): `void`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:104](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L104)

#### Parameters

##### executionTimeMs

`number`

##### sessionCount

`number`

##### activeSessions

`number`

#### Returns

`void`

---

### updateToolMetrics()

> **updateToolMetrics**(`total`, `successful`, `failed`, `avgTime`): `void`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:120](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L120)

#### Parameters

##### total

`number`

##### successful

`number`

##### failed

`number`

##### avgTime

`number`

#### Returns

`void`

---

### updateWorkflowMetrics()

> **updateWorkflowMetrics**(`total`, `completed`, `failed`): `void`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:112](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L112)

#### Parameters

##### total

`number`

##### completed

`number`

##### failed

`number`

#### Returns

`void`
