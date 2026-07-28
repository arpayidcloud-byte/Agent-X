[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-algorithms](../README.md) / ReasoningEngine

# Class: ReasoningEngine

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L22)

## Constructors

### Constructor

> **new ReasoningEngine**(): `ReasoningEngine`

#### Returns

`ReasoningEngine`

## Properties

### backwardChaining

> **backwardChaining**: [`BackwardChaining`](BackwardChaining.md)

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L24)

---

### checkpointManager

> **checkpointManager**: [`CheckpointManager`](CheckpointManager.md)

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L32)

---

### confidenceCalculator

> **confidenceCalculator**: [`ConfidenceCalculator`](ConfidenceCalculator.md)

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L28)

---

### conflictResolver

> **conflictResolver**: [`ConflictResolver`](ConflictResolver.md)

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L29)

---

### decisionTree

> **decisionTree**: [`DecisionTreeEngine`](DecisionTreeEngine.md)

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L25)

---

### events

> **events**: [`ReasoningEventBus`](ReasoningEventBus.md)

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L35)

---

### explanationEngine

> **explanationEngine**: [`ExplanationEngine`](ExplanationEngine.md)

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L30)

---

### forwardChaining

> **forwardChaining**: [`ForwardChaining`](ForwardChaining.md)

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L23)

---

### graphEngine

> **graphEngine**: [`ReasoningGraphEngine`](ReasoningGraphEngine.md)

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L26)

---

### hooks

> **hooks**: [`ReasoningHookManager`](ReasoningHookManager.md)

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L34)

---

### hypothesisEngine

> **hypothesisEngine**: [`HypothesisEngine`](HypothesisEngine.md)

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L27)

---

### recoveryManager

> **recoveryManager**: [`RecoveryManager`](RecoveryManager.md)

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L33)

---

### validator

> **validator**: [`ReasoningValidator`](ReasoningValidator.md)

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L31)

## Methods

### checkpoint()

> **checkpoint**(`sessionId`, `snapshot`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:124](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L124)

#### Parameters

##### sessionId

`string`

##### snapshot

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`void`\>

---

### execute()

> **execute**(`sessionId`, `goal`, `facts`, `rules`): `Promise`\<`Set`\<`string`>>>>>>>>\>\>

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L48)

#### Parameters

##### sessionId

`string`

##### goal

`string`

##### facts

`Set`\<`string`\>

##### rules

[`Rule`](../interfaces/Rule.md)[]

#### Returns

`Promise`\<`Set`\<`string`\>\>

---

### executeGoalDriven()

> **executeGoalDriven**(`sessionId`, `goal`, `facts`, `rules`): `Promise`\<`boolean`>>>>\>

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L77)

#### Parameters

##### sessionId

`string`

##### goal

`string`

##### facts

`Set`\<`string`\>

##### rules

[`Rule`](../interfaces/Rule.md)[]

#### Returns

`Promise`\<`boolean`\>

---

### explain()

> **explain**(`trace`, `evidence`): `string`

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:135](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L135)

#### Parameters

##### trace

`string`[]

##### evidence

`string`[]

#### Returns

`string`

---

### recover()

> **recover**(`sessionId`): `Promise`\<`Record`\<`string`, `unknown`>>>>>>>>\>\>

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:129](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L129)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

---

### validate()

> **validate**(`tree`): `void`

Defined in: [packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts:106](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/reasoning-engine.ts#L106)

#### Parameters

##### tree

[`DecisionTree`](../interfaces/DecisionTree.md)

#### Returns

`void`
