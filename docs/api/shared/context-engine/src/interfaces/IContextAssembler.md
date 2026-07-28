[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/context-engine/src](../README.md) / IContextAssembler

# Interface: IContextAssembler

Defined in: [packages/shared/context-engine/src/interfaces.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/interfaces.ts#L41)

## Methods

### assemble()

> **assemble**(`contextId`): `Promise`\<`Record`\<`string`, `unknown`>>>>>>>>\>\>

Defined in: [packages/shared/context-engine/src/interfaces.ts:42](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/interfaces.ts#L42)

#### Parameters

##### contextId

`string`

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

---

### assemblePrompt()

> **assemblePrompt**(`contextId`, `template`): `Promise`\<`string`>>>>\>

Defined in: [packages/shared/context-engine/src/interfaces.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/context-engine/src/interfaces.ts#L43)

#### Parameters

##### contextId

`string`

##### template

`string`

#### Returns

`Promise`\<`string`\>
