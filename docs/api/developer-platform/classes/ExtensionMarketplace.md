[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [developer-platform](../README.md) / ExtensionMarketplace

# Class: ExtensionMarketplace

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:41](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L41)

## Constructors

### Constructor

> **new ExtensionMarketplace**(): `ExtensionMarketplace`

#### Returns

`ExtensionMarketplace`

## Methods

### get()

> **get**(`listingId`): [`MarketplaceListing`](../interfaces/MarketplaceListing.md) \| `undefined`

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:61](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L61)

#### Parameters

##### listingId

`string`

#### Returns

[`MarketplaceListing`](../interfaces/MarketplaceListing.md) \| `undefined`

---

### getAll()

> **getAll**(): [`MarketplaceListing`](../interfaces/MarketplaceListing.md)[]

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:65](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L65)

#### Returns

[`MarketplaceListing`](../interfaces/MarketplaceListing.md)[]

---

### list()

> **list**(`name`, `version`, `author`): [`MarketplaceListing`](../interfaces/MarketplaceListing.md)

Defined in: [packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts:44](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/platform/developer-platform/src/infrastructure/marketplace/Marketplace.ts#L44)

#### Parameters

##### name

`string`

##### version

`string`

##### author

`string`

#### Returns

[`MarketplaceListing`](../interfaces/MarketplaceListing.md)
