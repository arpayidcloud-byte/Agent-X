[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-collaboration](../README.md) / CollaborationHook

# Interface: CollaborationHook

Defined in: [packages/agent/multi-agent-collaboration/src/interfaces.ts:128](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/interfaces.ts#L128)

## Properties

### afterCollaboration?

> `optional` **afterCollaboration?**: (`sessionId`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-collaboration/src/interfaces.ts:130](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/interfaces.ts#L130)

#### Parameters

##### sessionId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### afterConsensus?

> `optional` **afterConsensus?**: (`proposalId`, `approved`) => `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-collaboration/src/interfaces.ts:134](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/interfaces.ts#L134)

#### Parameters

##### proposalId

`string`

##### approved

`boolean`

#### Returns

`Promise`\<`void`\>

---

### afterDelegation?

> `optional` **afterDelegation?**: (`taskId`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-collaboration/src/interfaces.ts:132](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/interfaces.ts#L132)

#### Parameters

##### taskId

`string`

##### result

`unknown`

#### Returns

`Promise`\<`void`\>

---

### afterRecovery?

> `optional` **afterRecovery?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-collaboration/src/interfaces.ts:136](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/interfaces.ts#L136)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeCollaboration?

> `optional` **beforeCollaboration?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-collaboration/src/interfaces.ts:129](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/interfaces.ts#L129)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeConsensus?

> `optional` **beforeConsensus?**: (`proposalId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-collaboration/src/interfaces.ts:133](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/interfaces.ts#L133)

#### Parameters

##### proposalId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeDelegation?

> `optional` **beforeDelegation?**: (`taskId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-collaboration/src/interfaces.ts:131](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/interfaces.ts#L131)

#### Parameters

##### taskId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeRecovery?

> `optional` **beforeRecovery?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-collaboration/src/interfaces.ts:135](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/interfaces.ts#L135)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>
