[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / RemoteDeployment

# Class: RemoteDeployment

Defined in: [packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts#L77)

## Constructors

### Constructor

> **new RemoteDeployment**(): `RemoteDeployment`

#### Returns

`RemoteDeployment`

## Methods

### deploy()

> **deploy**(`target`, `version`): [`DeploymentEntry`](../interfaces/DeploymentEntry.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts:80](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts#L80)

#### Parameters

##### target

`string`

##### version

`string`

#### Returns

[`DeploymentEntry`](../interfaces/DeploymentEntry.md)

---

### get()

> **get**(`deploymentId`): [`DeploymentEntry`](../interfaces/DeploymentEntry.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts:96](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts#L96)

#### Parameters

##### deploymentId

`string`

#### Returns

[`DeploymentEntry`](../interfaces/DeploymentEntry.md) \| `undefined`

---

### getAll()

> **getAll**(): [`DeploymentEntry`](../interfaces/DeploymentEntry.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts:100](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/controlplane/ControlPlane.ts#L100)

#### Returns

[`DeploymentEntry`](../interfaces/DeploymentEntry.md)[]
