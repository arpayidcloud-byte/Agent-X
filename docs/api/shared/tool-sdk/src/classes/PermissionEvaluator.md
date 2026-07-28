[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / PermissionEvaluator

# Class: PermissionEvaluator

Defined in: [packages/shared/tool-sdk/src/permissions/index.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/permissions/index.ts#L51)

## Implements

- [`IPermissionEvaluator`](../interfaces/IPermissionEvaluator.md)

## Constructors

### Constructor

> **new PermissionEvaluator**(`resolver`): `PermissionEvaluator`

Defined in: [packages/shared/tool-sdk/src/permissions/index.ts:52](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/permissions/index.ts#L52)

#### Parameters

##### resolver

[`IPermissionResolver`](../interfaces/IPermissionResolver.md)

#### Returns

`PermissionEvaluator`

## Methods

### evaluate()

> **evaluate**(`req`, `tool`): `boolean`

Defined in: [packages/shared/tool-sdk/src/permissions/index.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/permissions/index.ts#L77)

#### Parameters

##### req

[`ToolExecutionRequest`](../interfaces/ToolExecutionRequest.md)

##### tool

[`ITool`](../interfaces/ITool.md)

#### Returns

`boolean`

#### Implementation of

[`IPermissionEvaluator`](../interfaces/IPermissionEvaluator.md).[`evaluate`](../interfaces/IPermissionEvaluator.md#evaluate)

---

### isAllowed()

> **isAllowed**(`agentRole`, `category`, `riskScore?`): `boolean`

Defined in: [packages/shared/tool-sdk/src/permissions/index.ts:54](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/permissions/index.ts#L54)

#### Parameters

##### agentRole

`string`

##### category

`string`

##### riskScore?

`number`

#### Returns

`boolean`

#### Implementation of

[`IPermissionEvaluator`](../interfaces/IPermissionEvaluator.md).[`isAllowed`](../interfaces/IPermissionEvaluator.md#isallowed)
