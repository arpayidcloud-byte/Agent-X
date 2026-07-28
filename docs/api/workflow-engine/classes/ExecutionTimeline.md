[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-engine](../README.md) / ExecutionTimeline

# Class: ExecutionTimeline

Defined in: [packages/workflow/workflow-engine/src/timeline.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/timeline.ts#L9)

## Constructors

### Constructor

> **new ExecutionTimeline**(): `ExecutionTimeline`

#### Returns

`ExecutionTimeline`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/workflow/workflow-engine/src/timeline.ts:51](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/timeline.ts#L51)

#### Returns

`void`

---

### finishNode()

> **finishNode**(`nodeId`, `status`, `retries?`): `void`

Defined in: [packages/workflow/workflow-engine/src/timeline.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/timeline.ts#L25)

#### Parameters

##### nodeId

`string`

##### status

`"COMPLETED"` \| `"FAILED"` \| `"SKIPPED"`

##### retries?

`number` = `0`

#### Returns

`void`

---

### getDuration()

> **getDuration**(): `number`

Defined in: [packages/workflow/workflow-engine/src/timeline.ts:43](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/timeline.ts#L43)

#### Returns

`number`

---

### getTimeline()

> **getTimeline**(): [`ExecutionTimelineEntry`](../interfaces/ExecutionTimelineEntry.md)[]

Defined in: [packages/workflow/workflow-engine/src/timeline.ts:39](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/timeline.ts#L39)

#### Returns

[`ExecutionTimelineEntry`](../interfaces/ExecutionTimelineEntry.md)[]

---

### startNode()

> **startNode**(`node`): `void`

Defined in: [packages/workflow/workflow-engine/src/timeline.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-engine/src/timeline.ts#L12)

#### Parameters

##### node

[`WorkflowNode`](../interfaces/WorkflowNode.md)

#### Returns

`void`
