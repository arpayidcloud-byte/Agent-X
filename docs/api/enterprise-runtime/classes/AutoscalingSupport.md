[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / AutoscalingSupport

# Class: AutoscalingSupport

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:136](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L136)

## Constructors

### Constructor

> **new AutoscalingSupport**(): `AutoscalingSupport`

#### Returns

`AutoscalingSupport`

## Methods

### getAll()

> **getAll**(): [`AutoscalingPolicy`](../interfaces/AutoscalingPolicy.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:159](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L159)

#### Returns

[`AutoscalingPolicy`](../interfaces/AutoscalingPolicy.md)[]

---

### getPolicy()

> **getPolicy**(`policyId`): [`AutoscalingPolicy`](../interfaces/AutoscalingPolicy.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:155](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L155)

#### Parameters

##### policyId

`string`

#### Returns

[`AutoscalingPolicy`](../interfaces/AutoscalingPolicy.md) \| `undefined`

---

### setPolicy()

> **setPolicy**(`minReplicas`, `maxReplicas`, `targetCpuPercent`): [`AutoscalingPolicy`](../interfaces/AutoscalingPolicy.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:139](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L139)

#### Parameters

##### minReplicas

`number`

##### maxReplicas

`number`

##### targetCpuPercent

`number`

#### Returns

[`AutoscalingPolicy`](../interfaces/AutoscalingPolicy.md)
