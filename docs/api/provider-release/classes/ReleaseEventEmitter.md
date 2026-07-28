[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [provider-release](../README.md) / ReleaseEventEmitter

# Class: ReleaseEventEmitter

Defined in: [packages/provider/provider-release/src/compatibility-events.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-events.ts#L12)

## Constructors

### Constructor

> **new ReleaseEventEmitter**(): `ReleaseEventEmitter`

#### Returns

`ReleaseEventEmitter`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/provider/provider-release/src/compatibility-events.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-events.ts#L27)

#### Returns

`void`

---

### emit()

> **emit**(`type`, `payload?`): `void`

Defined in: [packages/provider/provider-release/src/compatibility-events.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-events.ts#L15)

#### Parameters

##### type

`string`

##### payload?

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

`void`

---

### getEvents()

> **getEvents**(): [`ReleaseEvent`](../interfaces/ReleaseEvent.md)[]

Defined in: [packages/provider/provider-release/src/compatibility-events.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-release/src/compatibility-events.ts#L23)

#### Returns

[`ReleaseEvent`](../interfaces/ReleaseEvent.md)[]
