[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [provider-qualification](../README.md) / QualificationEngine

# Class: QualificationEngine

Defined in: [packages/provider/provider-qualification/src/qualification-engine.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-engine.ts#L23)

## Constructors

### Constructor

> **new QualificationEngine**(): `QualificationEngine`

#### Returns

`QualificationEngine`

## Properties

### audit

> **audit**: [`QualificationAuditLogger`](QualificationAuditLogger.md)

Defined in: [packages/provider/provider-qualification/src/qualification-engine.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-engine.ts#L25)

---

### events

> **events**: [`QualificationEventEmitter`](QualificationEventEmitter.md)

Defined in: [packages/provider/provider-qualification/src/qualification-engine.ts:26](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-engine.ts#L26)

---

### metrics

> **metrics**: [`QualificationMetricsCollector`](QualificationMetricsCollector.md)

Defined in: [packages/provider/provider-qualification/src/qualification-engine.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-engine.ts#L24)

---

### registry

> **registry**: [`QualificationRegistry`](QualificationRegistry.md)

Defined in: [packages/provider/provider-qualification/src/qualification-engine.ts:28](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-engine.ts#L28)

---

### snapshotManager

> **snapshotManager**: [`SnapshotManager`](SnapshotManager.md)

Defined in: [packages/provider/provider-qualification/src/qualification-engine.ts:27](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-engine.ts#L27)

## Methods

### qualify()

> **qualify**(`provider`, `requiredMethods`): `Promise`\<[`CertificationReport`](../interfaces/CertificationReport.md)>>>>\>

Defined in: [packages/provider/provider-qualification/src/qualification-engine.ts:38](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-qualification/src/qualification-engine.ts#L38)

#### Parameters

##### provider

`IProvider`

##### requiredMethods

`string`[]

#### Returns

`Promise`\<[`CertificationReport`](../interfaces/CertificationReport.md)\>
