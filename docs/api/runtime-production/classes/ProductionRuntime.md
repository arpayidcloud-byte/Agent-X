[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / ProductionRuntime

# Class: ProductionRuntime

Defined in: [packages/runtime/runtime-production/src/runtime.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/runtime.ts#L10)

## Constructors

### Constructor

> **new ProductionRuntime**(`redisUrl?`): `ProductionRuntime`

Defined in: [packages/runtime/runtime-production/src/runtime.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/runtime.ts#L20)

#### Parameters

##### redisUrl?

`string` = `'redis://localhost:6379'`

#### Returns

`ProductionRuntime`

## Properties

### approvalRepo

> **approvalRepo**: `PrismaApprovalRepository`

Defined in: [packages/runtime/runtime-production/src/runtime.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/runtime.ts#L14)

---

### eventBus

> **eventBus**: `InMemoryEventBus`

Defined in: [packages/runtime/runtime-production/src/runtime.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/runtime.ts#L18)

---

### eventRepo

> **eventRepo**: `PrismaEventRepository`

Defined in: [packages/runtime/runtime-production/src/runtime.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/runtime.ts#L13)

---

### lock

> **lock**: `RedisLockProvider`

Defined in: [packages/runtime/runtime-production/src/runtime.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/runtime.ts#L16)

---

### prisma

> **prisma**: `any`

Defined in: [packages/runtime/runtime-production/src/runtime.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/runtime.ts#L11)

---

### queue

> **queue**: `BullMQProvider`

Defined in: [packages/runtime/runtime-production/src/runtime.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/runtime.ts#L15)

---

### scheduler

> **scheduler**: `Scheduler`

Defined in: [packages/runtime/runtime-production/src/runtime.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/runtime.ts#L17)

---

### taskRepo

> **taskRepo**: `PrismaTaskRepository`

Defined in: [packages/runtime/runtime-production/src/runtime.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/runtime.ts#L12)

## Methods

### start()

> **start**(): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/runtime.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/runtime.ts#L32)

#### Returns

`Promise`\<`void`\>

---

### stop()

> **stop**(): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/runtime.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/runtime.ts#L37)

#### Returns

`Promise`\<`void`\>
