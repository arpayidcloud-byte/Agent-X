[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [provider/provider-sdk/src](../README.md) / CompletionRequest

# Interface: CompletionRequest

Defined in: [packages/provider/provider-sdk/src/interfaces.ts:96](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/interfaces.ts#L96)

## Properties

### cancellationToken?

> `optional` **cancellationToken?**: `AbortSignal`

Defined in: [packages/provider/provider-sdk/src/interfaces.ts:108](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/interfaces.ts#L108)

---

### context?

> `optional` **context?**: `object`[]

Defined in: [packages/provider/provider-sdk/src/interfaces.ts:99](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/interfaces.ts#L99)

#### content

> **content**: `string` \| [`ToolResult`](ToolResult.md)[] \| [`NormalizedToolCall`](NormalizedToolCall.md)[]

#### role

> **role**: `"user"` \| `"assistant"`

---

### maxTokens?

> `optional` **maxTokens?**: `number`

Defined in: [packages/provider/provider-sdk/src/interfaces.ts:104](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/interfaces.ts#L104)

---

### modelId?

> `optional` **modelId?**: `string`

Defined in: [packages/provider/provider-sdk/src/interfaces.ts:105](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/interfaces.ts#L105)

---

### systemPrompt

> **systemPrompt**: `string`

Defined in: [packages/provider/provider-sdk/src/interfaces.ts:97](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/interfaces.ts#L97)

---

### temperature?

> `optional` **temperature?**: `number`

Defined in: [packages/provider/provider-sdk/src/interfaces.ts:106](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/interfaces.ts#L106)

---

### tools?

> `optional` **tools?**: [`NormalizedToolSpec`](NormalizedToolSpec.md)[]

Defined in: [packages/provider/provider-sdk/src/interfaces.ts:103](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/interfaces.ts#L103)

---

### traceId?

> `optional` **traceId?**: `string`

Defined in: [packages/provider/provider-sdk/src/interfaces.ts:107](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/interfaces.ts#L107)

---

### userPrompt

> **userPrompt**: `string`

Defined in: [packages/provider/provider-sdk/src/interfaces.ts:98](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/provider/provider-sdk/src/interfaces.ts#L98)
