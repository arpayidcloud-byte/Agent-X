[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / APIGateway

# Class: APIGateway

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L11)

## Constructors

### Constructor

> **new APIGateway**(): `APIGateway`

#### Returns

`APIGateway`

## Methods

### addRoute()

> **addRoute**(`path`, `method`, `target`): [`GatewayRoute`](../interfaces/GatewayRoute.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L14)

#### Parameters

##### path

`string`

##### method

`string`

##### target

`string`

#### Returns

[`GatewayRoute`](../interfaces/GatewayRoute.md)

---

### getAll()

> **getAll**(): [`GatewayRoute`](../interfaces/GatewayRoute.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L39)

#### Returns

[`GatewayRoute`](../interfaces/GatewayRoute.md)[]

---

### getRoute()

> **getRoute**(`routeId`): [`GatewayRoute`](../interfaces/GatewayRoute.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L28)

#### Parameters

##### routeId

`string`

#### Returns

[`GatewayRoute`](../interfaces/GatewayRoute.md) \| `undefined`

---

### matchRoute()

> **matchRoute**(`path`, `method`): [`GatewayRoute`](../interfaces/GatewayRoute.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L32)

#### Parameters

##### path

`string`

##### method

`string`

#### Returns

[`GatewayRoute`](../interfaces/GatewayRoute.md) \| `undefined`

---

### removeRoute()

> **removeRoute**(`routeId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/networking/Networking.ts#L24)

#### Parameters

##### routeId

`string`

#### Returns

`boolean`
