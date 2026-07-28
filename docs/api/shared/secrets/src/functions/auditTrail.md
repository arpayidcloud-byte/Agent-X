[**agentx-workspace**](../../../../README.md)

---

[agentx-workspace](../../../../README.md) / [shared/secrets/src](../README.md) / auditTrail

# Function: auditTrail()

> **auditTrail**(`key`, `action`): `void`

Defined in: [packages/shared/secrets/src/audit-trail.ts:29](https://github.com/arpayidcloud-byte/Agentx/blob/39f649f26ebb3402d33388e086248595af2b5984/packages/shared/secrets/src/audit-trail.ts#L29)

Secure audit trail logging

NEVER logs the actual key value - only logs a hash prefix
This prevents secret leakage through logs

## Parameters

### key

`string`

Secret key identifier (will be hashed)

### action

`string`

Action performed (e.g., 'get', 'set', 'rotate')

## Returns

`void`
