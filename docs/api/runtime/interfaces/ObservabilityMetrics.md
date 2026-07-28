[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / ObservabilityMetrics

# Interface: ObservabilityMetrics

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L8)

## Properties

### agent

> **agent**: `object`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L25)

#### activeAgents

> **activeAgents**: `number`

#### averageCompletionTimeMs

> **averageCompletionTimeMs**: `number`

#### totalInvocations

> **totalInvocations**: `number`

---

### approval

> **approval**: `object`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L30)

#### approvedCount

> **approvedCount**: `number`

#### averageDelayMs

> **averageDelayMs**: `number`

#### expiredCount

> **expiredCount**: `number`

#### rejectedCount

> **rejectedCount**: `number`

#### totalRequests

> **totalRequests**: `number`

---

### context

> **context**: `object`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:52](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L52)

#### averageTokens

> **averageTokens**: `number`

#### compressionRatio

> **compressionRatio**: `number`

#### totalContexts

> **totalContexts**: `number`

---

### health

> **health**: `object`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L57)

#### componentCount

> **componentCount**: `number`

#### overallHealthy

> **overallHealthy**: `boolean`

#### unhealthyCount

> **unhealthyCount**: `number`

---

### knowledge

> **knowledge**: `object`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L47)

#### averageConfidence

> **averageConfidence**: `number`

#### totalDocuments

> **totalDocuments**: `number`

#### totalNodes

> **totalNodes**: `number`

---

### memory

> **memory**: `object`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L37)

#### avgImportance

> **avgImportance**: `number`

#### hitRate

> **hitRate**: `number`

#### totalEntries

> **totalEntries**: `number`

---

### planning

> **planning**: `object`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L42)

#### averageRiskScore

> **averageRiskScore**: `number`

#### averageTaskCount

> **averageTaskCount**: `number`

#### totalPlans

> **totalPlans**: `number`

---

### runtime

> **runtime**: `object`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L9)

#### activeSessions

> **activeSessions**: `number`

#### executionTimeMs

> **executionTimeMs**: `number`

#### sessionCount

> **sessionCount**: `number`

---

### tool

> **tool**: `object`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L19)

#### averageExecutionTimeMs

> **averageExecutionTimeMs**: `number`

#### failedCalls

> **failedCalls**: `number`

#### successfulCalls

> **successfulCalls**: `number`

#### totalCalls

> **totalCalls**: `number`

---

### workflow

> **workflow**: `object`

Defined in: [packages/runtime/runtime/src/runtime-observability.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime-observability.ts#L14)

#### completedWorkflows

> **completedWorkflows**: `number`

#### failedWorkflows

> **failedWorkflows**: `number`

#### totalWorkflows

> **totalWorkflows**: `number`
