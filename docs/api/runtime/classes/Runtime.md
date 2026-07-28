[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / Runtime

# Class: Runtime

Defined in: [packages/runtime/runtime/src/runtime.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime.ts#L24)

## Constructors

### Constructor

> **new Runtime**(`eventBus`, `pipeline`, `options?`): `Runtime`

Defined in: [packages/runtime/runtime/src/runtime.ts:36](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime.ts#L36)

#### Parameters

##### eventBus

`IEventBus`

##### pipeline

[`IRuntimePipeline`](../interfaces/IRuntimePipeline.md)

##### options?

[`BootstrapOptions`](../interfaces/BootstrapOptions.md) = `{}`

#### Returns

`Runtime`

## Methods

### addHook()

> **addHook**(`hook`): `void`

Defined in: [packages/runtime/runtime/src/runtime.ts:157](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime.ts#L157)

#### Parameters

##### hook

[`RuntimeHook`](../interfaces/RuntimeHook.md)

#### Returns

`void`

---

### cancel()

> **cancel**(): `void`

Defined in: [packages/runtime/runtime/src/runtime.ts:134](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime.ts#L134)

#### Returns

`void`

---

### executeGoal()

> **executeGoal**(`sessionId`, `goal`, `_context?`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/runtime/runtime/src/runtime.ts:74](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime.ts#L74)

#### Parameters

##### sessionId

`string`

##### goal

`string`

##### \_context?

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

`Promise`\<`unknown`\>

---

### getAuditRecords()

> **getAuditRecords**(): [`BaseAuditRecord`](../interfaces/BaseAuditRecord.md)[]

Defined in: [packages/runtime/runtime/src/runtime.ts:149](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime.ts#L149)

#### Returns

[`BaseAuditRecord`](../interfaces/BaseAuditRecord.md)[]

---

### getCoordinator()

> **getCoordinator**(): [`ProductionExecutionCoordinator`](ProductionExecutionCoordinator.md)

Defined in: [packages/runtime/runtime/src/runtime.ts:165](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime.ts#L165)

#### Returns

[`ProductionExecutionCoordinator`](ProductionExecutionCoordinator.md)

---

### getHealthStatus()

> **getHealthStatus**(): [`HealthStatus`](../interfaces/HealthStatus.md)[]

Defined in: [packages/runtime/runtime/src/runtime.ts:145](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime.ts#L145)

#### Returns

[`HealthStatus`](../interfaces/HealthStatus.md)[]

---

### getMetrics()

> **getMetrics**(): [`RuntimeMetrics`](../interfaces/RuntimeMetrics.md)

Defined in: [packages/runtime/runtime/src/runtime.ts:141](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime.ts#L141)

#### Returns

[`RuntimeMetrics`](../interfaces/RuntimeMetrics.md)

---

### getSession()

> **getSession**(`sessionId`): [`RuntimeSession`](../interfaces/RuntimeSession.md) \| `undefined`

Defined in: [packages/runtime/runtime/src/runtime.ts:153](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime.ts#L153)

#### Parameters

##### sessionId

`string`

#### Returns

[`RuntimeSession`](../interfaces/RuntimeSession.md) \| `undefined`

---

### getState()

> **getState**(): `string`

Defined in: [packages/runtime/runtime/src/runtime.ts:161](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime.ts#L161)

#### Returns

`string`

---

### pause()

> **pause**(): `void`

Defined in: [packages/runtime/runtime/src/runtime.ts:120](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime.ts#L120)

#### Returns

`void`

---

### resume()

> **resume**(): `void`

Defined in: [packages/runtime/runtime/src/runtime.ts:127](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime.ts#L127)

#### Returns

`void`

---

### start()

> **start**(): `Promise`\<[`RuntimeSession`](../interfaces/RuntimeSession.md)>>>>\>

Defined in: [packages/runtime/runtime/src/runtime.ts:62](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/runtime.ts#L62)

#### Returns

`Promise`\<[`RuntimeSession`](../interfaces/RuntimeSession.md)\>
