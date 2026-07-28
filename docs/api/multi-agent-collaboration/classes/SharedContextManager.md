[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-collaboration](../README.md) / SharedContextManager

# Class: SharedContextManager

Defined in: [packages/agent/multi-agent-collaboration/src/shared-context-manager.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/shared-context-manager.ts#L9)

## Constructors

### Constructor

> **new SharedContextManager**(): `SharedContextManager`

#### Returns

`SharedContextManager`

## Methods

### create()

> **create**(`sessionId`, `data`): [`SharedContext`](../interfaces/SharedContext.md)

Defined in: [packages/agent/multi-agent-collaboration/src/shared-context-manager.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/shared-context-manager.ts#L12)

#### Parameters

##### sessionId

`string`

##### data

`Record`\<`string`, `unknown`\>

#### Returns

[`SharedContext`](../interfaces/SharedContext.md)

---

### get()

> **get**(`sessionId`): [`SharedContext`](../interfaces/SharedContext.md) \| `undefined`

Defined in: [packages/agent/multi-agent-collaboration/src/shared-context-manager.ts:34](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/shared-context-manager.ts#L34)

#### Parameters

##### sessionId

`string`

#### Returns

[`SharedContext`](../interfaces/SharedContext.md) \| `undefined`

---

### update()

> **update**(`sessionId`, `data`): [`SharedContext`](../interfaces/SharedContext.md)

Defined in: [packages/agent/multi-agent-collaboration/src/shared-context-manager.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-collaboration/src/shared-context-manager.ts#L24)

#### Parameters

##### sessionId

`string`

##### data

`Record`\<`string`, `unknown`\>

#### Returns

[`SharedContext`](../interfaces/SharedContext.md)
