[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / InteractivePlayground

# Class: InteractivePlayground

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:77](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L77)

## Constructors

### Constructor

> **new InteractivePlayground**(): `InteractivePlayground`

#### Returns

`InteractivePlayground`

## Methods

### createSession()

> **createSession**(`language`, `code`): [`PlaygroundSession`](../interfaces/PlaygroundSession.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:80](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L80)

#### Parameters

##### language

`string`

##### code

`string`

#### Returns

[`PlaygroundSession`](../interfaces/PlaygroundSession.md)

---

### getAll()

> **getAll**(): [`PlaygroundSession`](../interfaces/PlaygroundSession.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:100](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L100)

#### Returns

[`PlaygroundSession`](../interfaces/PlaygroundSession.md)[]

---

### getSession()

> **getSession**(`sessionId`): [`PlaygroundSession`](../interfaces/PlaygroundSession.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/infrastructure/platform/Platform.ts:96](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/platform/Platform.ts#L96)

#### Parameters

##### sessionId

`string`

#### Returns

[`PlaygroundSession`](../interfaces/PlaygroundSession.md) \| `undefined`
