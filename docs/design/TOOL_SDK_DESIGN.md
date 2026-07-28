# Tool SDK Foundation (M2.1)

**Date:** 2026-07-14
**Status:** Completed

## 1. Architecture Diagram

```mermaid
classDiagram
    class ITool {
        <<interface>>
        +definition: ToolDefinition
        +metadata: ToolMetadata
        +execute(req)
    }

    class IToolRegistry {
        <<interface>>
        +register(tool)
        +unregister(name)
        +find(name)
        +resolve(name, category)
    }

    class IPermissionResolver {
        <<interface>>
        +resolvePolicyForAgent(agentRole)
    }

    class IPermissionEvaluator {
        <<interface>>
        +isAllowed(agentRole, category, riskScore)
        +evaluate(req, tool)
    }

    class IToolValidator {
        <<interface>>
        +validateSchema(schema, args)
        +validateManifest(manifest)
        +detectDuplicate(registry, name)
    }

    class ToolExecutionPipeline {
        <<interface>>
        +addHook(hook)
        +execute(req, tool)
    }

    IToolRegistry --> ITool
    IPermissionEvaluator --> IPermissionResolver
    ToolExecutionPipeline --> ITool
```

## 2. Sequence Diagram (Tool Validation & Gating Flow)

```mermaid
sequenceDiagram
    participant Agent as Agent Platform / Caller
    participant Pipeline as ToolExecutionPipeline
    participant Evaluator as PermissionEvaluator
    participant Validator as ToolValidator
    participant Tool as ITool

    Agent->>Pipeline: execute(request, tool)

    Pipeline->>Evaluator: evaluate(request, tool)
    Note over Evaluator: Checks PermissionPolicy for AgentRole

    alt Permission Denied
        Evaluator-->>Pipeline: throw PermissionDeniedError
        Pipeline-->>Agent: throw PermissionDeniedError (Fail Closed)
    else Permission Approved
        Evaluator-->>Pipeline: Approved
    end

    Pipeline->>Validator: validateSchema(tool.schema, request.arguments)
    alt Invalid Schema
        Validator-->>Pipeline: throw SchemaValidationError
        Pipeline-->>Agent: throw SchemaValidationError
    else Valid Schema
        Validator-->>Pipeline: Valid
    end

    Pipeline->>Pipeline: PreExecute Hooks
    Pipeline->>Tool: execute(request)
    Tool-->>Pipeline: ToolExecutionResponse
    Pipeline->>Pipeline: PostExecute Hooks

    Pipeline-->>Agent: ToolExecutionResponse
```

## 3. Tool Registry Architecture

The `ToolRegistry` implements the `IToolRegistry` contract, serving as the central store for all registered tools. It:

- Validates that tool names are unique (throwing `DuplicateToolError`).
- Organizes tools by name and categorizes them to allow query optimization.
- Restricts resolution of a tool to cases where both the name and the requested `ToolCategory` match, preventing incorrect namespace invocation.

## 4. Permission Model

- **Graduated Roles**: Four built-in roles (`coding`, `review`, `test`, `security`) are defined with specific allowed categories matching Vol 7 Ch.2.
- **Evaluation**: The `PermissionEvaluator` performs checks on every request, comparing the caller's agent role against the tool category and risk score limits. Failures throw `PermissionDeniedError` before execution.

## 5. Tool Classification & Risk Management

Managed in `ToolClassifier`, every tool category resolves to a classification:

- **Destructive**: Enforces `Requires Approval` and risk scores of 90. Per ADR-0005, all `fs.write` calls, along with `shell.exec` and `git.write`, map unconditionally to this category.
- **PotentiallyDestructive**: Risk score of 50 (e.g. `shell.build`).
- **Safe**: Risk score of 10 (e.g. `fs.read`, `git.read`).

## 6. Validation Pipeline

Checks are layered at registration and invocation:

- **Manifest Check**: Verifies integrity of the manifest file properties (`entryPoint`, kinds, categories).
- **Duplicate Check**: Prevents registration of duplicate names.
- **Schema Check**: Validates execution arguments against the defined JSON schema parameters before execution.

## 7. Integration Points

- `@agentx/shared`: For metric counters and structured warning logging.
- `@agentx/secrets`: Decoupled; credentials are not stored or requested by the Tool SDK directly, conforming to Principle 3.
- `@agentx/core-runtime`: Execution context logs trace IDs cleanly.

## 8. Reference Mapping

- **Volume 7 (Tool SDK):** Strict permission check boundaries implemented.
- **ADR-0005 (fs.write destructive):** Implemented unconditionally in `ToolClassifier`.
- **RFC-0027 (Plugin sandboxing):** Manifest and validation schemas built.
