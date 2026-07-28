[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / ExecutionDispatcher

# Class: ExecutionDispatcher

Defined in: [packages/runtime/runtime/src/coordinator/dispatcher.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/dispatcher.ts#L13)

## Constructors

### Constructor

> **new ExecutionDispatcher**(): `ExecutionDispatcher`

#### Returns

`ExecutionDispatcher`

## Methods

### dispatch()

> **dispatch**(`ticket`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/runtime/runtime/src/coordinator/dispatcher.ts:20](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/dispatcher.ts#L20)

#### Parameters

##### ticket

[`ExecutionTicket`](../interfaces/ExecutionTicket.md)

#### Returns

`Promise`\<`unknown`\>

---

### registerEngine()

> **registerEngine**(`phase`, `engine`): `void`

Defined in: [packages/runtime/runtime/src/coordinator/dispatcher.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/dispatcher.ts#L16)

#### Parameters

##### phase

[`ExecutionPhase`](../type-aliases/ExecutionPhase.md)

##### engine

[`IEngine`](../interfaces/IEngine.md)

#### Returns

`void`
