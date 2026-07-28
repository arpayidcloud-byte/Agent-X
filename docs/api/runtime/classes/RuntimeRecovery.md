[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / RuntimeRecovery

# Class: RuntimeRecovery

Defined in: [packages/runtime/runtime/src/runtime-recovery.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-recovery.ts#L20)

## Constructors

### Constructor

> **new RuntimeRecovery**(`policy?`): `RuntimeRecovery`

Defined in: [packages/runtime/runtime/src/runtime-recovery.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-recovery.ts#L24)

#### Parameters

##### policy?

`Partial`\<[`RecoveryPolicy`](../interfaces/RecoveryPolicy.md)\> = `{}`

#### Returns

`RuntimeRecovery`

## Methods

### getPolicy()

> **getPolicy**(): [`RecoveryPolicy`](../interfaces/RecoveryPolicy.md)

Defined in: [packages/runtime/runtime/src/runtime-recovery.ts:103](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-recovery.ts#L103)

#### Returns

[`RecoveryPolicy`](../interfaces/RecoveryPolicy.md)

---

### getRecoveryHistory()

> **getRecoveryHistory**(): [`RecoveryAction`](../interfaces/RecoveryAction.md)[]

Defined in: [packages/runtime/runtime/src/runtime-recovery.ts:99](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-recovery.ts#L99)

#### Returns

[`RecoveryAction`](../interfaces/RecoveryAction.md)[]

---

### handleAgentCrash()

> **handleAgentCrash**(`agentId`): `Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-recovery.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-recovery.ts#L33)

#### Parameters

##### agentId

`string`

#### Returns

`Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)\>

---

### handleApprovalTimeout()

> **handleApprovalTimeout**(`requestId`): `Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-recovery.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-recovery.ts#L77)

#### Parameters

##### requestId

`string`

#### Returns

`Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)\>

---

### handleCheckpointRecovery()

> **handleCheckpointRecovery**(`workflowId`): `Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-recovery.ts:88](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-recovery.ts#L88)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)\>

---

### handleHeartbeatLoss()

> **handleHeartbeatLoss**(`agentId`): `Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-recovery.ts:66](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-recovery.ts#L66)

#### Parameters

##### agentId

`string`

#### Returns

`Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)\>

---

### handleToolTimeout()

> **handleToolTimeout**(`toolId`): `Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-recovery.ts:44](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-recovery.ts#L44)

#### Parameters

##### toolId

`string`

#### Returns

`Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)\>

---

### handleWorkflowRetry()

> **handleWorkflowRetry**(`workflowId`): `Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime-recovery.ts:55](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-recovery.ts#L55)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<[`RecoveryAction`](../interfaces/RecoveryAction.md)\>
