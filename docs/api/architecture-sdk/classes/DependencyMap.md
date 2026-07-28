[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [architecture-sdk](../README.md) / DependencyMap

# Class: DependencyMap

Defined in: [packages/quality/architecture-sdk/src/dependency-map.ts:8](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/architecture-sdk/src/dependency-map.ts#L8)

## Constructors

### Constructor

> **new DependencyMap**(): `DependencyMap`

#### Returns

`DependencyMap`

## Methods

### addDependency()

> **addDependency**(`source`, `target`, `type?`): `void`

Defined in: [packages/quality/architecture-sdk/src/dependency-map.ts:11](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/architecture-sdk/src/dependency-map.ts#L11)

#### Parameters

##### source

`string`

##### target

`string`

##### type?

`"required"` \| `"optional"` \| `"peer"` \| `"dev"`

#### Returns

`void`

---

### getDependencies()

> **getDependencies**(): [`DependencyNode`](../interfaces/DependencyNode.md)[]

Defined in: [packages/quality/architecture-sdk/src/dependency-map.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/architecture-sdk/src/dependency-map.ts#L19)

#### Returns

[`DependencyNode`](../interfaces/DependencyNode.md)[]

---

### validate()

> **validate**(): `boolean`

Defined in: [packages/quality/architecture-sdk/src/dependency-map.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/quality/architecture-sdk/src/dependency-map.ts#L23)

#### Returns

`boolean`
