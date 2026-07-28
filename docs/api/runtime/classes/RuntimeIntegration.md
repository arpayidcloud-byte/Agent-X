[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / RuntimeIntegration

# Class: RuntimeIntegration

Defined in: [packages/runtime/runtime/src/runtime-integration.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-integration.ts#L20)

## Constructors

### Constructor

> **new RuntimeIntegration**(`config?`): `RuntimeIntegration`

Defined in: [packages/runtime/runtime/src/runtime-integration.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-integration.ts#L23)

#### Parameters

##### config?

[`RuntimeBootstrapConfig`](../interfaces/RuntimeBootstrapConfig.md)

#### Returns

`RuntimeIntegration`

## Methods

### executeGoal()

> **executeGoal**(`sessionId`, `goal`): `Promise`\<[`PipelineResult`](../interfaces/PipelineResult.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-integration.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-integration.ts#L57)

#### Parameters

##### sessionId

`string`

##### goal

`string`

#### Returns

`Promise`\<[`PipelineResult`](../interfaces/PipelineResult.md)\>

---

### getDI()

> **getDI**(): [`RuntimeDI`](RuntimeDI.md)

Defined in: [packages/runtime/runtime/src/runtime-integration.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-integration.ts#L77)

#### Returns

[`RuntimeDI`](RuntimeDI.md)

---

### getHealthReport()

> **getHealthReport**(): `Promise`\<[`RuntimeHealthReport`](../interfaces/RuntimeHealthReport.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-integration.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-integration.ts#L62)

#### Returns

`Promise`\<[`RuntimeHealthReport`](../interfaces/RuntimeHealthReport.md)\>

---

### getMetrics()

> **getMetrics**(): `Promise`\<[`ObservabilityMetrics`](../interfaces/ObservabilityMetrics.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-integration.ts:67](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-integration.ts#L67)

#### Returns

`Promise`\<[`ObservabilityMetrics`](../interfaces/ObservabilityMetrics.md)\>

---

### getRecoveryHistory()

> **getRecoveryHistory**(): [`RecoveryAction`](../interfaces/RecoveryAction.md)[]

Defined in: [packages/runtime/runtime/src/runtime-integration.ts:72](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-integration.ts#L72)

#### Returns

[`RecoveryAction`](../interfaces/RecoveryAction.md)[]
