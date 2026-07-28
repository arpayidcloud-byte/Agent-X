[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / BackoffPolicy

# Interface: BackoffPolicy

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:59](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L59)

## Description

Backoff policy

## Properties

### baseDelayMs

> **baseDelayMs**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L61)

---

### maxDelayMs

> **maxDelayMs**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L63)

---

### multiplier

> **multiplier**: `number`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L62)

---

### type

> **type**: `"exponential"` \| `"linear"` \| `"constant"`

Defined in: [packages/workflow/workflow-engine/src/interfaces-v2.ts:60](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/interfaces-v2.ts#L60)
