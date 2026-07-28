[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [goal-intelligence](../README.md) / ObjectiveTree

# Class: ObjectiveTree

Defined in: [packages/planning/goal-intelligence/src/objective-tree.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/objective-tree.ts#L8)

## Constructors

### Constructor

> **new ObjectiveTree**(): `ObjectiveTree`

#### Returns

`ObjectiveTree`

## Methods

### addNode()

> **addNode**(`node`): `void`

Defined in: [packages/planning/goal-intelligence/src/objective-tree.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/objective-tree.ts#L11)

#### Parameters

##### node

[`ObjectiveNode`](../interfaces/ObjectiveNode.md)

#### Returns

`void`

---

### getAll()

> **getAll**(): [`ObjectiveNode`](../interfaces/ObjectiveNode.md)[]

Defined in: [packages/planning/goal-intelligence/src/objective-tree.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/objective-tree.ts#L25)

#### Returns

[`ObjectiveNode`](../interfaces/ObjectiveNode.md)[]

---

### getChildren()

> **getChildren**(`id`): [`ObjectiveNode`](../interfaces/ObjectiveNode.md)[]

Defined in: [packages/planning/goal-intelligence/src/objective-tree.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/objective-tree.ts#L19)

#### Parameters

##### id

`string`

#### Returns

[`ObjectiveNode`](../interfaces/ObjectiveNode.md)[]

---

### getNode()

> **getNode**(`id`): [`ObjectiveNode`](../interfaces/ObjectiveNode.md) \| `undefined`

Defined in: [packages/planning/goal-intelligence/src/objective-tree.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/planning/goal-intelligence/src/objective-tree.ts#L15)

#### Parameters

##### id

`string`

#### Returns

[`ObjectiveNode`](../interfaces/ObjectiveNode.md) \| `undefined`
