[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / InternalServiceBus

# Class: InternalServiceBus

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:136](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L136)

## Constructors

### Constructor

> **new InternalServiceBus**(): `InternalServiceBus`

#### Returns

`InternalServiceBus`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:168](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L168)

#### Returns

`void`

---

### getLog()

> **getLog**(): [`BusMessage`](../interfaces/BusMessage.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:164](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L164)

#### Returns

[`BusMessage`](../interfaces/BusMessage.md)[]

---

### publish()

> **publish**(`type`, `payload`): [`BusMessage`](../interfaces/BusMessage.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:140](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L140)

#### Parameters

##### type

`string`

##### payload

`Record`\<`string`, `unknown`\>

#### Returns

[`BusMessage`](../interfaces/BusMessage.md)

---

### subscribe()

> **subscribe**(`type`, `handler`): `void`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:158](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L158)

#### Parameters

##### type

`string`

##### handler

(`msg`) => `void`

#### Returns

`void`
