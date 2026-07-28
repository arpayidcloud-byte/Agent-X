[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime-production](../README.md) / GracefulShutdownManager

# Class: GracefulShutdownManager

Defined in: [packages/runtime/runtime-production/src/graceful-shutdown-manager.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/graceful-shutdown-manager.ts#L10)

## Constructors

### Constructor

> **new GracefulShutdownManager**(): `GracefulShutdownManager`

#### Returns

`GracefulShutdownManager`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/runtime-production/src/graceful-shutdown-manager.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/graceful-shutdown-manager.ts#L41)

#### Returns

`void`

---

### initiateShutdown()

> **initiateShutdown**(`_reason`): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime-production/src/graceful-shutdown-manager.ts:18](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/graceful-shutdown-manager.ts#L18)

#### Parameters

##### \_reason

`string`

#### Returns

`Promise`\<`void`\>

---

### isShutdown()

> **isShutdown**(): `boolean`

Defined in: [packages/runtime/runtime-production/src/graceful-shutdown-manager.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/graceful-shutdown-manager.ts#L37)

#### Returns

`boolean`

---

### registerHook()

> **registerHook**(`hook`): `void`

Defined in: [packages/runtime/runtime-production/src/graceful-shutdown-manager.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime-production/src/graceful-shutdown-manager.ts#L14)

#### Parameters

##### hook

[`ShutdownHook`](../type-aliases/ShutdownHook.md)

#### Returns

`void`
