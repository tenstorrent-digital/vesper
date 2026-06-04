---
name: planning-and-todos
description: Planning and task management using PLAN and TODO files for shared context between agent sessions
allowed-tools: Bash(linear *), Bash(gh *), Bash(git branch)
metadata:
  internal: true
---

## Overview

Plans are structured documents that outline implementation strategy for a feature or task. They serve as the source of truth for what needs to be done, and are used to generate actionable TODO files that agents can pick up and execute.

## File Naming

Plan and todo files follow this naming convention:

```
{LINEAR_ID}_PLAN.md
{LINEAR_ID}_TODO.md
```

- **LINEAR_ID**: The Linear issue identifier (e.g., `TT-202`)
- If the user doesn't provide a Linear issue ID:
  - Get the Linear ID from the git branch name: given `mackenzie/tt-202-add-skill`, the issue ID is `TT-202`
  - Use linear-cli to fetch Linear issues to suggest a Linear issue identifier to the user
  - Ask the user for the Linear ID
- If no Linear issue exists, use the fallback format: `{YYYY-MM-DD}_{FEATURE}_PLAN.md` (e.g., `2026-02-07_AUTH_REFACTOR_PLAN.md`)

## File Location

All plan and todo files live in:

```
.agents/plans/
```

## Plan Structure

A plan should include:

1. **Current State** — What exists today (context for the agent picking this up)
2. **Problems Identified** — What needs to change and why
3. **Proposed Changes** — Concrete implementation steps with code examples where helpful
4. **Implementation Priority** — Ordered by priority (P0 = do first, P3 = do last)

## Creating a TODO from a Plan

Once a plan is written, generate a TODO file so an agent can execute the work:

1. Read the plan file from `.agents/plans/{LINEAR_ID}_PLAN.md`
2. Create `.agents/plans/{LINEAR_ID}_TODO.md`
3. Break down each proposed change into discrete, actionable tasks
4. Each task should be checkable (`- [ ]`) and scoped to a single commit or logical change
5. Group tasks by priority level from the plan
6. Include file paths and brief descriptions so an agent can execute without re-reading the full plan

### TODO File Format

TODO.md files should use the following format template:

```markdown
# {LINEAR_ID}: {Title}

Plan: `.agents/plans/{LINEAR_ID}_PLAN.md`

## TODO

<!-- list of TODO tasks -->
```

## Workflow

1. **Create plan** → `.agents/plans/{LINEAR_ID}_PLAN.md`
2. **Generate TODO** → `.agents/plans/{LINEAR_ID}_TODO.md`
3. **Agent picks up TODO** → Checks off tasks as they're completed
4. **Handoff** → Another agent can resume by reading the TODO and continuing from the first unchecked item
