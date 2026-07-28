# AgentX API Reference

**Version:** 1.0.0  
**Base URL:** `http://localhost:3000/api/v1`

## Authentication

All API endpoints require Bearer token authentication:

```bash
Authorization: Bearer <API_KEY>
```

## Endpoints

### Tasks

#### Submit Task

**POST** `/tasks/submit`

```json
{
  "goal": "string (required)",
  "role": "coder|reviewer|tester|security",
  "priority": "low|normal|high",
  "metadata": {}
}
```

#### Get Task

**GET** `/tasks/:taskId`

#### List Tasks

**GET** `/tasks?status=&role=&limit=`

#### Approve Task

**POST** `/tasks/:taskId/approve`

#### Reject Task

**POST** `/tasks/:taskId/reject`

### Health

**GET** `/health`

```json
{
  "status": "healthy",
  "uptime": 3600,
  "timestamp": "2026-07-26T17:00:00Z"
}
```

### Metrics

**GET** `/metrics` (Prometheus format)

### Security

**POST** `/security/scan` (Owner only)

**GET** `/security/secrets` (Owner only)

**GET** `/security/audit-log` (Developer+)

### Dead Letter Queue

**GET** `/dlq`

**POST** `/dlq/clear` (Owner only)
