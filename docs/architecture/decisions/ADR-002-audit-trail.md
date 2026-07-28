# ADR-002: Hash-Chained Audit Trail

## Status

Accepted

## Context

AgentX requires an immutable, tamper-proof audit trail for security-critical operations (task creation, execution, deletion).

## Decision

Implement hash-chained audit logging:

- Each entry contains SHA-256 hash of previous entry
- Genesis hash for first entry
- Verification function to detect tampering

## Consequences

### Positive

- Tamper detection without external dependencies
- Simple to implement and verify
- Append-only by design

### Negative

- Cannot modify or delete entries
- Performance overhead for hash computation
- Storage grows unboundedly (requires rotation policy)
