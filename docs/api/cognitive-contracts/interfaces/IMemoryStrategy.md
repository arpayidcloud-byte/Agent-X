[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-contracts](../README.md) / IMemoryStrategy

# Interface: IMemoryStrategy

Defined in: [packages/cognitive/cognitive-contracts/src/contracts.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/contracts.ts#L48)

## Methods

### retrieve()

> **retrieve**(`query`, `strategy`): `Promise`\<`unknown`[]\>

Defined in: [packages/cognitive/cognitive-contracts/src/contracts.ts:49](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/contracts.ts#L49)

#### Parameters

##### query

`string`

##### strategy

[`MemoryRetrievalStrategy`](MemoryRetrievalStrategy.md)

#### Returns

`Promise`\<`unknown`[]\>

---

### update()

> **update**(`key`, `value`, `strategy`): `Promise`\<`void`>>>>\>

Defined in: [packages/cognitive/cognitive-contracts/src/contracts.ts:50](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-contracts/src/contracts.ts#L50)

#### Parameters

##### key

`string`

##### value

`unknown`

##### strategy

[`MemoryUpdateStrategy`](MemoryUpdateStrategy.md)

#### Returns

`Promise`\<`void`\>
