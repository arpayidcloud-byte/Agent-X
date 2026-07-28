[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [goal-intelligence](../README.md) / CognitiveHook

# Interface: CognitiveHook

Defined in: [packages/planning/goal-intelligence/src/interfaces.ts:96](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/interfaces.ts#L96)

## Properties

### afterConstraintValidation?

> `optional` **afterConstraintValidation?**: (`goalId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/interfaces.ts:104](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/interfaces.ts#L104)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>

---

### afterCriticalPath?

> `optional` **afterCriticalPath?**: (`goalId`, `path`) => `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/interfaces.ts:110](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/interfaces.ts#L110)

#### Parameters

##### goalId

`string`

##### path

`string`[]

#### Returns

`Promise`\<`void`\>

---

### afterDecision?

> `optional` **afterDecision?**: (`goalId`, `choice`) => `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/interfaces.ts:100](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/interfaces.ts#L100)

#### Parameters

##### goalId

`string`

##### choice

`string`

#### Returns

`Promise`\<`void`\>

---

### afterGoal?

> `optional` **afterGoal?**: (`goalId`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/interfaces.ts:98](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/interfaces.ts#L98)

#### Parameters

##### goalId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### afterIntegrityValidation?

> `optional` **afterIntegrityValidation?**: (`goalId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/interfaces.ts:108](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/interfaces.ts#L108)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>

---

### afterPlanning?

> `optional` **afterPlanning?**: (`goalId`, `planId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/interfaces.ts:102](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/interfaces.ts#L102)

#### Parameters

##### goalId

`string`

##### planId

`string`

#### Returns

`Promise`\<`void`\>

---

### afterPlanningScore?

> `optional` **afterPlanningScore?**: (`goalId`, `score`) => `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/interfaces.ts:106](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/interfaces.ts#L106)

#### Parameters

##### goalId

`string`

##### score

`number`

#### Returns

`Promise`\<`void`\>

---

### beforeConstraintValidation?

> `optional` **beforeConstraintValidation?**: (`goalId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/interfaces.ts:103](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/interfaces.ts#L103)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeCriticalPath?

> `optional` **beforeCriticalPath?**: (`goalId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/interfaces.ts:109](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/interfaces.ts#L109)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeDecision?

> `optional` **beforeDecision?**: (`goalId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/interfaces.ts:99](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/interfaces.ts#L99)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeGoal?

> `optional` **beforeGoal?**: (`goalId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/interfaces.ts:97](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/interfaces.ts#L97)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeIntegrityValidation?

> `optional` **beforeIntegrityValidation?**: (`goalId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/interfaces.ts:107](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/interfaces.ts#L107)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforePlanning?

> `optional` **beforePlanning?**: (`goalId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/interfaces.ts:101](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/interfaces.ts#L101)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforePlanningScore?

> `optional` **beforePlanningScore?**: (`goalId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/planning/goal-intelligence/src/interfaces.ts:105](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/interfaces.ts#L105)

#### Parameters

##### goalId

`string`

#### Returns

`Promise`\<`void`\>
