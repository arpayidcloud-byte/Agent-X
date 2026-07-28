# Deployment Runbook

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] CI green
- [ ] Documentation updated
- [ ] Version bumped
- [ ] CHANGELOG updated

## Deployment Steps

### 1. Version Bump

```bash
pnpm changeset version
git commit -am "Version 1.0.0"
```

### 2. Create Release Branch

```bash
git checkout -b release/v1.0.0
git push -u origin release/v1.0.0
```

### 3. Run Final CI

Wait for all CI checks to pass.

### 4. Create GitHub Release

```bash
gh release create v1.0.0 --generate-notes
```

### 5. Publish to npm

```bash
pnpm release
```

### 6. Deploy to Production

```bash
kubectl apply -f k8s/production/
```

### 7. Verify Deployment

```bash
curl https://api.agentx.io/health
```

## Rollback

```bash
kubectl rollout undo deployment/agentx-api
```
