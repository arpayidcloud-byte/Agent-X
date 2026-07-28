[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / KubernetesRuntime

# Class: KubernetesRuntime

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L51)

## Constructors

### Constructor

> **new KubernetesRuntime**(): `KubernetesRuntime`

#### Returns

`KubernetesRuntime`

## Methods

### deploy()

> **deploy**(`name`, `replicas`, `image`): [`KubernetesDeployment`](../interfaces/KubernetesDeployment.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:54](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L54)

#### Parameters

##### name

`string`

##### replicas

`number`

##### image

`string`

#### Returns

[`KubernetesDeployment`](../interfaces/KubernetesDeployment.md)

---

### get()

> **get**(`deploymentId`): [`KubernetesDeployment`](../interfaces/KubernetesDeployment.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:78](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L78)

#### Parameters

##### deploymentId

`string`

#### Returns

[`KubernetesDeployment`](../interfaces/KubernetesDeployment.md) \| `undefined`

---

### getAll()

> **getAll**(): [`KubernetesDeployment`](../interfaces/KubernetesDeployment.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:82](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L82)

#### Returns

[`KubernetesDeployment`](../interfaces/KubernetesDeployment.md)[]

---

### scale()

> **scale**(`deploymentId`, `replicas`): [`KubernetesDeployment`](../interfaces/KubernetesDeployment.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:70](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L70)

#### Parameters

##### deploymentId

`string`

##### replicas

`number`

#### Returns

[`KubernetesDeployment`](../interfaces/KubernetesDeployment.md)
