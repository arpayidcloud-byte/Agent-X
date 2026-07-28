[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-kernel](../README.md) / KernelMetricsCollector

# Class: KernelMetricsCollector

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-metrics.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-metrics.ts#L6)

## Constructors

### Constructor

> **new KernelMetricsCollector**(): `KernelMetricsCollector`

#### Returns

`KernelMetricsCollector`

## Properties

### checkpointCount

> **checkpointCount**: `number` = `0`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-metrics.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-metrics.ts#L9)

---

### failureCount

> **failureCount**: `number` = `0`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-metrics.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-metrics.ts#L11)

---

### recoveryCount

> **recoveryCount**: `number` = `0`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-metrics.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-metrics.ts#L10)

---

### sessionCount

> **sessionCount**: `number` = `0`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-metrics.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-metrics.ts#L7)

---

### totalThinkingTimeMs

> **totalThinkingTimeMs**: `number` = `0`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-metrics.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-metrics.ts#L8)

## Methods

### getAverageThinkingTime()

> **getAverageThinkingTime**(): `number`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-metrics.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-metrics.ts#L30)

#### Returns

`number`

---

### recordCheckpoint()

> **recordCheckpoint**(): `void`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-metrics.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-metrics.ts#L18)

#### Returns

`void`

---

### recordFailure()

> **recordFailure**(): `void`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-metrics.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-metrics.ts#L26)

#### Returns

`void`

---

### recordRecovery()

> **recordRecovery**(): `void`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-metrics.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-metrics.ts#L22)

#### Returns

`void`

---

### recordSession()

> **recordSession**(`timeMs`): `void`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-metrics.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-metrics.ts#L13)

#### Parameters

##### timeMs

`number`

#### Returns

`void`
