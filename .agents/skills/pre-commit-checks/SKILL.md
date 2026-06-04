---
name: pre-commit-checks
description: Run pre-commit checks (generate:lint, format, check-types) before committing. Use when the user asks to commit changes, or invokes /pre-commit-checks.
allowed-tools: Bash(yarn *), Bash(git *)
user-invocable: true
metadata:
  internal: true
---

# Agent Pre-Commit Checks

Run all required pre-commit checks from the monorepo root before committing to git. This ensures code quality by running type generation, linting, formatting, and tests.

## Steps

Run the following commands **sequentially** from the monorepo root. If any step fails, stop and fix the errors before proceeding.

1. **Lint**: yarn lint
2. **Format**: yarn format
3. **Check types**: check-types

If all checks pass, proceed with the commit. If any fail, report the errors to the user and fix them before committing.
