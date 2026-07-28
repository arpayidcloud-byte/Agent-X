[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-kernel](../README.md) / KernelSupervisor

# Class: KernelSupervisor

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-supervisor.ts:6](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-supervisor.ts#L6)

## Constructors

### Constructor

> **new KernelSupervisor**(): `KernelSupervisor`

#### Returns

`KernelSupervisor`

## Methods

### checkHealth()

> **checkHealth**(): `Record`\<`string`, `boolean`>>>>\>

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-supervisor.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-supervisor.ts#L13)

#### Returns

`Record`\<`string`, `boolean`\>

---

### isSystemHealthy()

> **isSystemHealthy**(): `boolean`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-supervisor.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-supervisor.ts#L23)

#### Returns

`boolean`

---

### registerComponent()

> **registerComponent**(`name`, `checkFn`): `void`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-supervisor.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-supervisor.ts#L9)

#### Parameters

##### name

`string`

##### checkFn

() => `boolean`

#### Returns

`void`
