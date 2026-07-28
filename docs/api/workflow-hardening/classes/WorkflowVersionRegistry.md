[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-hardening](../README.md) / WorkflowVersionRegistry

# Class: WorkflowVersionRegistry

Defined in: [packages/workflow/workflow-hardening/src/version-registry.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/version-registry.ts#L10)

## Constructors

### Constructor

> **new WorkflowVersionRegistry**(): `WorkflowVersionRegistry`

#### Returns

`WorkflowVersionRegistry`

## Methods

### freeze()

> **freeze**(`id`, `version`): `void`

Defined in: [packages/workflow/workflow-hardening/src/version-registry.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/version-registry.ts#L26)

#### Parameters

##### id

`string`

##### version

`string`

#### Returns

`void`

---

### get()

> **get**(`id`, `version`): [`WorkflowVersion`](../interfaces/WorkflowVersion.md) \| `undefined`

Defined in: [packages/workflow/workflow-hardening/src/version-registry.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/version-registry.ts#L30)

#### Parameters

##### id

`string`

##### version

`string`

#### Returns

[`WorkflowVersion`](../interfaces/WorkflowVersion.md) \| `undefined`

---

### history()

> **history**(): [`WorkflowVersion`](../interfaces/WorkflowVersion.md)[]

Defined in: [packages/workflow/workflow-hardening/src/version-registry.ts:45](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/version-registry.ts#L45)

#### Returns

[`WorkflowVersion`](../interfaces/WorkflowVersion.md)[]

---

### register()

> **register**(`id`, `version`, `type?`): [`WorkflowVersion`](../interfaces/WorkflowVersion.md)

Defined in: [packages/workflow/workflow-hardening/src/version-registry.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/version-registry.ts#L14)

#### Parameters

##### id

`string`

##### version

`string`

##### type?

`"major"` \| `"minor"` \| `"patch"` \| `"lts"` \| `"experimental"`

#### Returns

[`WorkflowVersion`](../interfaces/WorkflowVersion.md)

---

### rollback()

> **rollback**(`id`, `version`): `boolean`

Defined in: [packages/workflow/workflow-hardening/src/version-registry.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/version-registry.ts#L34)

#### Parameters

##### id

`string`

##### version

`string`

#### Returns

`boolean`
