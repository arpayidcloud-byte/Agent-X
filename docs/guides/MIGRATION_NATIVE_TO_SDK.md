# Migration Guide: @agentx/native-providers → @agentx/provider-sdk

## Overview

@agentx/native-providers is deprecated. Migrate to @agentx/provider-sdk.

## Timeline

- Deprecated: July 2026
- End of Support: October 2026

## Migration Steps

### 1. Update Dependencies

```bash
pnpm remove @agentx/native-providers
pnpm add @agentx/provider-sdk
```

### 2. Update Imports

Before: `import { X } from '@agentx/native-providers'`
After: `import { X } from '@agentx/provider-sdk'`

### 3. Test

```bash
pnpm test
```
