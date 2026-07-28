[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / GracefulShutdown

# Class: GracefulShutdown

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:188](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L188)

## Constructors

### Constructor

> **new GracefulShutdown**(): `GracefulShutdown`

#### Returns

`GracefulShutdown`

## Methods

### getCallbackCount()

> **getCallbackCount**(): `number`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:199](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L199)

#### Returns

`number`

---

### register()

> **register**(`callback`): `void`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:191](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L191)

#### Parameters

##### callback

() => `void`

#### Returns

`void`

---

### shutdown()

> **shutdown**(): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:195](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L195)

#### Returns

`Promise`\<`void`\>
