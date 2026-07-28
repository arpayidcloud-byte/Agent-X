[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / ExecutionReservationManager

# Class: ExecutionReservationManager

Defined in: [packages/runtime/runtime/src/coordinator/reservation.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/reservation.ts#L9)

## Constructors

### Constructor

> **new ExecutionReservationManager**(): `ExecutionReservationManager`

#### Returns

`ExecutionReservationManager`

## Methods

### allocate()

> **allocate**(`id`, `amount`): `void`

Defined in: [packages/runtime/runtime/src/coordinator/reservation.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/reservation.ts#L29)

#### Parameters

##### id

`string`

##### amount

`number`

#### Returns

`void`

---

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/runtime/src/coordinator/reservation.ts:60](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/reservation.ts#L60)

#### Returns

`void`

---

### getReservations()

> **getReservations**(): [`ExecutionReservation`](../interfaces/ExecutionReservation.md)[]

Defined in: [packages/runtime/runtime/src/coordinator/reservation.ts:47](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/reservation.ts#L47)

#### Returns

[`ExecutionReservation`](../interfaces/ExecutionReservation.md)[]

---

### release()

> **release**(`id`): `void`

Defined in: [packages/runtime/runtime/src/coordinator/reservation.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/reservation.ts#L43)

#### Parameters

##### id

`string`

#### Returns

`void`

---

### reserve()

> **reserve**(`type`, `capacity`, `durationMs`): [`ExecutionReservation`](../interfaces/ExecutionReservation.md)

Defined in: [packages/runtime/runtime/src/coordinator/reservation.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/reservation.ts#L12)

#### Parameters

##### type

`"memory"` \| `"worker"` \| `"token"` \| `"provider"` \| `"tool"` \| `"cost"`

##### capacity

`number`

##### durationMs

`number`

#### Returns

[`ExecutionReservation`](../interfaces/ExecutionReservation.md)
