[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-reasoning](../README.md) / CollaborationHookManager

# Class: CollaborationHookManager

Defined in: [packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts#L8)

## Constructors

### Constructor

> **new CollaborationHookManager**(): `CollaborationHookManager`

#### Returns

`CollaborationHookManager`

## Methods

### register()

> **register**(`hook`): `void`

Defined in: [packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts#L11)

#### Parameters

##### hook

[`CollaborationHook`](../interfaces/CollaborationHook.md)

#### Returns

`void`

---

### runAfterCollaboration()

> **runAfterCollaboration**(`sessionId`, `result`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts#L21)

#### Parameters

##### sessionId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### runAfterConsensus()

> **runAfterConsensus**(`proposalId`, `approved`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts#L45)

#### Parameters

##### proposalId

`string`

##### approved

`boolean`

#### Returns

`Promise`\<`void`\>

---

### runAfterDelegation()

> **runAfterDelegation**(`taskId`, `result`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts#L33)

#### Parameters

##### taskId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### runAfterRecovery()

> **runAfterRecovery**(`sessionId`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts#L57)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeCollaboration()

> **runBeforeCollaboration**(`sessionId`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts#L15)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeConsensus()

> **runBeforeConsensus**(`proposalId`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts#L39)

#### Parameters

##### proposalId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeDelegation()

> **runBeforeDelegation**(`taskId`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts#L27)

#### Parameters

##### taskId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeRecovery()

> **runBeforeRecovery**(`sessionId`): `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/application/orchestrator/CollaborationHookManager.ts#L51)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>
