[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / RuntimePolicyEngine

# Class: RuntimePolicyEngine

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L11)

## Constructors

### Constructor

> **new RuntimePolicyEngine**(): `RuntimePolicyEngine`

#### Returns

`RuntimePolicyEngine`

## Methods

### addRule()

> **addRule**(`name`, `action`, `effect`): [`PolicyRule`](../interfaces/PolicyRule.md)

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:14](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L14)

#### Parameters

##### name

`string`

##### action

`string`

##### effect

`"ALLOW"` \| `"DENY"`

#### Returns

[`PolicyRule`](../interfaces/PolicyRule.md)

---

### delete()

> **delete**(`ruleId`): `boolean`

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L37)

#### Parameters

##### ruleId

`string`

#### Returns

`boolean`

---

### evaluate()

> **evaluate**(`action`): `"ALLOW"` \| `"DENY"`

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L24)

#### Parameters

##### action

`string`

#### Returns

`"ALLOW"` \| `"DENY"`

---

### get()

> **get**(`ruleId`): [`PolicyRule`](../interfaces/PolicyRule.md) \| `undefined`

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L33)

#### Parameters

##### ruleId

`string`

#### Returns

[`PolicyRule`](../interfaces/PolicyRule.md) \| `undefined`

---

### getAll()

> **getAll**(): [`PolicyRule`](../interfaces/PolicyRule.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/domain/security/SecurityEngine.ts#L41)

#### Returns

[`PolicyRule`](../interfaces/PolicyRule.md)[]
