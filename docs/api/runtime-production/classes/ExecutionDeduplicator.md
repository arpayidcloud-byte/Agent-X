[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / ExecutionDeduplicator

# Class: ExecutionDeduplicator

Defined in: [packages/runtime/runtime-production/src/execution-deduplicator.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/execution-deduplicator.ts#L6)

## Constructors

### Constructor

> **new ExecutionDeduplicator**(): `ExecutionDeduplicator`

#### Returns

`ExecutionDeduplicator`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/runtime-production/src/execution-deduplicator.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/execution-deduplicator.ts#L21)

#### Returns

`void`

---

### deregister()

> **deregister**(`workflowId`): `void`

Defined in: [packages/runtime/runtime-production/src/execution-deduplicator.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/execution-deduplicator.ts#L17)

#### Parameters

##### workflowId

`string`

#### Returns

`void`

---

### isDuplicate()

> **isDuplicate**(`workflowId`): `boolean`

Defined in: [packages/runtime/runtime-production/src/execution-deduplicator.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/execution-deduplicator.ts#L9)

#### Parameters

##### workflowId

`string`

#### Returns

`boolean`

---

### register()

> **register**(`workflowId`): `void`

Defined in: [packages/runtime/runtime-production/src/execution-deduplicator.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/execution-deduplicator.ts#L13)

#### Parameters

##### workflowId

`string`

#### Returns

`void`
