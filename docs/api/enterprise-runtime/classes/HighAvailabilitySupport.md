[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / HighAvailabilitySupport

# Class: HighAvailabilitySupport

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:171](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L171)

## Constructors

### Constructor

> **new HighAvailabilitySupport**(): `HighAvailabilitySupport`

#### Returns

`HighAvailabilitySupport`

## Methods

### configure()

> **configure**(`enabled`, `replicas`): [`HAConfig`](../interfaces/HAConfig.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:174](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L174)

#### Parameters

##### enabled

`boolean`

##### replicas

`number`

#### Returns

[`HAConfig`](../interfaces/HAConfig.md)

---

### getConfig()

> **getConfig**(): [`HAConfig`](../interfaces/HAConfig.md) \| `null`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:183](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L183)

#### Returns

[`HAConfig`](../interfaces/HAConfig.md) \| `null`
