# ADR-001: Use OpenTelemetry for Observability

## Status

Accepted

## Context

AgentX needs a unified observability solution for distributed tracing, metrics, and logging across multiple packages (core-runtime, provider-sdk, tool-sdk).

## Decision

Adopt OpenTelemetry as the standard observability framework:

- `@opentelemetry/api` for instrumentation
- `@opentelemetry/sdk-node` for SDK initialization
- OTLP exporters for traces and metrics

## Consequences

### Positive

- Industry standard, vendor-agnostic
- Rich ecosystem of instrumentations
- Native support for distributed tracing
- Easy integration with Jaeger, Prometheus, Grafana

### Negative

- Additional dependencies (~10 packages)
- Learning curve for team members
- Configuration complexity for multiple exporters
