[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / WebSocketGateway

# Class: WebSocketGateway

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:68](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L68)

## Constructors

### Constructor

> **new WebSocketGateway**(): `WebSocketGateway`

#### Returns

`WebSocketGateway`

## Methods

### getChannels()

> **getChannels**(): `string`[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:85](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L85)

#### Returns

`string`[]

---

### getClients()

> **getClients**(`channel`): `string`[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:81](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L81)

#### Parameters

##### channel

`string`

#### Returns

`string`[]

---

### subscribe()

> **subscribe**(`channel`, `clientId`): `void`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:71](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L71)

#### Parameters

##### channel

`string`

##### clientId

`string`

#### Returns

`void`

---

### unsubscribe()

> **unsubscribe**(`channel`, `clientId`): `void`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L77)

#### Parameters

##### channel

`string`

##### clientId

`string`

#### Returns

`void`
