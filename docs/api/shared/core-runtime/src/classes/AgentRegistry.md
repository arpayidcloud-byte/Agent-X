[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / AgentRegistry

# Class: AgentRegistry

Defined in: [packages/shared/core-runtime/src/registry/agent-registry.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/registry/agent-registry.ts#L13)

## Constructors

### Constructor

> **new AgentRegistry**(`_config?`): `AgentRegistry`

Defined in: [packages/shared/core-runtime/src/registry/agent-registry.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/registry/agent-registry.ts#L16)

#### Parameters

##### \_config?

[`AgentRegistryConfig`](../interfaces/AgentRegistryConfig.md)

#### Returns

`AgentRegistry`

## Methods

### execute()

> **execute**(`agentId`, `task`, `context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/shared/core-runtime/src/registry/agent-registry.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/registry/agent-registry.ts#L45)

#### Parameters

##### agentId

`string`

##### task

[`TaskModel`](../interfaces/TaskModel.md)

##### context

[`TaskContext`](../interfaces/TaskContext.md)

#### Returns

`Promise`\<`unknown`\>

---

### executeByRole()

> **executeByRole**(`role`, `task`, `context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/shared/core-runtime/src/registry/agent-registry.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/registry/agent-registry.ts#L53)

#### Parameters

##### role

`string`

##### task

[`TaskModel`](../interfaces/TaskModel.md)

##### context

[`TaskContext`](../interfaces/TaskContext.md)

#### Returns

`Promise`\<`unknown`\>

---

### get()

> **get**(`agentId`): [`Agent`](../interfaces/Agent.md) \| `undefined`

Defined in: [packages/shared/core-runtime/src/registry/agent-registry.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/registry/agent-registry.ts#L28)

#### Parameters

##### agentId

`string`

#### Returns

[`Agent`](../interfaces/Agent.md) \| `undefined`

---

### getByRole()

> **getByRole**(`role`): [`Agent`](../interfaces/Agent.md) \| `undefined`

Defined in: [packages/shared/core-runtime/src/registry/agent-registry.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/registry/agent-registry.ts#L32)

#### Parameters

##### role

`string`

#### Returns

[`Agent`](../interfaces/Agent.md) \| `undefined`

---

### list()

> **list**(): [`Agent`](../interfaces/Agent.md)[]

Defined in: [packages/shared/core-runtime/src/registry/agent-registry.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/registry/agent-registry.ts#L41)

#### Returns

[`Agent`](../interfaces/Agent.md)[]

---

### register()

> **register**(`agent`): `void`

Defined in: [packages/shared/core-runtime/src/registry/agent-registry.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/registry/agent-registry.ts#L20)

#### Parameters

##### agent

[`Agent`](../interfaces/Agent.md)

#### Returns

`void`

---

### unregister()

> **unregister**(`agentId`): `void`

Defined in: [packages/shared/core-runtime/src/registry/agent-registry.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/registry/agent-registry.ts#L24)

#### Parameters

##### agentId

`string`

#### Returns

`void`
