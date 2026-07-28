[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [agent/agent-platform/src](../README.md) / IMultiAgentOrchestrator

# Interface: IMultiAgentOrchestrator

Defined in: [packages/agent/agent-platform/src/sub-agents/interfaces.ts:121](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/interfaces.ts#L121)

## Methods

### allocateAgents()

> **allocateAgents**(`workflowId`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/interfaces.ts:124](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/interfaces.ts#L124)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`void`\>

---

### createWorkflow()

> **createWorkflow**(`goal`, `budget`): `Promise`\<`string`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/interfaces.ts:122](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/interfaces.ts#L122)

#### Parameters

##### goal

`string`

##### budget

[`ResourceAllocation`](ResourceAllocation.md)

#### Returns

`Promise`\<`string`\>

---

### decomposeTask()

> **decomposeTask**(`workflowId`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/interfaces.ts:123](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/interfaces.ts#L123)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`void`\>

---

### execute()

> **execute**(`workflowId`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/interfaces.ts:125](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/interfaces.ts#L125)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`unknown`\>

---

### merge()

> **merge**(`workflowId`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/interfaces.ts:126](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/interfaces.ts#L126)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`unknown`\>

---

### recover()

> **recover**(`workflowId`, `failedAgentId`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/interfaces.ts:128](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/interfaces.ts#L128)

#### Parameters

##### workflowId

`string`

##### failedAgentId

`string`

#### Returns

`Promise`\<`void`\>

---

### shutdown()

> **shutdown**(`workflowId`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/agent-platform/src/sub-agents/interfaces.ts:129](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/interfaces.ts#L129)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`void`\>

---

### supervise()

> **supervise**(`workflowId`): `void`

Defined in: [packages/agent/agent-platform/src/sub-agents/interfaces.ts:127](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/agent-platform/src/sub-agents/interfaces.ts#L127)

#### Parameters

##### workflowId

`string`

#### Returns

`void`
