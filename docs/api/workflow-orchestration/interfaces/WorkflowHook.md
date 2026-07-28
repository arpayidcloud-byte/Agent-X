[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / WorkflowHook

# Interface: WorkflowHook

Defined in: [packages/workflow/workflow-orchestration/src/interfaces.ts:89](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/interfaces.ts#L89)

## Properties

### afterConflictResolution?

> `optional` **afterConflictResolution?**: (`conflictId`, `resolution`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/interfaces.ts:99](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/interfaces.ts#L99)

#### Parameters

##### conflictId

`string`

##### resolution

`string`

#### Returns

`Promise`\<`void`\>

---

### afterDispatch?

> `optional` **afterDispatch?**: (`taskId`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/interfaces.ts:95](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/interfaces.ts#L95)

#### Parameters

##### taskId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### afterExecution?

> `optional` **afterExecution?**: (`taskId`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/interfaces.ts:93](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/interfaces.ts#L93)

#### Parameters

##### taskId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### afterReplanning?

> `optional` **afterReplanning?**: (`workflowId`, `plan`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/interfaces.ts:97](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/interfaces.ts#L97)

#### Parameters

##### workflowId

`string`

##### plan

`unknown`

#### Returns

`Promise`\<`void`\>

---

### afterWorkflow?

> `optional` **afterWorkflow?**: (`workflowId`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/interfaces.ts:91](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/interfaces.ts#L91)

#### Parameters

##### workflowId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### beforeConflictResolution?

> `optional` **beforeConflictResolution?**: (`conflictId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/interfaces.ts:98](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/interfaces.ts#L98)

#### Parameters

##### conflictId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeDispatch?

> `optional` **beforeDispatch?**: (`taskId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/interfaces.ts:94](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/interfaces.ts#L94)

#### Parameters

##### taskId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeExecution?

> `optional` **beforeExecution?**: (`taskId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/interfaces.ts:92](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/interfaces.ts#L92)

#### Parameters

##### taskId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeReplanning?

> `optional` **beforeReplanning?**: (`workflowId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/interfaces.ts:96](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/interfaces.ts#L96)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeWorkflow?

> `optional` **beforeWorkflow?**: (`workflowId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-orchestration/src/interfaces.ts:90](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/interfaces.ts#L90)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`void`\>
