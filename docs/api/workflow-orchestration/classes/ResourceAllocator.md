[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / ResourceAllocator

# Class: ResourceAllocator

Defined in: [packages/workflow/workflow-orchestration/src/resource-allocator.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/resource-allocator.ts#L8)

## Constructors

### Constructor

> **new ResourceAllocator**(): `ResourceAllocator`

#### Returns

`ResourceAllocator`

## Methods

### allocate()

> **allocate**(`type`, `capacity`): [`ResourceAllocation`](../interfaces/ResourceAllocation.md)

Defined in: [packages/workflow/workflow-orchestration/src/resource-allocator.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/resource-allocator.ts#L11)

#### Parameters

##### type

`string`

##### capacity

`number`

#### Returns

[`ResourceAllocation`](../interfaces/ResourceAllocation.md)

---

### getAllocations()

> **getAllocations**(): [`ResourceAllocation`](../interfaces/ResourceAllocation.md)[]

Defined in: [packages/workflow/workflow-orchestration/src/resource-allocator.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/resource-allocator.ts#L27)

#### Returns

[`ResourceAllocation`](../interfaces/ResourceAllocation.md)[]

---

### release()

> **release**(`id`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/resource-allocator.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/resource-allocator.ts#L23)

#### Parameters

##### id

`string`

#### Returns

`void`
