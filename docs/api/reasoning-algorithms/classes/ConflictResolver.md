[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [reasoning-algorithms](../README.md) / ConflictResolver

# Class: ConflictResolver

Defined in: [packages/reasoning/reasoning-algorithms/src/conflict-resolver.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/conflict-resolver.ts#L8)

## Constructors

### Constructor

> **new ConflictResolver**(): `ConflictResolver`

#### Returns

`ConflictResolver`

## Methods

### resolve()

> **resolve**(`conflicts`, `strategy`): [`Rule`](../interfaces/Rule.md) \| `undefined`

Defined in: [packages/reasoning/reasoning-algorithms/src/conflict-resolver.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/reasoning/reasoning-algorithms/src/conflict-resolver.ts#L9)

#### Parameters

##### conflicts

[`Rule`](../interfaces/Rule.md)[]

##### strategy

`"priority"` \| `"weight"` \| `"latest"`

#### Returns

[`Rule`](../interfaces/Rule.md) \| `undefined`
