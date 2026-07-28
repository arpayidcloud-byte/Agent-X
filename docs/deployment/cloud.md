# Cloud Deployment

## Supported Providers

- AWS (ECS, EKS, Lambda)
- Google Cloud (Cloud Run, GKE)
- Azure (Container Apps, AKS)

## AWS ECS Deployment

### Prerequisites

- AWS CLI configured
- ECS cluster created
- ECR repository

### Steps

```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

docker build -t agentx .
docker tag agentx:latest <account>.dkr.ecr.us-east-1.amazonaws.com/agentx:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/agentx:latest

# Update ECS service
aws ecs update-service --cluster agentx --service agentx-api --force-new-deployment
```

### Environment Variables

```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
ANTHROPIC_API_KEY=sk-ant-...
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://<collector>:4318/v1/traces
```

## Google Cloud Run

```bash
gcloud run deploy agentx-api \
  --image gcr.io/<project>/agentx:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=postgresql://..."
```

## Cost Optimization

- Use spot instances for worker pods
- Set resource requests/limits appropriately
- Enable horizontal pod autoscaling
- Use reserved capacity for predictable workloads
