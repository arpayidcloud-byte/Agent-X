[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-reasoning](../README.md) / CollaborationHook

# Interface: CollaborationHook

Defined in: [packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts:90](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts#L90)

## Properties

### afterCollaboration?

> `optional` **afterCollaboration?**: (`sessionId`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts:92](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts#L92)

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

Defined in: [packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts:96](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts#L96)

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

Defined in: [packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts:94](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts#L94)

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

Defined in: [packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts:98](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts#L98)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeCollaboration?

> `optional` **beforeCollaboration?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts:91](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts#L91)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeConsensus?

> `optional` **beforeConsensus?**: (`proposalId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts:95](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts#L95)

#### Parameters

##### proposalId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeDelegation?

> `optional` **beforeDelegation?**: (`taskId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts:93](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts#L93)

#### Parameters

##### taskId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeRecovery?

> `optional` **beforeRecovery?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts:97](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/collaboration/interfaces.ts#L97)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>
