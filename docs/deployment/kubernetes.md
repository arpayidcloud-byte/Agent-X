# Kubernetes Deployment

## Prerequisites

- Kubernetes >= 1.28
- Helm >= 3.14
- kubectl configured

## Installation

```bash
# Add Helm repo
helm repo add agentx https://arpayidcloud-byte.github.io/charts
helm repo update

# Install AgentX
helm install agentx agentx/agentx \
  --namespace agentx \
  --create-namespace \
  --set database.url=postgresql://user:pass@postgres:5432/agentx \
  --set redis.url=redis://redis:6379
```

## Configuration

### values.yaml

```yaml
replicaCount: 3
image:
  repository: ghcr.io/arpayidcloud-byte/agentx
  tag: latest

database:
  url: postgresql://user:pass@postgres:5432/agentx

redis:
  url: redis://redis:6379

resources:
  requests:
    cpu: 500m
    memory: 512Mi
  limits:
    cpu: 2000m
    memory: 2Gi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilization: 70
```

## Monitoring

```bash
# Check pods
kubectl get pods -n agentx

# View logs
kubectl logs -n agentx -l app=agentx-api -f

# Port forward for local access
kubectl port-forward -n agentx svc/agentx-api 3000:3000
```

## Upgrading

```bash
helm upgrade agentx agentx/agentx -n agentx -f values.yaml
```
