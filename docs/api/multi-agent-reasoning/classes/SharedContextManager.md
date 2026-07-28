[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [multi-agent-reasoning](../README.md) / SharedContextManager

# Class: SharedContextManager

Defined in: [packages/agent/multi-agent-reasoning/src/domain/context/SharedContextManager.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/context/SharedContextManager.ts#L9)

## Constructors

### Constructor

> **new SharedContextManager**(): `SharedContextManager`

#### Returns

`SharedContextManager`

## Methods

### createContext()

> **createContext**(`sessionId`, `data`): [`SharedContext`](../interfaces/SharedContext.md)

Defined in: [packages/agent/multi-agent-reasoning/src/domain/context/SharedContextManager.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/context/SharedContextManager.ts#L12)

#### Parameters

##### sessionId

`string`

##### data

`Record`\<`string`, `unknown`\>

#### Returns

[`SharedContext`](../interfaces/SharedContext.md)

---

### getContext()

> **getContext**(`sessionId`): [`SharedContext`](../interfaces/SharedContext.md) \| `undefined`

Defined in: [packages/agent/multi-agent-reasoning/src/domain/context/SharedContextManager.ts:37](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/context/SharedContextManager.ts#L37)

#### Parameters

##### sessionId

`string`

#### Returns

[`SharedContext`](../interfaces/SharedContext.md) \| `undefined`

---

### updateContext()

> **updateContext**(`sessionId`, `data`): [`SharedContext`](../interfaces/SharedContext.md)

Defined in: [packages/agent/multi-agent-reasoning/src/domain/context/SharedContextManager.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/agent/multi-agent-reasoning/src/domain/context/SharedContextManager.ts#L24)

#### Parameters

##### sessionId

`string`

##### data

`Record`\<`string`, `unknown`\>

#### Returns

[`SharedContext`](../interfaces/SharedContext.md)
