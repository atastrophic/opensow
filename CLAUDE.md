# OpenSow

AI-powered CLI gardening agent, forked from [opencode](https://github.com/sst/opencode). Helps gardeners plan and manage their gardens by turning goals, constraints, and seasonal context into plans, schedules, and checklists. Currently a CLI/TUI tool with a planned migration to a web-based interface.

- **License:** MIT
- **Default branch:** `dev`
- **Package manager:** Bun 1.3.5+
- **Repository:** https://github.com/anomalyco/opensow

## Tech Stack

| Layer      | Technology                               |
| ---------- | ---------------------------------------- |
| Runtime    | Bun 1.3.5+                               |
| Language   | TypeScript 5.8.2                         |
| Build      | Turborepo 2.5.6, Vite 7.1.4              |
| Frontend   | SolidJS 1.9.10, Tailwind CSS 4.1.11      |
| TUI        | OpenTUI (SolidJS-based terminal UI)      |
| Desktop    | Tauri 2.0                                |
| API Server | Hono 4.10.7                              |
| LLM        | Vercel AI SDK 5.0.119 (20+ providers)    |
| Schemas    | Zod 4.1.8                                |
| Testing    | Playwright (E2E), Bun test runner (unit) |
| Formatting | Prettier (semi: false, printWidth: 120)  |
| Editor     | 2-space indent, LF line endings, UTF-8   |

## Monorepo Structure

```
packages/
  opensow/        Core CLI, agent engine, Hono API server (main package)
  app/            Shared web UI (SolidJS + Tailwind)
  desktop/        Native Tauri desktop app wrapper
  ui/             Reusable UI component library
  plugin/         Plugin SDK (@opensow-ai/plugin)
  sdk/js/         JavaScript SDK for API integration
  util/           Shared utilities and types
  script/         Build and automation scripts
  function/       Cloudflare Workers functions
  console/        Web console application
  enterprise/     Enterprise features
  web/            Marketing and docs website (Astro)
  slack/          Slack integration
  docs/           Documentation
  extensions/     IDE extensions
  identity/       Identity/auth service
```

### Core Package Modules (`packages/opensow/src/`)

```
agent/       Agent configuration, permissions, execution
server/      Hono REST API with WebSocket support
session/     Session management, history, threading
tool/        20+ tools (bash, read, write, edit, glob, grep, websearch...)
provider/    LLM provider integration and model management
permission/  Granular permission system (allow/deny/ask)
cli/         CLI interface (yargs) + TUI code
project/     Worktree and filesystem management
mcp/         Model Context Protocol server support
lsp/         Language Server Protocol integration
plugin/      Plugin system for extensions
auth/        OAuth and API key management
config/      Configuration file handling
```

## Common Commands

```bash
# Setup
bun install

# Development (runs TUI in packages/opensow)
bun dev
bun dev <directory>          # Run against specific directory
bun dev .                    # Run against repo root

# API server (default port 4096)
bun dev serve
bun dev serve --port 8080

# Web UI (requires running server first)
bun run --cwd packages/app dev

# Desktop app (requires Rust/Tauri prerequisites)
bun run --cwd packages/desktop tauri dev

# Typecheck
bun turbo typecheck

# Tests
bun test                                   # Unit tests (from package dir)
bun run --cwd packages/app test            # App E2E tests

# Build standalone binary
./packages/opensow/script/build.ts --single

# Regenerate JavaScript SDK
./packages/sdk/js/script/build.ts
```

## Engineering Style

These conventions are enforced throughout the codebase, see [AGENTS.md](./AGENTS.md) for more detail:

- **`const` over `let`** — use ternary operators or early returns instead of mutable variables
- **No `else`** — prefer early returns or IIFE patterns
- **No destructuring** — use `obj.a` and `obj.b` to preserve context, not `const { a, b } = obj`
- **No `try/catch`** — handle errors explicitly where possible
- **No `any` type** — rely on type inference; only annotate when necessary for exports or clarity
- **Single-word names** — prefer concise identifiers; multi-word only when unavoidable
- **Bun APIs** — use `Bun.file()`, `Bun.Glob()`, etc. over Node equivalents
- **Single function** — keep logic in one function unless breaking it out adds clear reuse
- **Parallel tools** — always use parallel tool invocations when applicable

## Testing

See [AGENTS.md](./AGENTS.md) for testing guidelines.

- **No mocks** — test actual implementations, do not duplicate logic into tests
- **E2E tests:** `packages/app/e2e/` (Playwright)
- **Unit tests:** `*.test.ts` files alongside source in package directories
- Do not run tests from root (`bun test` from within the specific package directory)

## Gardening Domain

OpenSow implements 6 specialized agents for garden management:

1. **Space Inventory** — catalog growing spaces (beds, containers, pots, indoor systems) with dimensions, sun exposure, soil conditions
2. **Plant Selection** — recommend plants by USDA zone, timing, spacing; track days to maturity, germination, companion compatibility
3. **Companion Planting & Layout** — square foot gardening grid methodology, beneficial/antagonistic pairings, container arrangements
4. **Frost Calendar & Timing** — coordinate with local frost dates, seed starting windows, hardening off periods
5. **Succession Planting** — schedule sequential plantings for continuous harvest, crop rotation, soil recovery
6. **Plan Generation** — produce dated markdown plans saved to filesystem as `garden-plans/YYYY/SEASON/`

All plans are human-readable markdown with git integration for version history.

## Adding a Native Agent

Native agents ship with OpenSow and are defined in two files:

### 1. Write the prompt file

Create `packages/opensow/src/agent/prompt/<agent-name>.txt` with the agent's system prompt as plain text (no frontmatter). This is the full instruction set the LLM receives.

### 2. Register in agent.ts

In `packages/opensow/src/agent/agent.ts`:

**a) Import the prompt** alongside the existing imports:

```ts
import PROMPT_MY_AGENT from "./prompt/my-agent.txt"
```

**b) Add an entry** to the `result` object inside `state()`, after the existing agents:

```ts
"my-agent": {
  name: "my-agent",
  description: "Short description for agent listing and discovery",
  color: "#HEXCOL",
  permission: PermissionNext.merge(
    defaults,
    PermissionNext.fromConfig({
      // deny everything, then allow what the agent needs
      "*": "deny",
      read: "allow",
      // ...
    }),
    user,
  ),
  prompt: PROMPT_MY_AGENT,
  options: {},
  mode: "primary",   // or "subagent"
  native: true,
},
```

### Agent fields reference

| Field         | Required | Values                               | Notes                                                             |
| ------------- | -------- | ------------------------------------ | ----------------------------------------------------------------- |
| `name`        | yes      | string                               | kebab-case, matches the key                                       |
| `description` | yes      | string                               | shown in agent list / picker                                      |
| `mode`        | yes      | `"primary"` / `"subagent"` / `"all"` | primary = top-level selectable, subagent = called by other agents |
| `native`      | yes      | `true`                               | marks it as built-in                                              |
| `prompt`      | yes      | imported `.txt`                      | the system prompt                                                 |
| `permission`  | yes      | `PermissionNext.Ruleset`             | use `PermissionNext.merge(defaults, ..., user)`                   |
| `options`     | yes      | `{}`                                 | extra config, usually empty                                       |
| `color`       | no       | hex string                           | TUI accent color                                                  |
| `hidden`      | no       | boolean                              | hide from agent picker (e.g. compaction, title)                   |
| `model`       | no       | `{ providerID, modelID }`            | lock to a specific model                                          |
| `temperature` | no       | number                               | override sampling temperature                                     |
| `steps`       | no       | number                               | max agentic iterations                                            |

### Permission pattern

Start restrictive (`"*": "deny"`) and allowlist only what the agent needs. Common permissions: `read`, `glob`, `grep`, `edit`, `bash`, `question`, `webfetch`, `websearch`, `external_directory`. Use `Truncate.DIR` / `Truncate.GLOB` for external directory access.

### Custom (non-native) agents

Users can also create agents as markdown files in `.opensow/agent/<name>.md` with YAML frontmatter (`description`, `color`, `mode`, `model`, `tools`). These are loaded by `Config.loadAgent()` via `Bun.Glob("{agent,agents}/**/*.md")` and merged into the agent registry at runtime. They do **not** require changes to `agent.ts`.

### Verify

Run `bun turbo typecheck --filter=opensow` after changes. The agent will appear in `opensow agent list` and the TUI agent picker.

## PR and Commit Conventions

**Commit/PR titles** follow conventional commits:

- `feat:` / `fix:` / `docs:` / `chore:` / `refactor:` / `test:`
- Optional scope: `feat(app):`, `fix(desktop):`, `chore(opensow):`

**PR requirements:**

- All PRs must reference an existing issue (`Fixes #123` or `Closes #123`)
- UI changes require before/after screenshots or videos
- Keep PRs small and focused
- No AI-generated walls of text in descriptions
