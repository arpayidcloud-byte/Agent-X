[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / WorkflowHookManager

# Class: WorkflowHookManager

Defined in: [packages/workflow/workflow-orchestration/src/hooks.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/hooks.ts#L8)

## Constructors

### Constructor

> **new WorkflowHookManager**(): `WorkflowHookManager`

#### Returns

`WorkflowHookManager`

## Methods

### register()

> **register**(`hook`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/hooks.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/hooks.ts#L11)

#### Parameters

##### hook

[`WorkflowHook`](../interfaces/WorkflowHook.md)

#### Returns

`void`

---

### runAfterConflictResolution()

> **runAfterConflictResolution**(`conflictId`, `resolution`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/hooks.ts:69](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/hooks.ts#L69)

#### Parameters

##### conflictId

`string`

##### resolution

`string`

#### Returns

`Promise`\<`void`\>

---

### runAfterDispatch()

> **runAfterDispatch**(`taskId`, `result`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/hooks.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/hooks.ts#L45)

#### Parameters

##### taskId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### runAfterExecution()

> **runAfterExecution**(`taskId`, `result`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/hooks.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/hooks.ts#L33)

#### Parameters

##### taskId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### runAfterReplanning()

> **runAfterReplanning**(`workflowId`, `plan`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/hooks.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/hooks.ts#L57)

#### Parameters

##### workflowId

`string`

##### plan

`unknown`

#### Returns

`Promise`\<`void`\>

---

### runAfterWorkflow()

> **runAfterWorkflow**(`workflowId`, `result`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/hooks.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/hooks.ts#L21)

#### Parameters

##### workflowId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### runBeforeConflictResolution()

> **runBeforeConflictResolution**(`conflictId`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/hooks.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/hooks.ts#L63)

#### Parameters

##### conflictId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeDispatch()

> **runBeforeDispatch**(`taskId`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/hooks.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/hooks.ts#L39)

#### Parameters

##### taskId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeExecution()

> **runBeforeExecution**(`taskId`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/hooks.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/hooks.ts#L27)

#### Parameters

##### taskId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeReplanning()

> **runBeforeReplanning**(`workflowId`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/hooks.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/hooks.ts#L51)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeWorkflow()

> **runBeforeWorkflow**(`workflowId`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/hooks.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/hooks.ts#L15)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`void`\>
