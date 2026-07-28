[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-hardening](../README.md) / ReplayValidator

# Class: ReplayValidator

Defined in: [packages/workflow/workflow-hardening/src/replay-validator.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/replay-validator.ts#L10)

## Constructors

### Constructor

> **new ReplayValidator**(): `ReplayValidator`

#### Returns

`ReplayValidator`

## Methods

### compareResults()

> **compareResults**(`a`, `b`): `boolean`

Defined in: [packages/workflow/workflow-hardening/src/replay-validator.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/replay-validator.ts#L36)

#### Parameters

##### a

[`ReplayResult`](../interfaces/ReplayResult.md)

##### b

[`ReplayResult`](../interfaces/ReplayResult.md)

#### Returns

`boolean`

---

### validateDeterminism()

> **validateDeterminism**(`results`): `void`

Defined in: [packages/workflow/workflow-hardening/src/replay-validator.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/replay-validator.ts#L11)

#### Parameters

##### results

[`ReplayResult`](../interfaces/ReplayResult.md)[]

#### Returns

`void`

---

### validateReplayIntegrity()

> **validateReplayIntegrity**(`result`): `void`

Defined in: [packages/workflow/workflow-hardening/src/replay-validator.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/replay-validator.ts#L30)

#### Parameters

##### result

[`ReplayResult`](../interfaces/ReplayResult.md)

#### Returns

`void`
