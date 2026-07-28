[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-collaboration](../README.md) / AgentDirectory

# Class: AgentDirectory

Defined in: [packages/agent/multi-agent-collaboration/src/agent-directory.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/agent-directory.ts#L8)

## Constructors

### Constructor

> **new AgentDirectory**(): `AgentDirectory`

#### Returns

`AgentDirectory`

## Methods

### allocate()

> **allocate**(`agentId`): `boolean`

Defined in: [packages/agent/multi-agent-collaboration/src/agent-directory.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/agent-directory.ts#L25)

#### Parameters

##### agentId

`string`

#### Returns

`boolean`

---

### discover()

> **discover**(`requiredCapabilities`): [`CapabilityMatch`](../interfaces/CapabilityMatch.md)

Defined in: [packages/agent/multi-agent-collaboration/src/agent-directory.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/agent-directory.ts#L37)

#### Parameters

##### requiredCapabilities

`string`[]

#### Returns

[`CapabilityMatch`](../interfaces/CapabilityMatch.md)

---

### getAllCapabilities()

> **getAllCapabilities**(): `string`[]

Defined in: [packages/agent/multi-agent-collaboration/src/agent-directory.ts:56](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/agent-directory.ts#L56)

#### Returns

`string`[]

---

### register()

> **register**(`agentId`, `capabilities`, `priority`, `slots`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/agent-directory.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/agent-directory.ts#L11)

#### Parameters

##### agentId

`string`

##### capabilities

`string`[]

##### priority

`number`

##### slots

`number`

#### Returns

`void`

---

### release()

> **release**(`agentId`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/agent-directory.ts:32](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/agent-directory.ts#L32)

#### Parameters

##### agentId

`string`

#### Returns

`void`

---

### unregister()

> **unregister**(`agentId`): `void`

Defined in: [packages/agent/multi-agent-collaboration/src/agent-directory.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/agent-directory.ts#L21)

#### Parameters

##### agentId

`string`

#### Returns

`void`
