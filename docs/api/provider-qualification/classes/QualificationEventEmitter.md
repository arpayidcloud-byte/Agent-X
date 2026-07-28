[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [provider-qualification](../README.md) / QualificationEventEmitter

# Class: QualificationEventEmitter

Defined in: [packages/provider/provider-qualification/src/qualification-events.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-events.ts#L12)

## Constructors

### Constructor

> **new QualificationEventEmitter**(): `QualificationEventEmitter`

#### Returns

`QualificationEventEmitter`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/provider/provider-qualification/src/qualification-events.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-events.ts#L27)

#### Returns

`void`

---

### emit()

> **emit**(`type`, `payload?`): `void`

Defined in: [packages/provider/provider-qualification/src/qualification-events.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-events.ts#L15)

#### Parameters

##### type

`string`

##### payload?

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

`void`

---

### getEvents()

> **getEvents**(): [`QualificationEvent`](../interfaces/QualificationEvent.md)[]

Defined in: [packages/provider/provider-qualification/src/qualification-events.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-events.ts#L23)

#### Returns

[`QualificationEvent`](../interfaces/QualificationEvent.md)[]
