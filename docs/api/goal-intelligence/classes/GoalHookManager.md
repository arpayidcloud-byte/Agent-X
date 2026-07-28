[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [goal-intelligence](../README.md) / GoalHookManager

# Class: GoalHookManager

Defined in: [packages/planning/goal-intelligence/src/hooks.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/hooks.ts#L8)

## Constructors

### Constructor

> **new GoalHookManager**(): `GoalHookManager`

#### Returns

`GoalHookManager`

## Methods

### register()

> **register**(`hook`): `void`

Defined in: [packages/planning/goal-intelligence/src/hooks.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/hooks.ts#L11)

#### Parameters

##### hook

[`CognitiveHook`](../interfaces/CognitiveHook.md)

#### Returns

`void`

---

### runAfterConstraintValidation()

> **runAfterConstraintValidation**(`goalId`): `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/hooks.ts:57](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/hooks.ts#L57)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>

---

### runAfterCriticalPath()

> **runAfterCriticalPath**(`goalId`, `path`): `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/hooks.ts:93](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/hooks.ts#L93)

#### Parameters

##### goalId

`string`

##### path

`string`[]

#### Returns

`Promise`\<`void`\>

---

### runAfterDecision()

> **runAfterDecision**(`goalId`, `choice`): `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/hooks.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/hooks.ts#L33)

#### Parameters

##### goalId

`string`

##### choice

`string`

#### Returns

`Promise`\<`void`\>

---

### runAfterGoal()

> **runAfterGoal**(`goalId`, `result`): `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/hooks.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/hooks.ts#L21)

#### Parameters

##### goalId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### runAfterIntegrityValidation()

> **runAfterIntegrityValidation**(`goalId`): `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/hooks.ts:81](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/hooks.ts#L81)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>

---

### runAfterPlanning()

> **runAfterPlanning**(`goalId`, `planId`): `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/hooks.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/hooks.ts#L45)

#### Parameters

##### goalId

`string`

##### planId

`string`

#### Returns

`Promise`\<`void`\>

---

### runAfterPlanningScore()

> **runAfterPlanningScore**(`goalId`, `score`): `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/hooks.ts:69](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/hooks.ts#L69)

#### Parameters

##### goalId

`string`

##### score

`number`

#### Returns

`Promise`\<`void`\>

---

### runBeforeConstraintValidation()

> **runBeforeConstraintValidation**(`goalId`): `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/hooks.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/hooks.ts#L51)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeCriticalPath()

> **runBeforeCriticalPath**(`goalId`): `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/hooks.ts:87](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/hooks.ts#L87)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeDecision()

> **runBeforeDecision**(`goalId`): `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/hooks.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/hooks.ts#L27)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeGoal()

> **runBeforeGoal**(`goalId`): `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/hooks.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/hooks.ts#L15)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforeIntegrityValidation()

> **runBeforeIntegrityValidation**(`goalId`): `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/hooks.ts:75](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/hooks.ts#L75)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforePlanning()

> **runBeforePlanning**(`goalId`): `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/hooks.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/hooks.ts#L39)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>

---

### runBeforePlanningScore()

> **runBeforePlanningScore**(`goalId`): `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/hooks.ts:63](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/hooks.ts#L63)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>
