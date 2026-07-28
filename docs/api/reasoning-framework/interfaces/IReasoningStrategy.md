[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-framework](../README.md) / IReasoningStrategy

# Interface: IReasoningStrategy

Defined in: [packages/reasoning/reasoning-framework/src/interfaces.ts:88](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/interfaces.ts#L88)

## Methods

### checkpoint()

> **checkpoint**(`sessionId`, `snapshot`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/interfaces.ts:93](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/interfaces.ts#L93)

#### Parameters

##### sessionId

`string`

##### snapshot

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`void`\>

---

### cleanup()

> **cleanup**(): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/interfaces.ts:95](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/interfaces.ts#L95)

#### Returns

`Promise`\<`void`\>

---

### execute()

> **execute**(`graph`): `Promise`\<[`ReasoningGraph`](ReasoningGraph.md)>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/interfaces.ts:91](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/interfaces.ts#L91)

#### Parameters

##### graph

[`ReasoningGraph`](ReasoningGraph.md)

#### Returns

`Promise`\<[`ReasoningGraph`](ReasoningGraph.md)\>

---

### initialize()

> **initialize**(`context`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/interfaces.ts:89](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/interfaces.ts#L89)

#### Parameters

##### context

[`ReasoningContext`](ReasoningContext.md)

#### Returns

`Promise`\<`void`\>

---

### prepare()

> **prepare**(`graph`): `Promise`\<`void`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/interfaces.ts:90](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/interfaces.ts#L90)

#### Parameters

##### graph

[`ReasoningGraph`](ReasoningGraph.md)

#### Returns

`Promise`\<`void`\>

---

### recover()

> **recover**(`sessionId`): `Promise`\<`Record`\<`string`, `unknown`>>>>>>>>\>\>

Defined in: [packages/reasoning/reasoning-framework/src/interfaces.ts:94](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/interfaces.ts#L94)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

---

### validate()

> **validate**(`graph`): `Promise`\<`boolean`>>>>\>

Defined in: [packages/reasoning/reasoning-framework/src/interfaces.ts:92](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-framework/src/interfaces.ts#L92)

#### Parameters

##### graph

[`ReasoningGraph`](ReasoningGraph.md)

#### Returns

`Promise`\<`boolean`\>
