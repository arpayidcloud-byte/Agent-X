[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / RuntimeSupervisorV2

# Class: RuntimeSupervisorV2

Defined in: [packages/runtime/runtime/src/runtime-supervisor-v2.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-supervisor-v2.ts#L11)

## Constructors

### Constructor

> **new RuntimeSupervisorV2**(): `RuntimeSupervisorV2`

Defined in: [packages/runtime/runtime/src/runtime-supervisor-v2.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-supervisor-v2.ts#L16)

#### Returns

`RuntimeSupervisorV2`

## Methods

### getHealthReport()

> **getHealthReport**(): `Promise`\<[`RuntimeHealthReport`](../interfaces/RuntimeHealthReport.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-supervisor-v2.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-supervisor-v2.ts#L43)

#### Returns

`Promise`\<[`RuntimeHealthReport`](../interfaces/RuntimeHealthReport.md)\>

---

### getRecoveryHistory()

> **getRecoveryHistory**(): [`RecoveryAction`](../interfaces/RecoveryAction.md)[]

Defined in: [packages/runtime/runtime/src/runtime-supervisor-v2.ts:75](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-supervisor-v2.ts#L75)

#### Returns

[`RecoveryAction`](../interfaces/RecoveryAction.md)[]

---

### handleAgentCrash()

> **handleAgentCrash**(`agentId`): `Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-supervisor-v2.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-supervisor-v2.ts#L47)

#### Parameters

##### agentId

`string`

#### Returns

`Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)\>

---

### handleApprovalTimeout()

> **handleApprovalTimeout**(`requestId`): `Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-supervisor-v2.ts:59](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-supervisor-v2.ts#L59)

#### Parameters

##### requestId

`string`

#### Returns

`Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)\>

---

### handleCheckpointRecovery()

> **handleCheckpointRecovery**(`workflowId`): `Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-supervisor-v2.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-supervisor-v2.ts#L63)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)\>

---

### handleHeartbeatLoss()

> **handleHeartbeatLoss**(`agentId`): `Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-supervisor-v2.ts:55](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-supervisor-v2.ts#L55)

#### Parameters

##### agentId

`string`

#### Returns

`Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)\>

---

### handleToolTimeout()

> **handleToolTimeout**(`toolId`): `Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-supervisor-v2.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-supervisor-v2.ts#L51)

#### Parameters

##### toolId

`string`

#### Returns

`Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)\>

---

### isHealthy()

> **isHealthy**(): `boolean`

Defined in: [packages/runtime/runtime/src/runtime-supervisor-v2.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-supervisor-v2.ts#L39)

#### Returns

`boolean`

---

### pause()

> **pause**(): `void`

Defined in: [packages/runtime/runtime/src/runtime-supervisor-v2.ts:67](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-supervisor-v2.ts#L67)

#### Returns

`void`

---

### resume()

> **resume**(): `void`

Defined in: [packages/runtime/runtime/src/runtime-supervisor-v2.ts:71](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-supervisor-v2.ts#L71)

#### Returns

`void`

---

### start()

> **start**(): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-supervisor-v2.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-supervisor-v2.ts#L31)

#### Returns

`Promise`\<`void`\>

---

### stop()

> **stop**(): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-supervisor-v2.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-supervisor-v2.ts#L35)

#### Returns

`Promise`\<`void`\>
