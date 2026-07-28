[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / ExtensionManager

# Class: ExtensionManager

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:135](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L135)

## Constructors

### Constructor

> **new ExtensionManager**(): `ExtensionManager`

#### Returns

`ExtensionManager`

## Methods

### get()

> **get**(`name`): `Record`\<`string`, `unknown`> > > > \> \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:146](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L146)

#### Parameters

##### name

`string`

#### Returns

`Record`\<`string`, `unknown`\> \| `undefined`

---

### getAll()

> **getAll**(): `Record`\<`string`, `Record`\<`string`, `unknown`>>>>>>>>\>\>

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:151](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L151)

#### Returns

`Record`\<`string`, `Record`\<`string`, `unknown`\>\>

---

### register()

> **register**(`name`, `config`): `void`

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:138](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L138)

#### Parameters

##### name

`string`

##### config

`Record`\<`string`, `unknown`\>

#### Returns

`void`

---

### unregister()

> **unregister**(`name`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts:142](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/service/ServiceManager.ts#L142)

#### Parameters

##### name

`string`

#### Returns

`boolean`
