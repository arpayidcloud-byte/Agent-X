[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-algorithms](../README.md) / ReasoningHooks

# Interface: ReasoningHooks

Defined in: [packages/reasoning/reasoning-algorithms/src/hooks.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/hooks.ts#L6)

## Properties

### afterReasoning?

> `optional` **afterReasoning?**: (`sessionId`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-algorithms/src/hooks.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/hooks.ts#L8)

#### Parameters

##### sessionId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### beforeReasoning?

> `optional` **beforeReasoning?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-algorithms/src/hooks.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/hooks.ts#L7)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### onConflict?

> `optional` **onConflict?**: (`rule1`, `rule2`) => `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-algorithms/src/hooks.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/hooks.ts#L9)

#### Parameters

##### rule1

`string`

##### rule2

`string`

#### Returns

`Promise`\<`void`\>

---

### onRecover?

> `optional` **onRecover?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-algorithms/src/hooks.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/hooks.ts#L11)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### onRollback?

> `optional` **onRollback?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-algorithms/src/hooks.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/hooks.ts#L10)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>
