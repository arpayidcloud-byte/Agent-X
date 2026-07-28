[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-kernel](../README.md) / CognitiveKernel

# Class: CognitiveKernel

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:76](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L76)

## Constructors

### Constructor

> **new CognitiveKernel**(`_config`, `learningEngine?`, `goalIntake?`, `goalAnalyzer?`, `goalDecomposer?`): `CognitiveKernel`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:101](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L101)

#### Parameters

##### \_config

[`KernelConfig`](../interfaces/KernelConfig.md)

##### learningEngine?

`LearningEngine`

##### goalIntake?

`GoalIntakeEngine`

##### goalAnalyzer?

`GoalAnalyzer`

##### goalDecomposer?

`GoalDecomposer`

#### Returns

`CognitiveKernel`

## Properties

### audit

> **audit**: [`KernelAuditManager`](KernelAuditManager.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:87](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L87)

---

### budget

> **budget**: [`KernelBudgetManager`](KernelBudgetManager.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:84](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L84)

---

### checkpoint

> **checkpoint**: [`KernelCheckpointManager`](KernelCheckpointManager.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:83](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L83)

---

### dispatcher

> **dispatcher**: [`KernelDispatcher`](KernelDispatcher.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:80](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L80)

---

### events

> **events**: [`KernelEventBus`](KernelEventBus.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:91](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L91)

---

### factory

> **factory**: [`KernelFactory`](KernelFactory.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:82](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L82)

---

### health

> **health**: [`KernelHealthMonitor`](KernelHealthMonitor.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:89](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L89)

---

### hooks

> **hooks**: [`KernelHookManager`](KernelHookManager.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:90](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L90)

---

### lifecycle

> **lifecycle**: [`KernelLifecycle`](KernelLifecycle.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L77)

---

### metrics

> **metrics**: [`KernelMetricsCollector`](KernelMetricsCollector.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:86](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L86)

---

### recovery

> **recovery**: [`KernelRecoveryManager`](KernelRecoveryManager.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:88](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L88)

---

### registry

> **registry**: [`KernelRegistry`](KernelRegistry.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:81](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L81)

---

### scheduler

> **scheduler**: [`KernelScheduler`](KernelScheduler.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:79](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L79)

---

### supervisor

> **supervisor**: [`KernelSupervisor`](KernelSupervisor.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:78](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L78)

---

### trace

> **trace**: [`KernelTraceManager`](KernelTraceManager.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:85](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L85)

## Methods

### analyzeGoal()

> **analyzeGoal**(`goalId`): `GoalAnalysis`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:287](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L287)

#### Parameters

##### goalId

`string`

#### Returns

`GoalAnalysis`

---

### createGoal()

> **createGoal**(`title`, `description`, `priority`, `metadata?`): `Goal`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:258](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L258)

#### Parameters

##### title

`string`

##### description

`string`

##### priority

`number`

##### metadata?

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

`Goal`

---

### decomposeGoal()

> **decomposeGoal**(`goalId`, `subGoalTitles`): `GoalDecomposition`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:305](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L305)

#### Parameters

##### goalId

`string`

##### subGoalTitles

`string`[]

#### Returns

`GoalDecomposition`

---

### executeThinking()

> **executeThinking**(`sessionMeta`, `input`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:125](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L125)

#### Parameters

##### sessionMeta

[`SessionMetadata`](../interfaces/SessionMetadata.md)

##### input

`unknown`

#### Returns

`Promise`\<`unknown`\>

---

### getAllGoals()

> **getAllGoals**(): `object`[]

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:335](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L335)

#### Returns

`object`[]

---

### getGoalProgress()

> **getGoalProgress**(`goalId`): `object`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:318](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L318)

#### Parameters

##### goalId

`string`

#### Returns

`object`

##### createdAt

> **createdAt**: `Date` = `goal.createdAt`

##### goalId

> **goalId**: `string` = `goal.goalId`

##### priority

> **priority**: `number` = `goal.priority`

##### state

> **state**: `string` = `goal.state`

##### title

> **title**: `string` = `goal.title`

---

### getObservability()

> **getObservability**(): [`KernelObservability`](KernelObservability.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:254](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L254)

#### Returns

[`KernelObservability`](KernelObservability.md)

---

### getReflectionHistory()

> **getReflectionHistory**(`_sessionId`): `Record`\<`string`, `unknown`>>>>\>[]

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:402](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L402)

#### Parameters

##### \_sessionId

`string`

#### Returns

`Record`\<`string`, `unknown`\>[]

---

### getStatistics()

> **getStatistics**(): `Record`\<`string`, `number`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:250](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L250)

#### Returns

`Record`\<`string`, `number`\>

---

### recoverSession()

> **recoverSession**(`sessionId`): `Promise`\<`Record`\<`string`, `unknown`>>>>>>>>\>\>

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:236](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L236)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

---

### reflectOnSession()

> **reflectOnSession**(`sessionId`): `Promise`\<`Record`\<`string`, `unknown`>>>>>>>>\>\>

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:358](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L358)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

---

### start()

> **start**(): `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:119](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L119)

#### Returns

`Promise`\<`void`\>

---

### transitionGoal()

> **transitionGoal**(`goalId`, `newState`): `Goal`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel.ts:273](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel.ts#L273)

#### Parameters

##### goalId

`string`

##### newState

`string`

#### Returns

`Goal`
