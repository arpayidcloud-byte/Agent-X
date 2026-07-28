#!/bin/bash
set -e

echo "🔒 AgentX Security Scan"
echo "======================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# 1. Dependency Security Scan
echo "📦 Step 1: Dependency Security Scan (npm audit)"
echo "------------------------------------------------"
if pnpm audit --audit-level=high; then
    echo -e "${GREEN}✅ No high/critical vulnerabilities found${NC}"
else
    echo -e "${RED}❌ High/critical vulnerabilities detected${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 2. SAST with ESLint security plugin
echo "🔍 Step 2: Static Application Security Testing (SAST)"
echo "------------------------------------------------------"
if command -v eslint &> /dev/null; then
    # Run ESLint with security focus
    if pnpm lint 2>&1 | grep -i "security\|vulnerability\|injection\|xss" > /dev/null; then
        echo -e "${RED}❌ Security issues found in code${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}✅ No obvious security issues in code${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  ESLint not found, skipping SAST${NC}"
fi
echo ""

# 3. Secret Detection
echo "🔑 Step 3: Secret Detection"
echo "---------------------------"
SECRET_PATTERNS=(
    "api_key\s*[=:]\s*['\"][^'\"]{20,}['\"]"
    "password\s*[=:]\s*['\"][^'\"]+['\"]"
    "secret\s*[=:]\s*['\"][^'\"]+['\"]"
    "AWS[A-Z0-9_]{10,}"
    "AKIA[0-9A-Z]{16}"
    "ghp_[a-zA-Z0-9]{36}"
    "sk-[a-zA-Z0-9]{20,}"
)

SECRETS_FOUND=0
for pattern in "${SECRET_PATTERNS[@]}"; do
    if grep -r --include="*.ts" --include="*.js" --include="*.json" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git -E "$pattern" . 2>/dev/null | grep -v ".env.example" | grep -v "test" > /dev/null; then
        echo -e "${RED}❌ Potential secret found matching pattern: $pattern${NC}"
        SECRETS_FOUND=1
        ERRORS=$((ERRORS + 1))
    fi
done

if [ $SECRETS_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ No hardcoded secrets detected${NC}"
fi
echo ""

# 4. Check for console.log in production code
echo "📝 Step 4: Production Code Quality Check"
echo "-----------------------------------------"
CONSOLE_LOGS=$(find packages -name "*.ts" -not -path "*/test*" -not -path "*/node_modules/*" -exec grep -l "console\.log" {} \; 2>/dev/null | wc -l)
if [ "$CONSOLE_LOGS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $CONSOLE_LOGS file(s) with console.log in production code${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ No console.log in production code${NC}"
fi
echo ""

# 5. Check for hardcoded localhost
echo "🌐 Step 5: Hardcoded URL Check"
echo "------------------------------"
LOCALHOST_COUNT=$(find packages -name "*.ts" -not -path "*/test*" -not -path "*/node_modules/*" -exec grep -l "localhost\|127\.0\.0\.1" {} \; 2>/dev/null | wc -l)
if [ "$LOCALHOST_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $LOCALHOST_COUNT file(s) with hardcoded localhost URLs${NC}"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✅ No hardcoded localhost URLs${NC}"
fi
echo ""

# Summary
echo "======================"
echo "📊 Security Scan Summary"
echo "======================"
echo -e "Errors:   ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ Security scan FAILED${NC}"
    echo "Please fix the security issues above before proceeding."
    exit 1
else
    echo -e "${GREEN}✅ Security scan PASSED${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found - review recommended${NC}"
    fi
    exit 0
fi
