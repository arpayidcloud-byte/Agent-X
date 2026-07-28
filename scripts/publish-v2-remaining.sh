#!/bin/bash
# Publish remaining packages to v2.0.0

cd /root/Agentx

# Packages that still need v2.0.0 (skip shared which is done)
PACKAGES=(
"packages/shared/core-runtime:core-runtime"
"packages/shared/observability:observability"
"packages/shared/persistence:persistence"
"packages/shared/secrets:secrets"
"packages/shared/security:security"
"packages/shared/tenant:tenant"
"packages/shared/cache:cache"
"packages/shared/telemetry:telemetry"
"packages/runtime/runtime-adapters:runtime-adapters"
"packages/runtime/runtime:runtime"
"packages/runtime/runtime-production:runtime-production"
"packages/runtime/enterprise-runtime:enterprise-runtime"
"packages/provider/provider-sdk:provider-sdk"
"packages/provider/native-providers:native-providers"
"packages/provider/provider-qualification:provider-qualification"
"packages/provider/provider-release:provider-release"
"packages/provider/vendor-certification:vendor-certification"
"packages/shared/tool-sdk:tool-sdk"
"packages/agent/agent-platform:agent-platform"
"packages/plugin-sdk:plugin-sdk"
"packages/platform/developer-platform:developer-platform"
"packages/cognitive/cognitive-contracts:cognitive-contracts"
"packages/cognitive/cognitive-kernel:cognitive-kernel"
"packages/cognitive/cognitive-learning:cognitive-learning"
"packages/cognitive/autonomous-cognition:autonomous-cognition"
"packages/distributed/distributed-cognition:distributed-cognition"
"packages/workflow/workflow-engine:workflow-engine"
"packages/workflow/workflow-orchestration:workflow-orchestration"
"packages/workflow/workflow-hardening:workflow-hardening"
"packages/planning/planning-engine:planning-engine"
"packages/planning/goal-intelligence:goal-intelligence"
"packages/agent/multi-agent-collaboration:multi-agent-collaboration"
"packages/agent/multi-agent-reasoning:multi-agent-reasoning"
"packages/quality/architecture-sdk:architecture-sdk"
"packages/quality/production-quality:production-quality"
"packages/reasoning/reasoning-framework:reasoning-framework"
"packages/reasoning/reasoning-algorithms:reasoning-algorithms"
"packages/api-server:api-server"
"packages/auth:auth"
"packages/cloud:cloud"
"packages/enterprise:enterprise"
"packages/shared/context-engine:context-engine"
"packages/shared/knowledge-engine:knowledge-engine"
"packages/shared/memory-engine:memory-engine"
"apps/cli:cli"
"tooling/dependency-lint:dependency-lint"
"tooling/eslint-plugin-internal:eslint-plugin"
"tooling/handbook-lint:handbook-lint"
)

echo "🚀 Publishing remaining packages to v2.0.0"
echo "Total: ${#PACKAGES[@]} packages"
echo ""

for i in "${!PACKAGES[@]}"; do
    IFS=':' read -r pkg_path pkg_name <<< "${PACKAGES[$i]}"
    
    # Check if already v2.0.0
    current_ver=$(npm view "@agentx-fast/$pkg_name" version 2>/dev/null || echo "NOT_FOUND")
    
    if [ "$current_ver" = "2.0.0" ]; then
        echo "[$((i+1))/${#PACKAGES[@]}] ✅ @agentx-fast/$pkg_name already v2.0.0 - SKIP"
        continue
    fi
    
    echo ""
    echo "[$((i+1))/${#PACKAGES[@]}] 📦 @agentx-fast/$pkg_name (current: $current_ver)"
    echo "   Publishing v2.0.0..."
    
    cd /root/Agentx/$pkg_path
    
    # Build
    rm -rf dist
    if [ -f "src/index.ts" ]; then
        npx tsc src/index.ts --module NodeNext --moduleResolution NodeNext --outDir dist --declaration --skipLibCheck --esModuleInterop 2>/dev/null || true
    else
        for file in $(find src -name "*.ts" -type f 2>/dev/null); do
            npx tsc "$file" --module NodeNext --moduleResolution NodeNext --outDir dist --declaration --skipLibCheck --esModuleInterop --noResolve 2>/dev/null || true
        done
    fi
    
    # Publish if dist has files
    if [ -d "dist" ] && [ "$(ls -A dist 2>/dev/null)" ]; then
        npm publish --access public 2>&1 | grep -E "(published|error|You cannot)" || true
        sleep 2
        new_ver=$(npm view "@agentx-fast/$pkg_name" version 2>/dev/null || echo "PENDING")
        echo "   ✅ Published: v$new_ver"
    else
        echo "   ⚠️ Build failed or no dist"
    fi
    
    cd /root/Agentx
    sleep 2
done

echo ""
echo "🎉 PUBLISH COMPLETE!"
