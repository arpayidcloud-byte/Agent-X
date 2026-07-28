[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / DecompositionInput

# Interface: DecompositionInput

Defined in: [packages/shared/core-runtime/src/interfaces/decomposer.ts:19](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/decomposer.ts#L19)

Input provided to the decomposer for breaking a goal into subtasks.

## Example

```ts
const input: DecompositionInput = {
  goalId: 'goal-001',
  title: 'Build REST API',
  description: 'Create a RESTful API for user management',
  context: { framework: 'express', database: 'postgres' },
};
```

## Properties

### context

> `readonly` **context**: `Record`\<`string`, `unknown`>>>>\>

Defined in: [packages/shared/core-runtime/src/interfaces/decomposer.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/decomposer.ts#L27)

Additional context variables for the decomposition

---

### description

> `readonly` **description**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/decomposer.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/decomposer.ts#L25)

Detailed description of the goal

---

### goalId

> `readonly` **goalId**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/decomposer.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/decomposer.ts#L21)

Unique identifier of the goal to decompose

---

### title

> `readonly` **title**: `string`

Defined in: [packages/shared/core-runtime/src/interfaces/decomposer.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/decomposer.ts#L23)

Short title of the goal
