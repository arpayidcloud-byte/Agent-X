[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / WorkflowHook

# Interface: WorkflowHook

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:82](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L82)

## Description

Workflow hook

## Properties

### afterNode?

> `optional` **afterNode?**: (`node`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:87](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L87)

#### Parameters

##### node

[`WorkflowNode`](WorkflowNode.md)

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### afterWorkflow?

> `optional` **afterWorkflow?**: (`workflow`, `metrics`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:85](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L85)

#### Parameters

##### workflow

[`WorkflowDefinition`](WorkflowDefinition.md)

##### metrics

[`WorkflowMetrics`](WorkflowMetrics.md)

#### Returns

`Promise`\<`void`\>

---

### beforeNode?

> `optional` **beforeNode?**: (`node`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:86](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L86)

#### Parameters

##### node

[`WorkflowNode`](WorkflowNode.md)

#### Returns

`Promise`\<`void`\>

---

### beforeWorkflow?

> `optional` **beforeWorkflow?**: (`workflow`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:84](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L84)

#### Parameters

##### workflow

[`WorkflowDefinition`](WorkflowDefinition.md)

#### Returns

`Promise`\<`void`\>

---

### name

> **name**: `string`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:83](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L83)

---

### onCheckpoint?

> `optional` **onCheckpoint?**: (`checkpoint`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:90](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L90)

#### Parameters

##### checkpoint

[`Checkpoint`](Checkpoint.md)

#### Returns

`Promise`\<`void`\>

---

### onFailure?

> `optional` **onFailure?**: (`node`, `error`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:89](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L89)

#### Parameters

##### node

[`WorkflowNode`](WorkflowNode.md)

##### error

`Error`

#### Returns

`Promise`\<`void`\>

---

### onMetrics?

> `optional` **onMetrics?**: (`metrics`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:91](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L91)

#### Parameters

##### metrics

[`WorkflowMetrics`](WorkflowMetrics.md)

#### Returns

`Promise`\<`void`\>

---

### onRetry?

> `optional` **onRetry?**: (`node`, `attempt`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:88](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L88)

#### Parameters

##### node

[`WorkflowNode`](WorkflowNode.md)

##### attempt

`number`

#### Returns

`Promise`\<`void`\>
