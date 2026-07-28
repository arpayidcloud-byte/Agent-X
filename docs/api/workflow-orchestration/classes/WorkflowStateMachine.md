[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-orchestration](../README.md) / WorkflowStateMachine

# Class: WorkflowStateMachine

Defined in: [packages/workflow/workflow-orchestration/src/workflow-state.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-state.ts#L26)

## Constructors

### Constructor

> **new WorkflowStateMachine**(): `WorkflowStateMachine`

#### Returns

`WorkflowStateMachine`

## Methods

### canTransition()

> **canTransition**(`next`): `boolean`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-state.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-state.ts#L43)

#### Parameters

##### next

[`WorkflowState`](../type-aliases/WorkflowState.md)

#### Returns

`boolean`

---

### getState()

> **getState**(): [`WorkflowState`](../type-aliases/WorkflowState.md)

Defined in: [packages/workflow/workflow-orchestration/src/workflow-state.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-state.ts#L29)

#### Returns

[`WorkflowState`](../type-aliases/WorkflowState.md)

---

### transition()

> **transition**(`next`): `void`

Defined in: [packages/workflow/workflow-orchestration/src/workflow-state.ts:33](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-orchestration/src/workflow-state.ts#L33)

#### Parameters

##### next

[`WorkflowState`](../type-aliases/WorkflowState.md)

#### Returns

`void`
