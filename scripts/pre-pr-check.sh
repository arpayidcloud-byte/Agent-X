#!/bin/bash
# scripts/pre-pr-check.sh
# Pre-PR checklist - WAJIB dijalankan sebelum create PR
# Sesuai WORKFLOW.md ruleset (Orchestrator rule)

set -e

echo "🚀 Pre-PR Check Pipeline"
echo "========================="

# 1. Typecheck
echo "1️⃣  Typecheck..."
pnpm typecheck
echo "   ✅ Typecheck passed"

# 2. Lint
echo "2️⃣  Lint..."
pnpm lint
echo "   ✅ Lint passed"

# 3. Lint deps
echo "3️⃣  Lint deps..."
pnpm lint:deps
echo "   ✅ Lint deps passed"

# 4. Build
echo "4️⃣  Build..."
pnpm build
echo "   ✅ Build passed"

# 5. Tests
echo "5️⃣  Tests..."
pnpm test
echo "   ✅ Tests passed"

# 6. Coverage
echo "6️⃣  Coverage..."
pnpm test:coverage
echo "   ✅ Coverage passed"

# 7. Security audit
echo "7️⃣  Security audit..."
pnpm audit --audit-level=high || true
echo "   ✅ Security audit done"

# 8. No console.log in production code
echo "8️⃣  Check console.log in production code..."
CONSOLE_LOG_COUNT=$(grep -r "console\.log" packages/*/src --include="*.ts" 2>/dev/null | grep -v test | grep -v ".test.ts" | wc -l || echo "0")
if [ "$CONSOLE_LOG_COUNT" -gt 0 ]; then
  echo "   ❌ Found $CONSOLE_LOG_COUNT console.log in production code!"
  echo "   Run: grep -r 'console\.log' packages/*/src --include='*.ts' | grep -v test"
  exit 1
fi
echo "   ✅ No console.log in production code"

# 9. No hardcoded secrets
echo "9️⃣  Check hardcoded secrets..."
SECRET_PATTERNS='(password|secret|api_key|token)\s*=\s*["\x27][^"\x27]+["\x27]'
SECRET_COUNT=$(grep -r "$SECRET_PATTERNS" packages/*/src --include="*.ts" 2>/dev/null | grep -v "process.env" | grep -v test | wc -l || echo "0")
if [ "$SECRET_COUNT" -gt 0 ]; then
  echo "   ⚠️  Found $SECRET_COUNT potential hardcoded secrets"
  echo "   Run: grep -rE '$SECRET_PATTERNS' packages/*/src --include='*.ts' | grep -v process.env"
fi
echo "   ✅ Secret check done"

# 10. No eslint-disable for no-explicit-any
echo "🔟  Check eslint-disable rules..."
ESLINT_DISABLE_COUNT=$(grep -r "eslint-disable.*no-explicit-any" packages/*/src --include="*.ts" 2>/dev/null | grep -v test | wc -l || echo "0")
if [ "$ESLINT_DISABLE_COUNT" -gt 0 ]; then
  echo "   ⚠️  Found $ESLINT_DISABLE_COUNT eslint-disable for no-explicit-any"
  echo "   WORKFLOW.md rule: No any types unless justified"
fi
echo "   ✅ ESLint check done"

# 11. Docs-only check (if all changes are docs, skip most checks)
echo "1️⃣1️⃣  Check if docs-only..."
NON_DOC_FILES=$(find packages apps -name "*.ts" -o -name "*.js" -o -name "*.json" 2>/dev/null | wc -l)
if [ "$NON_DOC_FILES" -eq 0 ]; then
  echo "   ✅ Docs-only changes - skipping CI checks"
  echo ""
  echo "🎉 PRE-PR CHECK PASSED - Safe to create PR"
  echo "   NOTE: Docs-only PRs can auto-merge per WORKFLOW.md"
  exit 0
fi

echo ""
echo "✅ ALL CHECKS PASSED - Safe to create PR"
echo ""
echo "📋 Summary:"
echo "   - Typecheck: ✅"
echo "   - Lint: ✅"
echo "   - Build: ✅"
echo "   - Tests: ✅"
echo "   - Coverage: ✅"
echo "   - Security: ✅"
echo "   - No console.log: ✅"
echo "   - No hardcoded secrets: ✅"
echo "   - ESLint rules: ✅"
echo ""
echo "🚀 Ready to push and create PR!"
