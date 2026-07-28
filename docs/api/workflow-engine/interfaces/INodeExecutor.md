[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / INodeExecutor

# Interface: INodeExecutor

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:153](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L153)

## Description

Node executor interface

## Methods

### executeAgentNode()

> **executeAgentNode**(`node`, `context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:155](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L155)

#### Parameters

##### node

[`WorkflowNode`](WorkflowNode.md)

##### context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`unknown`\>

---

### executeApprovalNode()

> **executeApprovalNode**(`node`, `context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:156](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L156)

#### Parameters

##### node

[`WorkflowNode`](WorkflowNode.md)

##### context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`unknown`\>

---

### executeConditionalNode()

> **executeConditionalNode**(`node`, `context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:159](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L159)

#### Parameters

##### node

[`WorkflowNode`](WorkflowNode.md)

##### context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`unknown`\>

---

### executeLoopNode()

> **executeLoopNode**(`node`, `context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:158](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L158)

#### Parameters

##### node

[`WorkflowNode`](WorkflowNode.md)

##### context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`unknown`\>

---

### executeParallelNode()

> **executeParallelNode**(`node`, `context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:157](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L157)

#### Parameters

##### node

[`WorkflowNode`](WorkflowNode.md)

##### context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`unknown`\>

---

### executeToolNode()

> **executeToolNode**(`node`, `context`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:154](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L154)

#### Parameters

##### node

[`WorkflowNode`](WorkflowNode.md)

##### context

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`unknown`\>
