[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / StructuredLogging

# Class: StructuredLogging

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:12](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L12)

## Constructors

### Constructor

> **new StructuredLogging**(): `StructuredLogging`

#### Returns

`StructuredLogging`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:35](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L35)

#### Returns

`void`

---

### getEntries()

> **getEntries**(`level?`): [`LogEntry`](../interfaces/LogEntry.md)[]

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:30](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L30)

#### Parameters

##### level?

`string`

#### Returns

[`LogEntry`](../interfaces/LogEntry.md)[]

---

### log()

> **log**(`level`, `message`, `metadata?`): [`LogEntry`](../interfaces/LogEntry.md)

Defined in: [packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts:15](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/runtime/enterprise-runtime/src/infrastructure/observability/Observability.ts#L15)

#### Parameters

##### level

`string`

##### message

`string`

##### metadata?

`Record`\<`string`, `unknown`\> = `{}`

#### Returns

[`LogEntry`](../interfaces/LogEntry.md)
