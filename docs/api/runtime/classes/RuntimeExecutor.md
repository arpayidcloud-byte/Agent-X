[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / RuntimeExecutor

# Class: RuntimeExecutor

Defined in: [packages/runtime/runtime/src/runtime-executor.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-executor.ts#L16)

## Constructors

### Constructor

> **new RuntimeExecutor**(`pipeline`): `RuntimeExecutor`

Defined in: [packages/runtime/runtime/src/runtime-executor.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-executor.ts#L21)

#### Parameters

##### pipeline

[`IRuntimePipeline`](../interfaces/IRuntimePipeline.md)

#### Returns

`RuntimeExecutor`

## Methods

### execute()

> **execute**(`session`, `_config`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-executor.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-executor.ts#L29)

Executes the full pipeline

#### Parameters

##### session

[`ExecutionSession`](../interfaces/ExecutionSession.md)

##### \_config

[`RuntimeConfig`](../interfaces/RuntimeConfig.md)

#### Returns

`Promise`\<`unknown`\>

---

### getAuditStore()

> **getAuditStore**(): [`AuditStore`](AuditStore.md)

Defined in: [packages/runtime/runtime/src/runtime-executor.ts:74](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-executor.ts#L74)

#### Returns

[`AuditStore`](AuditStore.md)

---

### getEvents()

> **getEvents**(): [`RuntimeEvent`](../interfaces/RuntimeEvent.md)[]

Defined in: [packages/runtime/runtime/src/runtime-executor.ts:80](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-executor.ts#L80)

#### Returns

[`RuntimeEvent`](../interfaces/RuntimeEvent.md)[]

---

### getMetricsCollector()

> **getMetricsCollector**(): [`MetricsCollector`](MetricsCollector.md)

Defined in: [packages/runtime/runtime/src/runtime-executor.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-executor.ts#L77)

#### Returns

[`MetricsCollector`](MetricsCollector.md)
