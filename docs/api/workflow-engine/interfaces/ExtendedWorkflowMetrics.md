[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / ExtendedWorkflowMetrics

# Interface: ExtendedWorkflowMetrics

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:134](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L134)

## Description

Extended workflow metrics

## Extends

- [`WorkflowMetrics`](WorkflowMetrics.md)

## Properties

### agentCalls

> **agentCalls**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:141](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L141)

---

### approvalCount

> **approvalCount**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:139](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L139)

---

### averageNodeTime

> **averageNodeTime**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:144](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L144)

---

### cancelledNodes

> **cancelledNodes**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:142](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L142)

---

### checkpointCount

> **checkpointCount**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:143](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L143)

---

### completedNodes

> **completedNodes**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:198](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L198)

#### Inherited from

[`WorkflowMetrics`](WorkflowMetrics.md).[`completedNodes`](WorkflowMetrics.md#completednodes)

---

### criticalPathLength

> **criticalPathLength**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:138](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L138)

---

### errors

> **errors**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:204](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L204)

#### Inherited from

[`WorkflowMetrics`](WorkflowMetrics.md).[`errors`](WorkflowMetrics.md#errors)

---

### executionTimeMs

> **executionTimeMs**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:135](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L135)

---

### failedNodes

> **failedNodes**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:199](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L199)

#### Inherited from

[`WorkflowMetrics`](WorkflowMetrics.md).[`failedNodes`](WorkflowMetrics.md#failednodes)

---

### nodeDurations

> **nodeDurations**: `Map`\<`string`, `number`>>>>\>

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:202](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L202)

#### Inherited from

[`WorkflowMetrics`](WorkflowMetrics.md).[`nodeDurations`](WorkflowMetrics.md#nodedurations)

---

### parallelismLevel

> **parallelismLevel**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:137](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L137)

---

### queueTimeMs

> **queueTimeMs**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:136](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L136)

---

### resourceUsage

> **resourceUsage**: `object`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:145](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L145)

#### costUsd

> **costUsd**: `number`

#### providers

> **providers**: `number`

#### tokens

> **tokens**: `number`

---

### retries

> **retries**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:203](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L203)

#### Inherited from

[`WorkflowMetrics`](WorkflowMetrics.md).[`retries`](WorkflowMetrics.md#retries)

---

### skippedNodes

> **skippedNodes**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:200](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L200)

#### Inherited from

[`WorkflowMetrics`](WorkflowMetrics.md).[`skippedNodes`](WorkflowMetrics.md#skippednodes)

---

### toolCalls

> **toolCalls**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:140](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L140)

---

### totalDurationMs

> **totalDurationMs**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:201](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L201)

#### Inherited from

[`WorkflowMetrics`](WorkflowMetrics.md).[`totalDurationMs`](WorkflowMetrics.md#totaldurationms)

---

### totalNodes

> **totalNodes**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:197](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L197)

#### Inherited from

[`WorkflowMetrics`](WorkflowMetrics.md).[`totalNodes`](WorkflowMetrics.md#totalnodes)

---

### workflowId

> **workflowId**: `string`

Defined in: [packages/workflow/workflow-engine/src/interfaces.ts:196](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces.ts#L196)

#### Inherited from

[`WorkflowMetrics`](WorkflowMetrics.md).[`workflowId`](WorkflowMetrics.md#workflowid)
