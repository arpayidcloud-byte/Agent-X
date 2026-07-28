[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/tool-sdk/src](../README.md) / ShellSandbox

# Class: ShellSandbox

Defined in: [packages/shared/tool-sdk/src/shell/shell-sandbox.ts:31](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/shell/shell-sandbox.ts#L31)

## Constructors

### Constructor

> **new ShellSandbox**(`config?`): `ShellSandbox`

Defined in: [packages/shared/tool-sdk/src/shell/shell-sandbox.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/shell/shell-sandbox.ts#L34)

#### Parameters

##### config?

`Partial`\<[`ShellSandboxConfig`](../interfaces/ShellSandboxConfig.md)\>

#### Returns

`ShellSandbox`

## Methods

### assertAllowed()

> **assertAllowed**(`command`): `void`

Defined in: [packages/shared/tool-sdk/src/shell/shell-sandbox.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/shell/shell-sandbox.ts#L77)

#### Parameters

##### command

`string`

#### Returns

`void`

---

### getConfig()

> **getConfig**(): `Readonly`\<[`ShellSandboxConfig`](../interfaces/ShellSandboxConfig.md)>>>>\>

Defined in: [packages/shared/tool-sdk/src/shell/shell-sandbox.ts:84](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/shell/shell-sandbox.ts#L84)

#### Returns

`Readonly`\<[`ShellSandboxConfig`](../interfaces/ShellSandboxConfig.md)\>

---

### validate()

> **validate**(`command`): `object`

Defined in: [packages/shared/tool-sdk/src/shell/shell-sandbox.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/tool-sdk/src/shell/shell-sandbox.ts#L43)

#### Parameters

##### command

`string`

#### Returns

`object`

##### allowed

> **allowed**: `boolean`

##### reason?

> `optional` **reason?**: `string`
