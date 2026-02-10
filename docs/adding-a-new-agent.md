# Adding a New Agent to OpenSow

There are two ways to add an agent: **via config/markdown files** (no code changes) or **as a built-in native agent** (code changes required).

---

## Method A: Config/Markdown File (No Code Changes)

This is the simplest approach. Create a markdown file and OpenSow picks it up automatically.

### Step 1: Create the Agent File

Place a `.md` file in one of these directories:

| Location | Scope |
|----------|-------|
| `~/.config/opensow/agent/<name>.md` | Global (all projects) |
| `<project>/.opensow/agent/<name>.md` | Project-specific |

The filename (minus `.md`) becomes the agent name. Nested paths are supported:
- `.opensow/agent/security/reviewer.md` → agent name: `security/reviewer`

### Step 2: Define Frontmatter + Prompt

```markdown
---
description: "When to use this agent — shown in agent picker and Task tool listing"
mode: subagent          # "primary" (Tab-cycleable), "subagent" (@mention only), or "all" (both)
model: anthropic/claude-sonnet-4-20250514   # optional model override
temperature: 0.3        # optional, 0-2
top_p: 0.9              # optional nucleus sampling
color: "#FF5733"        # optional hex color for TUI
steps: 20               # optional max agentic loop iterations
hidden: false           # optional, hides from agent picker if true
permission:
  read: allow
  edit: deny
  bash:
    "*": deny
    "npm *": allow
  webfetch: allow
  websearch: allow
---

You are a specialized agent for...

Your role is to research and analyze...
```

The markdown body below the frontmatter becomes the agent's **system prompt**, which replaces the default provider prompt entirely.

### Step 3: That's It

Restart OpenSow. The agent appears in the agent picker (if `mode: "primary"` or `"all"`) or via `@agent-name` mentions (if `mode: "subagent"` or `"all"`).

### Alternative: JSON Config

You can also define agents in `opensow.jsonc` (project root or `~/.config/opensow/`):

```jsonc
{
  "agent": {
    "my-researcher": {
      "description": "Deep research into topics",
      "mode": "subagent",
      "prompt": "You are a research specialist...",
      "temperature": 0.3,
      "model": "anthropic/claude-sonnet-4-20250514",
      "permission": {
        "read": "allow",
        "edit": "deny",
        "webfetch": "allow",
        "websearch": "allow"
      }
    }
  }
}
```

### Overriding Built-in Agents

You can override any built-in agent's properties via config:

```jsonc
{
  "agent": {
    "gartenmeister": {
      "temperature": 0.2,
      "prompt": "You are a careful, methodical assistant..."
    }
  }
}
```

### Disabling an Agent

```jsonc
{
  "agent": {
    "explore": { "disable": true }
  }
}
```

---

## Method B: Built-in Native Agent (Code Changes)

Use this when the agent needs special session-level behavior (e.g., mode switching, custom file management, synthetic message injection).

### Step 1: Define the Agent in `agent.ts`

**File**: `packages/opensow/src/agent/agent.ts`

Add a new entry to the `result` object inside the `state()` function:

```typescript
myagent: {
  name: "myagent",
  description: "Description shown in agent picker and Task tool listing.",
  options: {},
  permission: PermissionNext.merge(
    defaults,
    PermissionNext.fromConfig({
      question: "allow",
      // Add agent-specific permission overrides here
      edit: { "*": "deny" },          // deny all edits
      webfetch: "allow",              // allow web fetching
      websearch: "allow",             // allow web search
    }),
    user, // always include user overrides last
  ),
  mode: "primary",    // or "subagent" or "all"
  native: true,
  // Optional fields:
  // prompt: PROMPT_MY_AGENT,        // custom system prompt (import from .txt file)
  // temperature: 0.3,
  // hidden: true,                   // hide from agent picker
  // model: { providerID: "anthropic", modelID: "claude-sonnet-4-20250514" },
  // steps: 25,
},
```

### Step 2: Create a Prompt File (Optional)

If the agent needs a custom system prompt, create a `.txt` file:

**File**: `packages/opensow/src/agent/prompt/myagent.txt`

```text
You are a specialized agent for...

Your strengths:
- ...

Guidelines:
- ...
```

Then import and assign it in `agent.ts`:

```typescript
import PROMPT_MY_AGENT from "./prompt/myagent.txt"

// In the agent definition:
myagent: {
  // ...
  prompt: PROMPT_MY_AGENT,
}
```

> **Note**: If `prompt` is set, it completely replaces the model-specific provider prompt (e.g., `anthropic.txt`). If omitted, the agent uses the default provider prompt.

### Step 3: Add Custom Tools (Optional)

If the agent needs dedicated enter/exit tools (like the research agent), create tool definitions:

**File**: `packages/opensow/src/tool/myagent.ts`

```typescript
import { Tool } from "./tool"
import z from "zod"

export const MyAgentEnterTool = Tool.define("myagent_enter", {
  description: "Switch to myagent for specialized work",
  parameters: z.object({}),
  async execute(_params, ctx) {
    // Create a synthetic user message to switch agents
    // See tool/plan.ts for the full pattern
  },
})
```

Then register the tools in the tool registry:

**File**: `packages/opensow/src/tool/registry.ts`

Add to the `all()` function's return array:

```typescript
import { MyAgentEnterTool, MyAgentExitTool } from "./myagent"

// In the return array:
MyAgentEnterTool,
MyAgentExitTool,
```

And add the corresponding permission keys to the defaults in `agent.ts`:

```typescript
const defaults = PermissionNext.fromConfig({
  // ...existing defaults...
  myagent_enter: "deny",
  myagent_exit: "deny",
})
```

Then allow them on the appropriate agents:

```typescript
// On the gartenmeister agent (to allow entering):
gartenmeister: {
  permission: PermissionNext.merge(defaults, PermissionNext.fromConfig({
    myagent_enter: "allow",
  }), user),
}

// On myagent (to allow exiting):
myagent: {
  permission: PermissionNext.merge(defaults, PermissionNext.fromConfig({
    myagent_exit: "allow",
  }), user),
}
```

### Step 4: Add Session-Level Behavior (Optional)

If the agent needs synthetic messages injected during conversation (like the research agent's mode reminders):

**File**: `packages/opensow/src/session/prompt.ts`

Update the `insertReminders()` function to handle the new agent name:

```typescript
if (input.agent.name === "myagent") {
  userMessage.parts.push({
    id: Identifier.ascending("part"),
    messageID: userMessage.info.id,
    sessionID: userMessage.info.sessionID,
    type: "text",
    text: PROMPT_MY_AGENT_REMINDER,
    synthetic: true,
  })
}
```

### Step 5: Update TUI Agent Switching (Optional)

If the agent has enter/exit tools, update the TUI to auto-switch the agent picker:

**File**: `packages/opensow/src/cli/cmd/tui/routes/session/index.tsx`

```typescript
if (part.tool === "myagent_exit") {
  local.agent.set("gartenmeister")
  lastSwitch = part.id
} else if (part.tool === "myagent_enter") {
  local.agent.set("myagent")
  lastSwitch = part.id
}
```

### Step 6: Add a Session File Function (Optional)

If the agent needs to persist state to a file (like research saves findings to `.opensow/research/`):

**File**: `packages/opensow/src/session/index.ts`

```typescript
export function myagentFile(input: { slug: string; time: { created: number } }) {
  const base = Instance.project.vcs
    ? path.join(Instance.worktree, ".opensow", "myagent")
    : path.join(Global.Path.data, "myagent")
  return path.join(base, [input.time.created, input.slug].join("-") + ".md")
}
```

---

## Permission Reference

### Available Permission Keys

| Key | Type | Controls |
|-----|------|----------|
| `*` | action | Catch-all for everything |
| `read` | rule | File reading |
| `edit` | rule | File editing (also covers `write`, `patch`, `multiedit`) |
| `bash` | rule | Shell command execution (pattern matches the command) |
| `glob` | rule | File pattern searching |
| `grep` | rule | Content searching |
| `list` | rule | Directory listing |
| `task` | rule | Launching subagents (pattern matches agent name) |
| `external_directory` | rule | Accessing files outside project root |
| `webfetch` | action | Fetching web URLs |
| `websearch` | action | Web search |
| `codesearch` | action | Code search |
| `question` | action | Asking user questions |
| `todowrite` | action | Writing todo items |
| `todoread` | action | Reading todo items |
| `lsp` | rule | Language server protocol (experimental) |
| `doom_loop` | action | Doom loop detection |
| `<custom>` | rule | Any custom tool name (MCP tools, etc.) |

### Permission Actions

| Action | Effect |
|--------|--------|
| `"allow"` | Permitted without asking |
| `"deny"` | Blocked silently (tool removed from LLM if `pattern: "*"`) |
| `"ask"` | Prompts user for approval at runtime |

### Rule Format

```jsonc
// Simple (applies to all patterns):
"bash": "allow"

// Pattern-based (glob matching):
"bash": {
  "*": "deny",            // deny all commands by default
  "git *": "allow",       // allow git commands
  "npm test": "allow"     // allow npm test
}

"edit": {
  "*": "deny",            // deny all edits
  "*.md": "allow"         // allow editing markdown files
}
```

### Merge Order (last match wins)

1. Built-in defaults (`agent.ts`)
2. Agent-specific overrides (`agent.ts`)
3. User global permissions (`opensow.jsonc` top-level `permission`)
4. Config agent overrides (`opensow.jsonc` agent-level `permission`)
5. Session-level permissions (runtime)

Rules are evaluated **last-match-wins** — later rules override earlier ones for the same permission+pattern.

---

## Agent Modes Quick Reference

| Mode | Agent Picker (Tab) | `@mention` / Task Tool | Can Be Default |
|------|--------------------|------------------------|----------------|
| `primary` | Yes | No | Yes |
| `subagent` | No | Yes | No |
| `all` | Yes | Yes | Yes |

Set `hidden: true` to keep an agent functional but invisible in the picker.

---

## CLI Agent Generation

OpenSow can generate agent files via AI:

```bash
opensow agent create "A security-focused code reviewer that checks for vulnerabilities"
```

This calls `Agent.generate()` which uses an LLM to produce the agent identifier, description, and system prompt, then saves it as a markdown file.
