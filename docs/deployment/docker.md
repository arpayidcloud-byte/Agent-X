# Docker Deployment

## Prerequisites

- Docker >= 24.0
- Docker Compose >= 2.20

## Quick Start

```bash
# Clone and build
git clone https://github.com/arpayidcloud-byte/Agentx.git
cd Agentx
docker compose up -d
```

## Services

| Service       | Port | Description           |
| ------------- | ---- | --------------------- |
| postgres      | 5432 | Primary database      |
| redis         | 6379 | Cache & queue backend |
| agentx-api    | 3000 | AgentX API server     |
| agentx-worker | -    | Background worker     |

## Configuration

Create `.env` file:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/agentx

# Redis
REDIS_URL=redis://localhost:6379

# Provider API Keys
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Observability
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:4318/v1/traces
```

## Build from Source

```bash
# Build all packages
pnpm build

# Build Docker images
docker compose build

# Start services
docker compose up -d

# View logs
docker compose logs -f agentx-api
```

## Production Considerations

- Use environment-specific compose files: `docker compose -f docker-compose.prod.yml up -d`
- Set resource limits in compose file
- Use Docker secrets for sensitive values
- Enable health checks for all services
