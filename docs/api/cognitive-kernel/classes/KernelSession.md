[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [cognitive-kernel](../README.md) / KernelSession

# Class: KernelSession

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-session.ts:9](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-session.ts#L9)

## Constructors

### Constructor

> **new KernelSession**(`metadata`): `KernelSession`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-session.ts:13](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-session.ts#L13)

#### Parameters

##### metadata

[`SessionMetadata`](../interfaces/SessionMetadata.md)

#### Returns

`KernelSession`

## Methods

### close()

> **close**(): `void`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-session.ts:25](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-session.ts#L25)

#### Returns

`void`

---

### getMetadata()

> **getMetadata**(): [`SessionMetadata`](../interfaces/SessionMetadata.md)

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-session.ts:17](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-session.ts#L17)

#### Returns

[`SessionMetadata`](../interfaces/SessionMetadata.md)

---

### getStatus()

> **getStatus**(): `"ACTIVE"` \| `"CLOSED"`

Defined in: [packages/cognitive/cognitive-kernel/src/kernel-session.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/cognitive/cognitive-kernel/src/kernel-session.ts#L21)

#### Returns

`"ACTIVE"` \| `"CLOSED"`
