---
name: /spec-quick
description: Quickly generate technical design docs: skip spec.md and proposal.md, go directly to design.md and tasks.md
---
<!-- SGFESPEC:START -->
**Guardrails**
- Favor straightforward, minimal implementations first and add complexity only when it is requested or clearly required.
- Keep changes tightly scoped to the requested outcome.
- Refer to `spec/AGENTS.md` (located inside the `spec/` directory—run `ls spec` or `sgfespec update` if you don't see it) if you need additional OpenSpec conventions or clarifications.
- Language: All generated documents and AI responses MUST be in Chinese (简体中文)
- Identify any vague or ambiguous details and ask the necessary follow-up questions before editing files.
- Process integrity: Step 3 (requirement scope confirmation) and Step 9 (design.md confirmation) are mandatory interaction gates — you MUST present the summary and wait for explicit user approval before proceeding. Never skip ahead to generation or implementation without user confirmation at these checkpoints.

**Knowledge References**
Before proceeding, consult the knowledge index table in the project root `AGENTS.md`. Based on the "何时读取" column and the nature of this task, read the relevant knowledge files under `spec/knowledge/`.

## Phase Detection

Based on user input, determine which phase to enter:

**Document Generation Phase** (Steps 1-11):
- User provides PRD document link (Xuecheng/KM URL)
- User provides API documentation link
- User mentions "生成设计文档", "生成 design.md", "写 tasks.md" etc.

**Implementation Phase** (Steps 12-17):
- User provides UI screenshots/prototype images
- User mentions "生成代码", "实现", "开发", "写代码" etc.
- User mentions existing change-id or asks to continue implementation
- `design.md` and `tasks.md` already exist for the change

**Detection Rules:**
1. If user input matches Document Generation conditions → Enter Document Generation Phase
2. If user input matches Implementation conditions → Enter Implementation Phase (with prerequisite check)
3. If unclear, ask user which phase they want to proceed with

Proceed directly without confirmation after detection.

**Steps**

Execute the following steps (track as TODOs):

## Document Generation Phase

### 1. Collect Inputs

**Required Inputs:**
- PRD document link (Xuecheng/KM document link)
- API documentation link (Xuecheng/KM document link)

**Optional Inputs:**
- Prototype/design mockups (user pastes images)
- Supplementary documentation

**Input Validation:**
- If user doesn't provide PRD document link, ask and wait for user to provide
- If user doesn't provide API documentation link, ask and wait for user to provide

### 2. Read Document Content

**Read the PRD and API document content from the URLs provided by the user.**

**Extract key information based on document type:**

**PRD Extraction Points:**
- Background: 1-2 sentences summarizing why this feature is needed
- Feature List: Key functionality points
- Page Distribution: List pages by terminal (PC/App/PDA)
- Business Rules: Key constraints and rules

**API Extraction Points:**
- API Overview: Name, method, path, purpose (table format)
- Key Data Structures: TypeScript interface definitions
- Enum/Status Definitions: All enum values with meanings
- Mark missing APIs as "⚠️ Missing API, to be added"

**Extraction Principles:** Be concise, preserve key details (enums, types, rules), mark uncertainties with "⚠️ To be confirmed"

### 3. Confirm Requirement Scope (Interactive)

**Step 3.1: Code scan to verify scenario**

Scan codebase to check if pages mentioned in PRD already exist (search page files, routes, etc.)

**Step 3.2: Present to user for confirmation**

1. **Why**: 1-2 sentences on background & goals

2. **What Changes**: List pages by terminal (PC/App/PDA), mark scenario for each page:
   | Page | Scenario | Existing Path | Changes |
   | -- | -- | -- | -- |
   | xxx list page | 🆕 New | - | [full page functionality] |
   | yyy edit page | 🔄 Iteration | `src/pages/yyy/edit/` | [incremental: add xx field, modify xx logic] |

   **Scenario criteria:**
   - 🆕 New: Code scan found no matching files, PRD describes a brand new page
   - 🔄 Iteration: Code scan found existing files at `<path>`, PRD describes modifications

3. **Impact**: Affected code directories and dependencies

**Only proceed after user confirms.** This replaces proposal.md generation.

### 4. Generate change-id

Automatically generate change-id based on requirement content:
- Use kebab-case naming
- Start with verb (add-, update-, remove-, refactor-)
- Concise and descriptive
- Ensure uniqueness (run `sgfespec list` to check)

Examples:
- `add-store-management`
- `update-inventory-query`
- `refactor-order-process`

### 5. Create Directory Structure

```bash
mkdir -p spec/changes/<change-id>
```

### 6. Get Technical Choice Knowledge

Ask user if they have technical choice documentation or knowledge. If user doesn't provide:

Based on terminals identified in scope confirmation (PC/App/PDA), invoke MCP Tool:

```typescript
getTechnicalChoiceKnowledge({ terminal: "PC" }) // or "App" or "PDA"
```

### 7. Systematic UI Image Analysis (if available)

If user provides prototype/design mockups, read and follow `<skills-dir>/spec-analyze-ui-images/SKILL.md` for systematic analysis.

### 8. Generate design.md

**design.md Generation Rules**

Read `spec/templates/design-template.md` for the output skeleton, then follow these rules:

Combine PRD requirements, API documentation, and technical choice knowledge. First outline the modules (functional scenario-related pages), then explain each page's technical implementation.

Processing API Information:
- Extract API functionality, URL, request method, and input/output parameters
- Use EARS (Easy Approach to Requirements Syntax) to describe the relationship between interaction scenarios and API calls
- Define complete API request and response interfaces using TypeScript (include all parameters)
- If an interaction scenario is identified as missing an API, mark it as "⚠️ 缺少接口，待补充"

### 9. Confirm design.md

After generating design.md:
1. Present the core content of design.md to user (module overview, page list, key API mappings)
2. Ask user to verify if the content is correct
3. If user requests modifications, update design.md accordingly
4. **Only proceed to tasks.md generation after user confirms design.md is correct**

This checkpoint reduces rework risk — if design.md has issues, fixing them here is much cheaper than regenerating everything later.

### 10. Generate tasks.md

**tasks.md Generation Rules**

Read `spec/templates/tasks-template.md` for the output skeleton, then follow these rules:

Break down tasks based on technical implementation from `design.md`. One page per section, including key technical details: files/directories, TS type identifiers, API URLs, libraries, components (with key props), functions, etc.

For page generation tasks, follow these steps:
1) Create file structure: list file paths to be created
2) Implement TS definitions & API requests: list type identifiers, API URLs
3) Implement UI & business logic by area: break down by page areas, list components, key props, functions, key logic to implement, etc.
4) Create Mock data
5) Configure routes: specify route file location

`tasks.md` should NOT include integration, testing, or debugging steps.

### 11. Confirm and Output

After generation:
1. Inform user files are generated in `spec/changes/<change-id>/` directory
2. List generated file checklist
3. Prompt user to review if content meets expectations
4. **Do not execute** `sgfespec validate` (because there are no spec deltas)

## Implementation Phase

**Prerequisite Check:**
Before starting implementation, verify:
1. Identify the change-id (from user input or ask user)
2. Check if `spec/changes/<change-id>/design.md` exists
3. Check if `spec/changes/<change-id>/tasks.md` exists

If either file is missing:
- Ask user: "design.md/tasks.md 尚未生成，是否需要先生成文档？"
- If user agrees → Switch to Document Generation Phase
- If user declines → Proceed with implementation (user may have own docs)

After design.md and tasks.md are confirmed, proceed with implementation:

### 12. Ask for Additional Materials
Ask user if there are any **additional documentation materials** (e.g., design screenshots, development docs) to supplement

### 13. Analyze UI Images (if available)
If user-provided UI screenshots are available, invoke the `spec-analyze-ui-images` skill (refer to `<skills-dir>/spec-analyze-ui-images/SKILL.md`) to systematically analyze UI images and extract key information about terminal, layout, components, interactions, content, and states

### 14. Get Page Generation Knowledge
Ask the user to provide page generation knowledge (via documentation, MCP Tool, or any other form). Only if the user does not provide it, invoke `generatePage` Tool based on platform and page type to get page-level knowledge

### 15. Invoke Component-level MCP Tools
Read `spec/knowledge/project.md` section "组件库与 MCP 工具" for the component library to MCP tool mapping, then query the appropriate tool for finer-grained component details.

### 16. Implement Tasks Sequentially
Complete tasks in order per `tasks.md`. For multiple pages, generate one at a time and confirm before proceeding

### 17. Confirm and Update Checklist
- Ensure every item in `tasks.md` is finished before updating statuses
- After all work is done, set every task to `- [x]` so the list reflects reality

**Reference — Differences from Full Workflow**

| Step | Full Workflow | Quick Workflow |
|------|---------------|----------------|
| Scope Confirmation | proposal.md file | Interactive dialog (no file generated) |
| spec.md | Must generate | **Skip** |
| research.md | Optional (research clarification) | **Skip** |
| design.md | Full generation | Full generation |
| design.md confirmation | Confirm before tasks.md | Confirm before tasks.md (same) |
| tasks.md | Full generation | Full generation |
| Consistency check | Optional | **Skip** |
| validate command | Must execute | **Skip** (no spec deltas) |
| Implementation Phase | Separate apply command | Included in quick workflow |

**Reference:** See `spec/AGENTS.md` for full workflow and `spec/knowledge/project.md` for project conventions.
<!-- SGFESPEC:END -->
