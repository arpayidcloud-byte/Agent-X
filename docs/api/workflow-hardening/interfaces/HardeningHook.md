[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [workflow-hardening](../README.md) / HardeningHook

# Interface: HardeningHook

Defined in: [packages/workflow/workflow-hardening/src/interfaces.ts:104](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/interfaces.ts#L104)

## Properties

### afterCertification?

> `optional` **afterCertification?**: (`workflowId`, `cert`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-hardening/src/interfaces.ts:108](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/interfaces.ts#L108)

#### Parameters

##### workflowId

`string`

##### cert

[`WorkflowCertificate`](WorkflowCertificate.md)

#### Returns

`Promise`\<`void`\>

---

### afterCompensation?

> `optional` **afterCompensation?**: (`workflowId`, `success`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-hardening/src/interfaces.ts:110](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/interfaces.ts#L110)

#### Parameters

##### workflowId

`string`

##### success

`boolean`

#### Returns

`Promise`\<`void`\>

---

### afterReplay?

> `optional` **afterReplay?**: (`sessionId`, `result`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-hardening/src/interfaces.ts:106](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/interfaces.ts#L106)

#### Parameters

##### sessionId

`string`

##### result

[`ReplayResult`](ReplayResult.md)

#### Returns

`Promise`\<`void`\>

---

### afterRollback?

> `optional` **afterRollback?**: (`workflowId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-hardening/src/interfaces.ts:112](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/interfaces.ts#L112)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`void`\>

---

### afterSnapshotDiff?

> `optional` **afterSnapshotDiff?**: (`diffId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-hardening/src/interfaces.ts:114](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/interfaces.ts#L114)

#### Parameters

##### diffId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeCertification?

> `optional` **beforeCertification?**: (`workflowId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-hardening/src/interfaces.ts:107](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/interfaces.ts#L107)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeCompensation?

> `optional` **beforeCompensation?**: (`workflowId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-hardening/src/interfaces.ts:109](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/interfaces.ts#L109)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeReplay?

> `optional` **beforeReplay?**: (`sessionId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-hardening/src/interfaces.ts:105](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/interfaces.ts#L105)

#### Parameters

##### sessionId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeRollback?

> `optional` **beforeRollback?**: (`workflowId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-hardening/src/interfaces.ts:111](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/interfaces.ts#L111)

#### Parameters

##### workflowId

`string`

#### Returns

`Promise`\<`void`\>

---

### beforeSnapshotDiff?

> `optional` **beforeSnapshotDiff?**: (`diffId`) => `Promise`\<`void`>>>>\>

Defined in: [packages/workflow/workflow-hardening/src/interfaces.ts:113](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/workflow/workflow-hardening/src/interfaces.ts#L113)

#### Parameters

##### diffId

`string`

#### Returns

`Promise`\<`void`\>
