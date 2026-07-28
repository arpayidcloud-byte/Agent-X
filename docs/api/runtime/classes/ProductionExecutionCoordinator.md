[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [runtime](../README.md) / ProductionExecutionCoordinator

# Class: ProductionExecutionCoordinator

Defined in: [packages/runtime/runtime/src/coordinator/coordinator.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator.ts#L25)

## Constructors

### Constructor

> **new ProductionExecutionCoordinator**(`eventBus`, `config`): `ProductionExecutionCoordinator`

Defined in: [packages/runtime/runtime/src/coordinator/coordinator.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator.ts#L38)

#### Parameters

##### eventBus

`IEventBus`

##### config

[`CoordinatorConfig`](../interfaces/CoordinatorConfig.md)

#### Returns

`ProductionExecutionCoordinator`

## Methods

### execute()

> **execute**(`session`): `Promise`\<`unknown`>>>>\>

Defined in: [packages/runtime/runtime/src/coordinator/coordinator.ts:65](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator.ts#L65)

#### Parameters

##### session

[`CoordinatorSession`](../interfaces/CoordinatorSession.md)

#### Returns

`Promise`\<`unknown`\>

---

### getAuditLogger()

> **getAuditLogger**(): [`CoordinatorAuditLogger`](CoordinatorAuditLogger.md)

Defined in: [packages/runtime/runtime/src/coordinator/coordinator.ts:137](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator.ts#L137)

#### Returns

[`CoordinatorAuditLogger`](CoordinatorAuditLogger.md)

---

### getConcurrencyController()

> **getConcurrencyController**(): [`ConcurrencyController`](ConcurrencyController.md)

Defined in: [packages/runtime/runtime/src/coordinator/coordinator.ts:157](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator.ts#L157)

#### Returns

[`ConcurrencyController`](ConcurrencyController.md)

---

### getDispatcher()

> **getDispatcher**(): [`ExecutionDispatcher`](ExecutionDispatcher.md)

Defined in: [packages/runtime/runtime/src/coordinator/coordinator.ts:149](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator.ts#L149)

#### Returns

[`ExecutionDispatcher`](ExecutionDispatcher.md)

---

### getHookManager()

> **getHookManager**(): [`CoordinatorHookManager`](CoordinatorHookManager.md)

Defined in: [packages/runtime/runtime/src/coordinator/coordinator.ts:141](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator.ts#L141)

#### Returns

[`CoordinatorHookManager`](CoordinatorHookManager.md)

---

### getMetrics()

> **getMetrics**(): [`ExecutionCoordinatorMetrics`](../interfaces/ExecutionCoordinatorMetrics.md)

Defined in: [packages/runtime/runtime/src/coordinator/coordinator.ts:133](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator.ts#L133)

#### Returns

[`ExecutionCoordinatorMetrics`](../interfaces/ExecutionCoordinatorMetrics.md)

---

### getRegistry()

> **getRegistry**(): [`CoordinatorRegistry`](CoordinatorRegistry.md)

Defined in: [packages/runtime/runtime/src/coordinator/coordinator.ts:161](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator.ts#L161)

#### Returns

[`CoordinatorRegistry`](CoordinatorRegistry.md)

---

### getReservationManager()

> **getReservationManager**(): [`ExecutionReservationManager`](ExecutionReservationManager.md)

Defined in: [packages/runtime/runtime/src/coordinator/coordinator.ts:153](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator.ts#L153)

#### Returns

[`ExecutionReservationManager`](ExecutionReservationManager.md)

---

### getScheduler()

> **getScheduler**(): [`ExecutionScheduler`](ExecutionScheduler.md)

Defined in: [packages/runtime/runtime/src/coordinator/coordinator.ts:145](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator.ts#L145)

#### Returns

[`ExecutionScheduler`](ExecutionScheduler.md)

---

### getState()

> **getState**(): [`ExecutionCoordinatorState`](../type-aliases/ExecutionCoordinatorState.md)

Defined in: [packages/runtime/runtime/src/coordinator/coordinator.ts:129](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator.ts#L129)

#### Returns

[`ExecutionCoordinatorState`](../type-aliases/ExecutionCoordinatorState.md)

---

### getStatistics()

> **getStatistics**(): [`CoordinatorStatistics`](../interfaces/CoordinatorStatistics.md)

Defined in: [packages/runtime/runtime/src/coordinator/coordinator.ts:165](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator.ts#L165)

#### Returns

[`CoordinatorStatistics`](../interfaces/CoordinatorStatistics.md)

---

### shutdown()

> **shutdown**(): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/coordinator/coordinator.ts:60](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator.ts#L60)

#### Returns

`Promise`\<`void`\>

---

### start()

> **start**(): `Promise`\<`void`>>>>\>

Defined in: [packages/runtime/runtime/src/coordinator/coordinator.ts:54](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/runtime/src/coordinator/coordinator.ts#L54)

#### Returns

`Promise`\<`void`\>
