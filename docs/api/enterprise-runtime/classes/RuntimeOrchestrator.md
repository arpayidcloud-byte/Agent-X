[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / RuntimeOrchestrator

# Class: RuntimeOrchestrator

Defined in: [packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts#L13)

## Constructors

### Constructor

> **new RuntimeOrchestrator**(`_lifecycle`, `_state`, `_supervisor`, `_health`, `_services`, `_plugins`, `_config`, `_tenants`, `_policy`): `RuntimeOrchestrator`

Defined in: [packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts#L14)

#### Parameters

##### \_lifecycle

[`RuntimeLifecycleManager`](RuntimeLifecycleManager.md)

##### \_state

[`RuntimeStateManager`](RuntimeStateManager.md)

##### \_supervisor

[`RuntimeSupervisor`](RuntimeSupervisor.md)

##### \_health

[`RuntimeHealthManager`](RuntimeHealthManager.md)

##### \_services

[`ServiceRegistry`](ServiceRegistry.md)

##### \_plugins

[`PluginManager`](PluginManager.md)

##### \_config

[`ConfigurationManager`](ConfigurationManager.md)

##### \_tenants

[`MultiTenantManager`](MultiTenantManager.md)

##### \_policy

[`RuntimePolicyEngine`](RuntimePolicyEngine.md)

#### Returns

`RuntimeOrchestrator`

## Methods

### getStatus()

> **getStatus**(): `string`

Defined in: [packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts#L30)

#### Returns

`string`

---

### shutdown()

> **shutdown**(): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts#L28)

#### Returns

`Promise`\<`void`\>

---

### startup()

> **startup**(): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/application/coordinator/Coordinators.ts#L26)

#### Returns

`Promise`\<`void`\>
