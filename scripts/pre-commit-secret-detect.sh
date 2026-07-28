#!/bin/bash
# scripts/pre-commit-secret-detect.sh
# Pre-commit hook for secret detection
# Prevents committing hardcoded secrets, API keys, passwords, etc.

set -e

echo "🔍 Running secret detection pre-commit check..."

# Patterns to detect
SECRET_PATTERNS=(
  "password\s*=\s*['\"][^'\"]+['\"]"
  "secret\s*=\s*['\"][^'\"]+['\"]"
  "api_key\s*=\s*['\"][^'\"]+['\"]"
  "apikey\s*=\s*['\"][^'\"]+['\"]"
  "token\s*=\s*['\"][^'\"]+['\"]"
  "AWS_SECRET_ACCESS_KEY\s*=\s*['\"][^'\"]+['\"]"
  "PRIVATE_KEY\s*=\s*['\"][^'\"]+['\"]"
)

FOUND_SECRETS=0

for pattern in "${SECRET_PATTERNS[@]}"; do
  # Search in staged files only
  STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null || echo "")
  
  if [ -n "$STAGED_FILES" ]; then
    for file in $STAGED_FILES; do
      # Skip test files and examples
      if [[ "$file" == *".test.ts"* ]] || [[ "$file" == *"test/"* ]] || [[ "$file" == *"example"* ]]; then
        continue
      fi
      
      # Check if file exists and is not binary
      if [ -f "$file" ] && file "$file" | grep -q "text"; then
        if grep -qE "$pattern" "$file" 2>/dev/null; then
          # Exclude process.env references
          if grep -E "$pattern" "$file" | grep -v "process.env" | head -1; then
            echo "❌ Potential secret found in: $file"
            echo "   Pattern: $pattern"
            echo "   → Use environment variables instead!"
            FOUND_SECRETS=1
          fi
        fi
      fi
    done
  fi
done

if [ $FOUND_SECRETS -eq 1 ]; then
  echo ""
  echo "🚫 Commit blocked: Potential secrets detected"
  echo "💡 Fix: Use process.env.VARIABLE_NAME instead of hardcoded values"
  echo ""
  exit 1
fi

echo "✅ No secrets detected - pre-commit check passed"
exit 0