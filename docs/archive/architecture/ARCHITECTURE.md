# Architecture

The authoritative architecture specification is maintained in the `agentx-handbook` repository.

## The 16 Volumes

1. **Foundation**: System definition, terminology, dependency graph.
2. **Core Runtime**: State machine, Event Bus, Scheduler.
3. **Agent Platform**: AI Decomposer and 4 specialist agents.
4. **Provider Platform**: Normalized vendor interfaces (Anthropic, Google).
5. **Workflow Engine**: Task DAG execution and Approval Gates.
6. **Memory Engine**: Postgres schema, append-only audit, Context Engine.
7. **Tool SDK**: Sandbox enforcement and tool registration.
8. **Plugin Platform**: Third-party agent, tool, and provider registration.
9. **CLI Platform**: Command line interface.
10. **Enterprise Platform**: Postgres Row-Level Security, RBAC multi-tenancy.
11. **Cloud Platform**: Deployment topologies, DR.
12. **AI Company OS**: Cross-project organizational portfolio features.
13. **Observability**: Metrics, traces, logs.
14. **Testing & QA**: Contract tests, Golden Set eval, lint validation.
15. **Identity**: Local/Token/SSO authenticators.
16. **Secrets & Keys**: Secure credential storage, cache, invalidation.

## Key Decisions (ADRs)

See `/root/agentx-handbook/03-ADR/` for detailed rationale on key structural choices (fail-closed permissions, Postgres triggers for audit logs, etc.).
