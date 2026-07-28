[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / NodeExecutor

# Class: NodeExecutor

Defined in: [packages/workflow/workflow-engine/src/node-executor.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/node-executor.ts#L9)

## Description

Node executor interface

## Implements

- [`INodeExecutor`](../interfaces/INodeExecutor.md)

## Constructors

### Constructor

> **new NodeExecutor**(): `NodeExecutor`

#### Returns

`NodeExecutor`

## Methods

### executeAgentNode()

> **executeAgentNode**(`node`, `_context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/node-executor.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/node-executor.ts#L57)

#### Parameters

##### node

[`WorkflowNode`](../interfaces/WorkflowNode.md)

##### \_context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`unknown`\>

#### Implementation of

[`INodeExecutor`](../interfaces/INodeExecutor.md).[`executeAgentNode`](../interfaces/INodeExecutor.md#executeagentnode)

---

### executeApprovalNode()

> **executeApprovalNode**(`node`, `_context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/node-executor.ts:76](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/node-executor.ts#L76)

#### Parameters

##### node

[`WorkflowNode`](../interfaces/WorkflowNode.md)

##### \_context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`unknown`\>

#### Implementation of

[`INodeExecutor`](../interfaces/INodeExecutor.md).[`executeApprovalNode`](../interfaces/INodeExecutor.md#executeapprovalnode)

---

### executeConditionalNode()

> **executeConditionalNode**(`node`, `_context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/node-executor.ts:118](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/node-executor.ts#L118)

#### Parameters

##### node

[`WorkflowNode`](../interfaces/WorkflowNode.md)

##### \_context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`unknown`\>

#### Implementation of

[`INodeExecutor`](../interfaces/INodeExecutor.md).[`executeConditionalNode`](../interfaces/INodeExecutor.md#executeconditionalnode)

---

### executeLoopNode()

> **executeLoopNode**(`node`, `_context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/node-executor.ts:101](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/node-executor.ts#L101)

#### Parameters

##### node

[`WorkflowNode`](../interfaces/WorkflowNode.md)

##### \_context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`unknown`\>

#### Implementation of

[`INodeExecutor`](../interfaces/INodeExecutor.md).[`executeLoopNode`](../interfaces/INodeExecutor.md#executeloopnode)

---

### executeNode()

> **executeNode**(`node`, `_context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/node-executor.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/node-executor.ts#L10)

#### Parameters

##### node

[`WorkflowNode`](../interfaces/WorkflowNode.md)

##### \_context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`unknown`\>

---

### executeParallelNode()

> **executeParallelNode**(`node`, `_context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/node-executor.ts:89](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/node-executor.ts#L89)

#### Parameters

##### node

[`WorkflowNode`](../interfaces/WorkflowNode.md)

##### \_context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`unknown`\>

#### Implementation of

[`INodeExecutor`](../interfaces/INodeExecutor.md).[`executeParallelNode`](../interfaces/INodeExecutor.md#executeparallelnode)

---

### executeToolNode()

> **executeToolNode**(`node`, `_context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/node-executor.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/node-executor.ts#L38)

#### Parameters

##### node

[`WorkflowNode`](../interfaces/WorkflowNode.md)

##### \_context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`unknown`\>

#### Implementation of

[`INodeExecutor`](../interfaces/INodeExecutor.md).[`executeToolNode`](../interfaces/INodeExecutor.md#executetoolnode)
