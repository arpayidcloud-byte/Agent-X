[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [vendor-certification](../README.md) / IProvider

# Interface: IProvider

Defined in: [packages/provider/vendor-certification/src/interfaces.ts:21](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/vendor-certification/src/interfaces.ts#L21)

## Methods

### getCapabilities()

> **getCapabilities**(): [`ProviderCapabilities`](ProviderCapabilities.md)

Defined in: [packages/provider/vendor-certification/src/interfaces.ts:23](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/vendor-certification/src/interfaces.ts#L23)

#### Returns

[`ProviderCapabilities`](ProviderCapabilities.md)

---

### getMetadata()

> **getMetadata**(): [`ProviderMetadata`](ProviderMetadata.md)

Defined in: [packages/provider/vendor-certification/src/interfaces.ts:22](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/vendor-certification/src/interfaces.ts#L22)

#### Returns

[`ProviderMetadata`](ProviderMetadata.md)

---

### healthCheck()

> **healthCheck**(): `Promise`\<\{ `healthy`: `boolean`; `lastChecked`: `Date`; `latencyMs`: `number`; `status`: `string`; \}\>

Defined in: [packages/provider/vendor-certification/src/interfaces.ts:24](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/vendor-certification/src/interfaces.ts#L24)

#### Returns

`Promise`\<\{ `healthy`: `boolean`; `lastChecked`: `Date`; `latencyMs`: `number`; `status`: `string`; \}\>
