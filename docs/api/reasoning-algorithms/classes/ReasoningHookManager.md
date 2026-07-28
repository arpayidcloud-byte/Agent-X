[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-algorithms](../README.md) / ReasoningHookManager

# Class: ReasoningHookManager

Defined in: [packages/reasoning/reasoning-algorithms/src/hooks.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/hooks.ts#L14)

## Constructors

### Constructor

> **new ReasoningHookManager**(): `ReasoningHookManager`

#### Returns

`ReasoningHookManager`

## Methods

### register()

> **register**(`hooks`): `void`

Defined in: [packages/reasoning/reasoning-algorithms/src/hooks.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/hooks.ts#L17)

#### Parameters

##### hooks

[`ReasoningHooks`](../interfaces/ReasoningHooks.md)

#### Returns

`void`

---

### runAfterReasoning()

> **runAfterReasoning**(`sessionId`, `result`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-algorithms/src/hooks.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/hooks.ts#L27)

#### Parameters

##### sessionId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### runBeforeReasoning()

> **runBeforeReasoning**(`sessionId`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-algorithms/src/hooks.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/hooks.ts#L21)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### runOnConflict()

> **runOnConflict**(`rule1`, `rule2`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-algorithms/src/hooks.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/hooks.ts#L33)

#### Parameters

##### rule1

`string`

##### rule2

`string`

#### Returns

`Promise`\<`void`\>

---

### runOnRecover()

> **runOnRecover**(`sessionId`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-algorithms/src/hooks.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/hooks.ts#L45)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### runOnRollback()

> **runOnRollback**(`sessionId`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-algorithms/src/hooks.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/hooks.ts#L39)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>
