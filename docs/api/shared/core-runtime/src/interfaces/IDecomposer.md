[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/core-runtime/src](../README.md) / IDecomposer

# Interface: IDecomposer

Defined in: [packages/shared/core-runtime/src/interfaces/decomposer.ts:79](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/decomposer.ts#L79)

Decomposer interface for breaking high-level goals into actionable subtasks.

## Example

```ts
const decomposer: IDecomposer = new LLMDecomposer();
const result = await decomposer.decompose({
  goalId: 'goal-001',
  title: 'Build REST API',
  description: 'Create a RESTful API for user management',
  context: {},
});
console.log(result.subtasks.length); // e.g. 5
```

## Methods

### decompose()

> **decompose**(`input`): `Promise`\<[`DecompositionOutput`](DecompositionOutput.md)>>>>\>

Defined in: [packages/shared/core-runtime/src/interfaces/decomposer.ts:86](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/core-runtime/src/interfaces/decomposer.ts#L86)

Decompose a high-level goal into a set of subtasks.

#### Parameters

##### input

[`DecompositionInput`](DecompositionInput.md)

The decomposition input containing goal details and context

#### Returns

`Promise`\<[`DecompositionOutput`](DecompositionOutput.md)\>

The decomposition output with generated subtasks
