[**agentx-workspace**](../../README.md)

---

[agentx-workspace](../../README.md) / [enterprise-runtime](../README.md) / Tracer

# Interface: Tracer

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/tracer.d.ts:9

Tracer provides an interface for creating [Span](Span.md)s.

## Since

1.0.0

## Methods

### startActiveSpan()

#### Call Signature

> **startActiveSpan**\<`F`>>>>\>(`name`, `fn`): `ReturnType`\<`F`>>>>\>

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/tracer.d.ts:69

Starts a new [Span](Span.md) and calls the given function passing it the
created span as first argument.
Additionally the new span gets set in context and this context is activated
for the duration of the function call.

##### Type Parameters

###### F

`F` _extends_ (`span`) => `unknown`

##### Parameters

###### name

`string`

The name of the span

###### fn

`F`

function called in the context of the span and receives the newly created span as an argument

##### Returns

`ReturnType`\<`F`\>

return value of fn

##### Examples

```ts
const something = tracer.startActiveSpan('op', span => {
      try {
        do some work
        span.setStatus({code: SpanStatusCode.OK});
        return something;
      } catch (err) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: err.message,
        });
        throw err;
      } finally {
        span.end();
      }
    });
```

```ts
const span = tracer.startActiveSpan('op', span => {
      try {
        do some work
        return span;
      } catch (err) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: err.message,
        });
        throw err;
      }
    });
    do some more work
    span.end();
```

#### Call Signature

> **startActiveSpan**\<`F`>>>>\>(`name`, `options`, `fn`): `ReturnType`\<`F`>>>>\>

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/tracer.d.ts:70

##### Type Parameters

###### F

`F` _extends_ (`span`) => `unknown`

##### Parameters

###### name

`string`

###### options

`SpanOptions`

###### fn

`F`

##### Returns

`ReturnType`\<`F`\>

#### Call Signature

> **startActiveSpan**\<`F`>>>>\>(`name`, `options`, `context`, `fn`): `ReturnType`\<`F`>>>>\>

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/tracer.d.ts:71

##### Type Parameters

###### F

`F` _extends_ (`span`) => `unknown`

##### Parameters

###### name

`string`

###### options

`SpanOptions`

###### context

`Context`

###### fn

`F`

##### Returns

`ReturnType`\<`F`\>

---

### startSpan()

> **startSpan**(`name`, `options?`, `context?`): [`Span`](Span.md)

Defined in: node\_modules/.pnpm/@opentelemetry+api@1.9.1/node\_modules/@opentelemetry/api/build/src/trace/tracer.d.ts:24

Starts a new [Span](Span.md). Start the span without setting it on context.

This method do NOT modify the current Context.

#### Parameters

##### name

`string`

The name of the span

##### options?

`SpanOptions`

SpanOptions used for span creation

##### context?

`Context`

Context to use to extract parent

#### Returns

[`Span`](Span.md)

Span The newly created span

#### Example

```ts
const span = tracer.startSpan('op');
span.setAttribute('key', 'value');
span.end();
```
