[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/shared/src](../README.md) / ISpan

# Interface: ISpan

Defined in: [packages/shared/shared/src/telemetry/interfaces.ts:3](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/telemetry/interfaces.ts#L3)

## Properties

### spanId

> **spanId**: `string`

Defined in: [packages/shared/shared/src/telemetry/interfaces.ts:5](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/telemetry/interfaces.ts#L5)

---

### traceId

> **traceId**: `string`

Defined in: [packages/shared/shared/src/telemetry/interfaces.ts:4](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/telemetry/interfaces.ts#L4)

## Methods

### addEvent()

> **addEvent**(`name`, `attributes?`): `this`

Defined in: [packages/shared/shared/src/telemetry/interfaces.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/telemetry/interfaces.ts#L8)

#### Parameters

##### name

`string`

##### attributes?

`Record`\<`string`, `string` \| `number` \| `boolean`\>

#### Returns

`this`

---

### end()

> **end**(): `void`

Defined in: [packages/shared/shared/src/telemetry/interfaces.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/telemetry/interfaces.ts#L6)

#### Returns

`void`

---

### recordException()

> **recordException**(`error`): `this`

Defined in: [packages/shared/shared/src/telemetry/interfaces.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/telemetry/interfaces.ts#L9)

#### Parameters

##### error

`Error`

#### Returns

`this`

---

### setAttribute()

> **setAttribute**(`key`, `value`): `this`

Defined in: [packages/shared/shared/src/telemetry/interfaces.ts:7](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/shared/src/telemetry/interfaces.ts#L7)

#### Parameters

##### key

`string`

##### value

`string` \| `number` \| `boolean`

#### Returns

`this`
