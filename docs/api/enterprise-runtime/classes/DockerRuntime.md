[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / DockerRuntime

# Class: DockerRuntime

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L11)

## Constructors

### Constructor

> **new DockerRuntime**(): `DockerRuntime`

#### Returns

`DockerRuntime`

## Methods

### create()

> **create**(`image`, `tag`, `ports`, `env`): [`ContainerConfig`](../interfaces/ContainerConfig.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L14)

#### Parameters

##### image

`string`

##### tag

`string`

##### ports

`number`[]

##### env

`Record`\<`string`, `string`\>

#### Returns

[`ContainerConfig`](../interfaces/ContainerConfig.md)

---

### get()

> **get**(`image`): [`ContainerConfig`](../interfaces/ContainerConfig.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L34)

#### Parameters

##### image

`string`

#### Returns

[`ContainerConfig`](../interfaces/ContainerConfig.md) \| `undefined`

---

### getAll()

> **getAll**(): [`ContainerConfig`](../interfaces/ContainerConfig.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/deployment/Deployment.ts#L38)

#### Returns

[`ContainerConfig`](../interfaces/ContainerConfig.md)[]
