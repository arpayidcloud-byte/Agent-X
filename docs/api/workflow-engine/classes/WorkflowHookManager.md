[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / WorkflowHookManager

# Class: WorkflowHookManager

Defined in: [packages/workflow/workflow-engine/src/hooks.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/hooks.ts#L9)

## Constructors

### Constructor

> **new WorkflowHookManager**(): `WorkflowHookManager`

#### Returns

`WorkflowHookManager`

## Methods

### executeAfterHooks()

> **executeAfterHooks**(`workflow`, `metrics`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/hooks.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/hooks.ts#L26)

#### Parameters

##### workflow

[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

##### metrics

[`WorkflowMetrics`](../interfaces/WorkflowMetrics.md)

#### Returns

`Promise`\<`void`\>

---

### executeAfterNodeHook()

> **executeAfterNodeHook**(`node`, `result`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/hooks.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/hooks.ts#L41)

#### Parameters

##### node

[`WorkflowNode`](../interfaces/WorkflowNode.md)

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### executeBeforeHooks()

> **executeBeforeHooks**(`workflow`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/hooks.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/hooks.ts#L20)

#### Parameters

##### workflow

[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

#### Returns

`Promise`\<`void`\>

---

### executeBeforeNodeHook()

> **executeBeforeNodeHook**(`node`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/hooks.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/hooks.ts#L35)

#### Parameters

##### node

[`WorkflowNode`](../interfaces/WorkflowNode.md)

#### Returns

`Promise`\<`void`\>

---

### executeFailureHook()

> **executeFailureHook**(`node`, `error`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/hooks.ts:53](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/hooks.ts#L53)

#### Parameters

##### node

[`WorkflowNode`](../interfaces/WorkflowNode.md)

##### error

`Error`

#### Returns

`Promise`\<`void`\>

---

### executeRetryHook()

> **executeRetryHook**(`node`, `attempt`): `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/hooks.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/hooks.ts#L47)

#### Parameters

##### node

[`WorkflowNode`](../interfaces/WorkflowNode.md)

##### attempt

`number`

#### Returns

`Promise`\<`void`\>

---

### register()

> **register**(`hook`): `void`

Defined in: [packages/workflow/workflow-engine/src/hooks.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/hooks.ts#L12)

#### Parameters

##### hook

[`WorkflowHook`](../interfaces/WorkflowHook.md)

#### Returns

`void`

---

### unregister()

> **unregister**(`hookName`): `void`

Defined in: [packages/workflow/workflow-engine/src/hooks.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/hooks.ts#L16)

#### Parameters

##### hookName

`string`

#### Returns

`void`
