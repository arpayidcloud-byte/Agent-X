[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / Span

# Interface: Span

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/span.d.ts:18

An interface that represents a span. A span represents a single operation
within a trace. Examples of span might include remote procedure calls or a
in-process function calls to sub-components. A Trace has a single, top-level
"root" Span that in turn may have zero or more child Spans, which in turn
may have children.

Spans are created by the [Tracer.startSpan](Tracer.md#startspan) method.

## Since

1.0.0

## Methods

### addEvent()

> **addEvent**(`name`, `attributesOrStartTime?`, `startTime?`): `this`

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/span.d.ts:56

Adds an event to the Span.

#### Parameters

##### name

`string`

the name of the event.

##### attributesOrStartTime?

`Attributes` \| `TimeInput`

the attributes that will be added; these are
associated with this event. Can be also a start time
if type is TimeInput and 3rd param is undefined

##### startTime?

`TimeInput`

start time of the event.

#### Returns

`this`

---

### addLink()

> **addLink**(`link`): `this`

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/span.d.ts:65

Adds a single link to the span.

Links added after the creation will not affect the sampling decision.
It is preferred span links be added at span creation.

#### Parameters

##### link

`Link`

the link to add.

#### Returns

`this`

---

### addLinks()

> **addLinks**(`links`): `this`

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/span.d.ts:74

Adds multiple links to the span.

Links added after the creation will not affect the sampling decision.
It is preferred span links be added at span creation.

#### Parameters

##### links

`Link`[]

the links to add.

#### Returns

`this`

---

### end()

> **end**(`endTime?`): `void`

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/span.d.ts:116

Marks the end of Span execution.

Call to End of a Span MUST not have any effects on child spans. Those may
still be running and can be ended later.

Do not return `this`. The Span generally should not be used after it
is ended so chaining is not desired in this context.

#### Parameters

##### endTime?

`TimeInput`

the time to set as Span's end time. If not provided,
use the current time as the span's end time.

#### Returns

`void`

---

### isRecording()

> **isRecording**(): `boolean`

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/span.d.ts:123

Returns the flag whether this span will be recorded.

#### Returns

`boolean`

true if this Span is active and recording information like events
with the `AddEvent` operation and attributes using `setAttributes`.

---

### recordException()

> **recordException**(`exception`, `time?`): `void`

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/span.d.ts:130

Sets exception as a span event

#### Parameters

##### exception

`Exception`

the exception the only accepted values are string or Error

##### time?

`TimeInput`

the time to set as Span's event time. If not provided,
use the current time.

#### Returns

`void`

---

### setAttribute()

> **setAttribute**(`key`, `value`): `this`

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/span.d.ts:38

Sets an attribute to the span.

Sets a single Attribute with the key and value passed as arguments.

#### Parameters

##### key

`string`

the key for this attribute.

##### value

`AttributeValue`

the value for this attribute. Setting a value null or
undefined is invalid and will result in undefined behavior.

#### Returns

`this`

---

### setAttributes()

> **setAttributes**(`attributes`): `this`

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/span.d.ts:46

Sets attributes to the span.

#### Parameters

##### attributes

`Attributes`

the attributes that will be added.
null or undefined attribute values
are invalid and will result in undefined behavior.

#### Returns

`this`

---

### setStatus()

> **setStatus**(`status`): `this`

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/span.d.ts:92

Sets the status of the span.

By default, a span has status [SpanStatusCode.UNSET](../enumerations/SpanStatusCode.md#unset).
Calling this method overrides that default.

The status codes have a total order: `OK > ERROR > UNSET`.

- Once [SpanStatusCode.OK](../enumerations/SpanStatusCode.md#ok) is set, any further attempts to change
  the status are ignored.
- Any attempt to set [SpanStatusCode.UNSET](../enumerations/SpanStatusCode.md#unset) is always ignored.

The `message` field is only used when [SpanStatusCode.ERROR](../enumerations/SpanStatusCode.md#error) is set.
For all other status codes, `message` is ignored.

#### Parameters

##### status

`SpanStatus`

The SpanStatus to set.

#### Returns

`this`

---

### spanContext()

> **spanContext**(): `SpanContext`

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/span.d.ts:28

Returns the [SpanContext](SpanContext.md) object associated with this Span.

Get an immutable, serializable identifier for this span that can be used
to create new child spans. Returned SpanContext is usable even after the
span ends.

#### Returns

`SpanContext`

the SpanContext object associated with this Span.

---

### updateName()

> **updateName**(`name`): `this`

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/span.d.ts:103

Updates the Span name.

This will override the name provided via [Tracer.startSpan](Tracer.md#startspan).

Upon this update, any sampling behavior based on Span name will depend on
the implementation.

#### Parameters

##### name

`string`

the Span name.

#### Returns

`this`
