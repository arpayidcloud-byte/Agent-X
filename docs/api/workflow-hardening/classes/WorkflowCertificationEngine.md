[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-hardening](../README.md) / WorkflowCertificationEngine

# Class: WorkflowCertificationEngine

Defined in: [packages/workflow/workflow-hardening/src/certification-engine.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/certification-engine.ts#L9)

## Constructors

### Constructor

> **new WorkflowCertificationEngine**(): `WorkflowCertificationEngine`

#### Returns

`WorkflowCertificationEngine`

## Methods

### certify()

> **certify**(`workflowId`, `state`, `version`): `Promise`\<[`WorkflowCertificate`](../interfaces/WorkflowCertificate.md)>>>>\>

Defined in: [packages/workflow/workflow-hardening/src/certification-engine.ts:10](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/certification-engine.ts#L10)

#### Parameters

##### workflowId

`string`

##### state

[`WorkflowState`](../interfaces/WorkflowState.md)

##### version

`string`

#### Returns

`Promise`\<[`WorkflowCertificate`](../interfaces/WorkflowCertificate.md)\>
