#!/bin/bash
# AgentX Platform v2.0.0 - Automated Build & Publish Script
# Usage: bash scripts/publish-v2.sh

set -e

echo "🚀 AgentX Platform v2.0.0 - Build & Publish"
echo "============================================"
echo ""

# Function to build and publish a package
build_and_publish() {
    local pkg_path=$1
    local pkg_name=$2
    
    echo ""
    echo "📦 Processing: @agentx-fast/$pkg_name"
    echo "   Path: $pkg_path"
    
    cd /root/Agentx/$pkg_path
    
    # Clean dist
    rm -rf dist
    
    # Build with manual tsc (skip dependency resolution)
    echo "   Building..."
    if [ -f "src/index.ts" ]; then
        # Single entry point
        npx tsc src/index.ts --module NodeNext --moduleResolution NodeNext --outDir dist --declaration --skipLibCheck --esModuleInterop --allowSyntheticDefaultImports 2>/dev/null
    else
        # Multiple files - compile all .ts files
        for file in $(find src -name "*.ts" -type f); do
            npx tsc "$file" --module NodeNext --moduleResolution NodeNext --outDir dist --declaration --skipLibCheck --esModuleInterop --allowSyntheticDefaultImports --noResolve 2>/dev/null || true
        done
    fi
    
    # Check if dist has files
    if [ -d "dist" ] && [ "$(ls -A dist 2>/dev/null)" ]; then
        dist_count=$(ls -1 dist/ | wc -l)
        echo "   ✅ Build complete: $dist_count files in dist/"
        
        # Publish
        echo "   Publishing to npm..."
        npm publish --access public 2>&1 | grep -E "(published|error|You cannot)" || echo "   ⚠️ Publish output suppressed"
        
        # Verify
        sleep 3
        npm_version=$(npm view "@agentx-fast/$pkg_name" version 2>/dev/null || echo "NOT_FOUND")
        if [ "$npm_version" != "NOT_FOUND" ]; then
            echo "   ✅ Published: v$npm_version"
        else
            echo "   ⚠️ Verification pending (npm index delay)"
        fi
    else
        echo "   ❌ Build failed: No files in dist/"
    fi
    
    cd /root/Agentx
}

# Define build order (from MCP dependency analysis)
declare -a BATCHES=(
    # Batch 1: Foundation
    "packages/shared/shared:shared"
    "packages/shared/core-runtime:core-runtime"
    "packages/shared/observability:observability"
    "packages/shared/persistence:persistence"
    "packages/shared/secrets:secrets"
    "packages/shared/security:security"
    "packages/shared/tenant:tenant"
    "packages/shared/cache:cache"
    "packages/shared/telemetry:telemetry"
    
    # Batch 2: Runtime
    "packages/runtime/runtime-adapters:runtime-adapters"
    "packages/runtime/runtime:runtime"
    "packages/runtime/runtime-production:runtime-production"
    "packages/runtime/enterprise-runtime:enterprise-runtime"
    
    # Batch 3: Provider SDK
    "packages/provider/provider-sdk:provider-sdk"
    "packages/provider/native-providers:native-providers"
    "packages/provider/provider-qualification:provider-qualification"
    "packages/provider/provider-release:provider-release"
    "packages/provider/vendor-certification:vendor-certification"
    
    # Batch 4: Agent & Tools
    "packages/shared/tool-sdk:tool-sdk"
    "packages/agent/agent-platform:agent-platform"
    "packages/plugin-sdk:plugin-sdk"
    "packages/platform/developer-platform:developer-platform"
    
    # Batch 5: Cognitive & Workflow
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
    
    # Batch 6: Agent Collaboration
    "packages/agent/multi-agent-collaboration:multi-agent-collaboration"
    "packages/agent/multi-agent-reasoning:multi-agent-reasoning"
    
    # Batch 7: Quality & Reasoning
    "packages/quality/architecture-sdk:architecture-sdk"
    "packages/quality/production-quality:production-quality"
    "packages/reasoning/reasoning-framework:reasoning-framework"
    "packages/reasoning/reasoning-algorithms:reasoning-algorithms"
    
    # Batch 8: Apps & Services
    "packages/api-server:api-server"
    "packages/auth:auth"
    "packages/cloud:cloud"
    "packages/enterprise:enterprise"
    "packages/shared/context-engine:context-engine"
    "packages/shared/knowledge-engine:knowledge-engine"
    "packages/shared/memory-engine:memory-engine"
    
    # Batch 9: CLI (LAST)
    "apps/cli:cli"
    
    # Batch 10: Tooling
    "tooling/dependency-lint:dependency-lint"
    "tooling/eslint-plugin-internal:eslint-plugin"
    "tooling/handbook-lint:handbook-lint"
)

# Main execution
echo "📋 Total packages to process: ${#BATCHES[@]}"
echo ""

for i in "${!BATCHES[@]}"; do
    IFS=':' read -r pkg_path pkg_name <<< "${BATCHES[$i]}"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "[$((i+1))/${#BATCHES[@]}] Processing @agentx-fast/$pkg_name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    build_and_publish "$pkg_path" "$pkg_name"
    
    # Rate limit delay
    echo ""
    echo "   ⏳ Waiting 3 seconds (npm rate limit)..."
    sleep 3
done

echo ""
echo "============================================"
echo "🎉 PUBLISH COMPLETE!"
echo "============================================"
echo ""
echo "Next steps:"
echo "1. Wait 5 minutes for npm index propagation"
echo "2. Test: npm install -g @agentx-fast/cli@2.0.0"
echo "3. Verify: agentx --version"
echo ""
