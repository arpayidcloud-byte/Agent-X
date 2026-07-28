[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / IdempotencyManager

# Class: IdempotencyManager

Defined in: [packages/runtime/runtime-production/src/idempotency-manager.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/idempotency-manager.ts#L8)

## Constructors

### Constructor

> **new IdempotencyManager**(): `IdempotencyManager`

#### Returns

`IdempotencyManager`

## Methods

### checkAndStore()

> **checkAndStore**(`key`): `void`

Defined in: [packages/runtime/runtime-production/src/idempotency-manager.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/idempotency-manager.ts#L15)

#### Parameters

##### key

`string`

#### Returns

`void`

---

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/runtime-production/src/idempotency-manager.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/idempotency-manager.ts#L26)

#### Returns

`void`

---

### generateKey()

> **generateKey**(`traceId`, `workflowId`, `requestId`, `goalHash`): `string`

Defined in: [packages/runtime/runtime-production/src/idempotency-manager.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/idempotency-manager.ts#L11)

#### Parameters

##### traceId

`string`

##### workflowId

`string`

##### requestId

`string`

##### goalHash

`string`

#### Returns

`string`

---

### isExecuted()

> **isExecuted**(`key`): `boolean`

Defined in: [packages/runtime/runtime-production/src/idempotency-manager.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/idempotency-manager.ts#L22)

#### Parameters

##### key

`string`

#### Returns

`boolean`
