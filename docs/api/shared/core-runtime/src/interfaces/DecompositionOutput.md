[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / DecompositionOutput

# Interface: DecompositionOutput

Defined in: [packages/shared/core-runtime/src/interfaces/decomposer.ts:48](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/decomposer.ts#L48)

Output produced by the decomposer containing generated subtasks.

## Example

```ts
const output: DecompositionOutput = {
  subtasks: [
    {
      id: 'sub-1',
      title: 'Define schema',
      description: 'Create database schema',
      dependencies: [],
      estimatedComplexity: 'low',
    },
  ],
};
```

## Properties

### subtasks

> `readonly` **subtasks**: `object`[]

Defined in: [packages/shared/core-runtime/src/interfaces/decomposer.ts:50](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/decomposer.ts#L50)

List of subtasks produced by the decomposition

#### dependencies

> **dependencies**: `string`[]

IDs of subtasks that must complete before this one

#### description

> **description**: `string`

Detailed description of the subtask

#### estimatedComplexity

> **estimatedComplexity**: `"low"` \| `"medium"` \| `"high"`

Estimated complexity level

#### id

> **id**: `string`

Unique identifier for the subtask

#### title

> **title**: `string`

Short title of the subtask
