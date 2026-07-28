[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / BackpressureController

# Class: BackpressureController

Defined in: [packages/runtime/runtime-production/src/backpressure-controller.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/backpressure-controller.ts#L9)

## Constructors

### Constructor

> **new BackpressureController**(`config`): `BackpressureController`

Defined in: [packages/runtime/runtime-production/src/backpressure-controller.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/backpressure-controller.ts#L12)

#### Parameters

##### config

[`BackpressureConfig`](../interfaces/BackpressureConfig.md)

#### Returns

`BackpressureController`

## Methods

### checkLimits()

> **checkLimits**(`current`): `void`

Defined in: [packages/runtime/runtime-production/src/backpressure-controller.ts:16](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/backpressure-controller.ts#L16)

#### Parameters

##### current

###### cost

`number`

###### cpu

`number`

###### memory

`number`

###### queueLength

`number`

###### tokens

`number`

#### Returns

`void`

---

### getConfig()

> **getConfig**(): [`BackpressureConfig`](../interfaces/BackpressureConfig.md)

Defined in: [packages/runtime/runtime-production/src/backpressure-controller.ts:40](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/backpressure-controller.ts#L40)

#### Returns

[`BackpressureConfig`](../interfaces/BackpressureConfig.md)
