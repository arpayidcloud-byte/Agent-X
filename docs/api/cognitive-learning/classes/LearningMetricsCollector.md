[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-learning](../README.md) / LearningMetricsCollector

# Class: LearningMetricsCollector

Defined in: [packages/cognitive/cognitive-learning/src/metrics.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/metrics.ts#L19)

## Constructors

### Constructor

> **new LearningMetricsCollector**(): `LearningMetricsCollector`

#### Returns

`LearningMetricsCollector`

## Properties

### adaptationsGenerated

> **adaptationsGenerated**: `number` = `0`

Defined in: [packages/cognitive/cognitive-learning/src/metrics.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/metrics.ts#L25)

---

### experiencesCollected

> **experiencesCollected**: `number` = `0`

Defined in: [packages/cognitive/cognitive-learning/src/metrics.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/metrics.ts#L27)

---

### feedbackProcessed

> **feedbackProcessed**: `number` = `0`

Defined in: [packages/cognitive/cognitive-learning/src/metrics.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/metrics.ts#L23)

---

### improvementsGenerated

> **improvementsGenerated**: `number` = `0`

Defined in: [packages/cognitive/cognitive-learning/src/metrics.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/metrics.ts#L26)

---

### learningRuns

> **learningRuns**: `number` = `0`

Defined in: [packages/cognitive/cognitive-learning/src/metrics.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/metrics.ts#L20)

---

### patternsLearned

> **patternsLearned**: `number` = `0`

Defined in: [packages/cognitive/cognitive-learning/src/metrics.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/metrics.ts#L21)

---

### patternsRejected

> **patternsRejected**: `number` = `0`

Defined in: [packages/cognitive/cognitive-learning/src/metrics.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/metrics.ts#L22)

---

### reflectionsCreated

> **reflectionsCreated**: `number` = `0`

Defined in: [packages/cognitive/cognitive-learning/src/metrics.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/metrics.ts#L24)

---

### totalConfidenceDelta

> **totalConfidenceDelta**: `number` = `0`

Defined in: [packages/cognitive/cognitive-learning/src/metrics.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/metrics.ts#L28)

---

### totalFailures

> **totalFailures**: `number` = `0`

Defined in: [packages/cognitive/cognitive-learning/src/metrics.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/metrics.ts#L30)

---

### totalSuccesses

> **totalSuccesses**: `number` = `0`

Defined in: [packages/cognitive/cognitive-learning/src/metrics.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/metrics.ts#L29)

## Methods

### getMetrics()

> **getMetrics**(): [`LearningMetrics`](../interfaces/LearningMetrics.md)

Defined in: [packages/cognitive/cognitive-learning/src/metrics.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/metrics.ts#L38)

#### Returns

[`LearningMetrics`](../interfaces/LearningMetrics.md)

---

### recordRun()

> **recordRun**(`success`): `void`

Defined in: [packages/cognitive/cognitive-learning/src/metrics.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-learning/src/metrics.ts#L32)

#### Parameters

##### success

`boolean`

#### Returns

`void`
