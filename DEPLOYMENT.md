# Deployment Guide

## 1. Prerequisites

Before deploying the application, ensure the following prerequisites are installed:

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Node.js** (version 18 or higher)
- **pnpm** (version 8 or higher)

### Installation Verification

```bash
# Verify Docker
docker --version

# Verify Docker Compose
docker compose version

# Verify Node.js
node --version

# Verify pnpm
pnpm --version
```

---

## 2. Local Development

### Start Infrastructure Services

```bash
# Start all services (PostgreSQL, Redis, Grafana, Prometheus)
docker compose up -d
```

### Install Dependencies

```bash
# Install project dependencies
pnpm install
```

### Build the Application

```bash
# Build the application
pnpm build
```

### Run Development Server

```bash
# Start development server
pnpm dev
```

### Stop Services

```bash
# Stop all services
docker compose down
```

---

## 3. Production Deployment

### Docker Compose Deployment

```bash
# Deploy to production
docker compose -f docker-compose.yml up -d

# View running containers
docker compose ps

# View logs
docker compose logs -f
```

### Service Ports

| Service    | Port | Description             |
| ---------- | ---- | ----------------------- |
| PostgreSQL | 5432 | Primary database        |
| Redis      | 6379 | Cache & session storage |
| API Server | 3000 | Main application API    |
| Grafana    | 3001 | Monitoring dashboards   |
| Prometheus | 9090 | Metrics collection      |

### Access URLs

- **API Server:** http://localhost:3000
- **Grafana:** http://localhost:3001 (default: admin/admin)
- **Prometheus:** http://localhost:9090

---

## 4. Environment Variables

### Required Variables

| Variable                      | Description                         | Example                                    |
| ----------------------------- | ----------------------------------- | ------------------------------------------ |
| `DATABASE_URL`                | PostgreSQL connection string        | `postgresql://user:pass@localhost:5432/db` |
| `REDIS_URL`                   | Redis connection string             | `redis://localhost:6379`                   |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OpenTelemetry endpoint              | `http://localhost:4317`                    |
| `ANTHROPIC_API_KEY`           | Anthropic API key (if using Claude) | `sk-ant-...`                               |
| `OPENAI_API_KEY`              | OpenAI API key (if using GPT)       | `sk-...`                                   |

### Environment File Template

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL=postgresql://agentx:agentx@localhost:5432/agentx

# Redis
REDIS_URL=redis://localhost:6379

# OpenTelemetry
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317

# AI Providers
ANTHROPIC_API_KEY=your-anthropic-key
OPENAI_API_KEY=your-openai-key

# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
```

---

## 5. Monitoring

### Grafana Dashboards

Access Grafana at: http://localhost:3001

**Default Credentials:**

- Username: `admin`
- Password: `admin`

**Available Dashboards:**

- Application Metrics
- System Resources
- Request Latency
- Error Rates

### Prometheus Metrics

Access Prometheus at: http://localhost:9090

**Key Metrics:**

- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request latency
- `node_memory_usage_bytes` - Memory usage
- `node_cpu_usage_percent` - CPU usage

### Health Check

```bash
# Check application health
curl http://localhost:3000/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

### Prometheus Configuration

Prometheus scrapes metrics from:

- Application: `http://app:3000/metrics`
- Node Exporter: `http://node-exporter:9100/metrics`

---

## 6. Backup & Recovery

### PostgreSQL Backup

#### Manual Backup

```bash
# Backup database
docker compose exec postgres pg_dump -U agentx agentx > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
docker compose exec -T postgres psql -U agentx agentx < backup_YYYYMMDD_HHMMSS.sql
```

#### Automated Backup Script

```bash
#!/bin/bash
# backup-postgres.sh

BACKUP_DIR="/backups/postgresql"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="agentx-postgres-1"
DB_NAME="agentx"
DB_USER="agentx"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
docker exec $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$TIMESTAMP.sql.gz"
```

### Redis Persistence

#### Enable AOF Persistence

In `docker-compose.yml`:

```yaml
services:
  redis:
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
```

#### Manual Redis Backup

```bash
# Trigger BGSAVE
docker compose exec redis redis-cli BGSAVE

# Copy dump file
docker compose cp redis:/data/dump.rdb ./redis-backup-$(date +%Y%m%d).rdb
```

### Disaster Recovery Runbook

#### Scenario 1: Database Failure

```bash
# 1. Stop affected containers
docker compose down

# 2. Restore from latest backup
gunzip -c /backups/postgresql/backup_latest.sql.gz | docker compose exec -T postgres psql -U agentx agentx

# 3. Restart services
docker compose up -d

# 4. Verify health
curl http://localhost:3000/health
```

#### Scenario 2: Redis Data Loss

```bash
# 1. Stop Redis
docker compose stop redis

# 2. Restore from backup
docker compose cp redis-backup.rdb redis:/data/dump.rdb

# 3. Start Redis
docker compose up -d redis

# 4. Verify connection
docker compose exec redis redis-cli ping
```

#### Scenario 3: Full System Recovery

```bash
# 1. Clone repository
git clone <repository-url>
cd Agentx

# 2. Restore environment
cp .env.example .env
# Edit .env with production values

# 3. Restore database
docker compose up -d postgres
gunzip -c /backups/postgresql/backup_latest.sql.gz | docker compose exec -T postgres psql -U agentx agentx

# 4. Restore Redis (if needed)
docker compose up -d redis
docker compose cp redis-backup.rdb redis:/data/dump.rdb

# 5. Start all services
docker compose up -d

# 6. Deploy application
pnpm install
pnpm build
pnpm start
```

---

## 7. Scaling

### Horizontal Scaling

#### Scale Application Instances

```bash
# Scale API server to 3 instances
docker compose up -d --scale app=3

# Verify scaling
docker compose ps
```

#### Load Balancer Configuration

Add nginx as reverse proxy:

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
```

**nginx.conf:**

```nginx
http {
    upstream app_servers {
        server app_1:3000;
        server app_2:3000;
        server app_3:3000;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://app_servers;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### Worker Pools

Configure worker concurrency in environment:

```bash
# .env
WORKER_CONCURRENCY=4
MAX_WORKERS=8
```

### Resource Limits

Set container resource limits in `docker-compose.yml`:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

---

## 8. Troubleshooting

### Common Issues

#### Issue: Container fails to start

```bash
# Check logs
docker compose logs <service-name>

# Check resource usage
docker stats

# Restart service
docker compose restart <service-name>
```

#### Issue: Database connection failed

```bash
# Check PostgreSQL status
docker compose ps postgres

# Test connection
docker compose exec postgres psql -U agentx -c "SELECT 1"

# Check network
docker compose exec app ping postgres
```

#### Issue: Redis connection timeout

```bash
# Check Redis status
docker compose ps redis

# Test connection
docker compose exec redis redis-cli ping

# Check memory usage
docker compose exec redis redis-cli INFO memory
```

#### Issue: High memory usage

```bash
# Check container memory
docker stats

# Inspect application memory
docker compose exec app node --inspect=0.0.0.0:9229

# Restart with memory limits
docker compose up -d --scale app=1
```

### Logs Location

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f app
docker compose logs -f postgres
docker compose logs -f redis

# Export logs to file
docker compose logs > logs_$(date +%Y%m%d).txt
```

### Debug Mode

Enable debug logging:

```bash
# .env
NODE_ENV=development
LOG_LEVEL=debug
DEBUG=agentx:*
```

### Health Check Commands

```bash
# Application health
curl http://localhost:3000/health

# Database health
docker compose exec postgres pg_isready -U agentx

# Redis health
docker compose exec redis redis-cli ping

# Full system check
docker compose ps
```

### Performance Debugging

```bash
# Enable Node.js profiling
node --prof app.js

# Analyze profile
node --prof-process isolate-*.log > profile.txt

# Check database slow queries
docker compose exec postgres psql -U agentx -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10"
```

---

## Quick Reference

| Command                            | Description                  |
| ---------------------------------- | ---------------------------- |
| `docker compose up -d`             | Start all services           |
| `docker compose down`              | Stop all services            |
| `docker compose ps`                | List running containers      |
| `docker compose logs -f`           | View logs                    |
| `docker compose restart <service>` | Restart a service            |
| `docker compose exec <svc> <cmd>`  | Execute command in container |
| `pnpm install`                     | Install dependencies         |
| `pnpm build`                       | Build application            |
| `pnpm dev`                         | Start development server     |
| `pnpm start`                       | Start production server      |
