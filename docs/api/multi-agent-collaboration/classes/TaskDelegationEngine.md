[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-collaboration](../README.md) / TaskDelegationEngine

# Class: TaskDelegationEngine

Defined in: [packages/agent/multi-agent-collaboration/src/task-delegation-engine.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/task-delegation-engine.ts#L9)

## Constructors

### Constructor

> **new TaskDelegationEngine**(): `TaskDelegationEngine`

#### Returns

`TaskDelegationEngine`

## Methods

### addDependency()

> **addDependency**(`fromTaskId`, `toTaskId`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/task-delegation-engine.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/task-delegation-engine.ts#L27)

#### Parameters

##### fromTaskId

`string`

##### toTaskId

`string`

#### Returns

`void`

---

### delegate()

> **delegate**(`taskId`, `agentId`, `goalId`, `priority`): [`TaskDelegation`](../interfaces/TaskDelegation.md)

Defined in: [packages/agent/multi-agent-collaboration/src/task-delegation-engine.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/task-delegation-engine.ts#L13)

#### Parameters

##### taskId

`string`

##### agentId

`string`

##### goalId

`string`

##### priority

`number`

#### Returns

[`TaskDelegation`](../interfaces/TaskDelegation.md)

---

### detectCycle()

> **detectCycle**(): `boolean`

Defined in: [packages/agent/multi-agent-collaboration/src/task-delegation-engine.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/task-delegation-engine.ts#L38)

#### Returns

`boolean`

---

### getAllDelegations()

> **getAllDelegations**(): [`TaskDelegation`](../interfaces/TaskDelegation.md)[]

Defined in: [packages/agent/multi-agent-collaboration/src/task-delegation-engine.ts:71](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/task-delegation-engine.ts#L71)

#### Returns

[`TaskDelegation`](../interfaces/TaskDelegation.md)[]

---

### getDelegation()

> **getDelegation**(`taskId`): [`TaskDelegation`](../interfaces/TaskDelegation.md) \| `undefined`

Defined in: [packages/agent/multi-agent-collaboration/src/task-delegation-engine.ts:67](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/task-delegation-engine.ts#L67)

#### Parameters

##### taskId

`string`

#### Returns

[`TaskDelegation`](../interfaces/TaskDelegation.md) \| `undefined`
