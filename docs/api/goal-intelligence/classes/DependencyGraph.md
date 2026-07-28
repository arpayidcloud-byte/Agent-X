[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [goal-intelligence](../README.md) / DependencyGraph

# Class: DependencyGraph

Defined in: [packages/planning/goal-intelligence/src/dependency-graph.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/dependency-graph.ts#L8)

## Constructors

### Constructor

> **new DependencyGraph**(): `DependencyGraph`

#### Returns

`DependencyGraph`

## Methods

### addEdge()

> **addEdge**(`source`, `target`, `weight?`): `void`

Defined in: [packages/planning/goal-intelligence/src/dependency-graph.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/dependency-graph.ts#L11)

#### Parameters

##### source

`string`

##### target

`string`

##### weight?

`number` = `1`

#### Returns

`void`

---

### detectCycle()

> **detectCycle**(): `boolean`

Defined in: [packages/planning/goal-intelligence/src/dependency-graph.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/dependency-graph.ts#L19)

#### Returns

`boolean`

---

### getEdges()

> **getEdges**(): [`DependencyEdge`](../interfaces/DependencyEdge.md)[]

Defined in: [packages/planning/goal-intelligence/src/dependency-graph.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/dependency-graph.ts#L15)

#### Returns

[`DependencyEdge`](../interfaces/DependencyEdge.md)[]
