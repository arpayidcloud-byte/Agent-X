[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [autonomous-cognition](../README.md) / AdaptivePlanningEngine

# Class: AdaptivePlanningEngine

Defined in: [packages/cognitive/autonomous-cognition/src/domain/self-improvement/SelfImprovementEngine.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/self-improvement/SelfImprovementEngine.ts#L10)

## Constructors

### Constructor

> **new AdaptivePlanningEngine**(): `AdaptivePlanningEngine`

#### Returns

`AdaptivePlanningEngine`

## Methods

### getAll()

> **getAll**(): [`Strategy`](../interfaces/Strategy.md)[]

Defined in: [packages/cognitive/autonomous-cognition/src/domain/self-improvement/SelfImprovementEngine.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/self-improvement/SelfImprovementEngine.ts#L27)

#### Returns

[`Strategy`](../interfaces/Strategy.md)[]

---

### getStrategy()

> **getStrategy**(`strategyId`): [`Strategy`](../interfaces/Strategy.md) \| `undefined`

Defined in: [packages/cognitive/autonomous-cognition/src/domain/self-improvement/SelfImprovementEngine.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/self-improvement/SelfImprovementEngine.ts#L17)

#### Parameters

##### strategyId

`string`

#### Returns

[`Strategy`](../interfaces/Strategy.md) \| `undefined`

---

### registerStrategy()

> **registerStrategy**(`strategy`): `void`

Defined in: [packages/cognitive/autonomous-cognition/src/domain/self-improvement/SelfImprovementEngine.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/self-improvement/SelfImprovementEngine.ts#L13)

#### Parameters

##### strategy

[`Strategy`](../interfaces/Strategy.md)

#### Returns

`void`

---

### selectBest()

> **selectBest**(`_goalId`, `availableStrategies`): `string`

Defined in: [packages/cognitive/autonomous-cognition/src/domain/self-improvement/SelfImprovementEngine.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/autonomous-cognition/src/domain/self-improvement/SelfImprovementEngine.ts#L21)

#### Parameters

##### \_goalId

`string`

##### availableStrategies

`string`[]

#### Returns

`string`
