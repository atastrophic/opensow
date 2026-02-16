# opensow agent guidelines

## Mission

OpenSow is a CLI gardening agent. It helps gardeners plan and manage their gardening journey by turning goals, constraints, and seasonal context into clear plans, schedules, and checklists.

## Grounding

- Ask for missing context only when truly blocked; otherwise infer and proceed.
- Prefer practical, low-risk guidance. Highlight safety, legal, or climate caveats when needed.
- When in doubt, provide choices and trade-offs (e.g., direct sow vs. transplant, organic vs. synthetic inputs).

## Planning Inputs

- Location or climate zone, first/last frost dates, and seasonal timing
- Available space, sun exposure, and irrigation access
- Crop goals, experience level, and budget
- Soil type, amendments, and pest history

## Output Style

- Actionable plans with dates or time windows
- Clear task lists (seed, prep, plant, maintain, harvest)
- Short rationale for key decisions
- Keep instructions concise and free of jargon unless requested

## Repo Workflow

- The default branch in this repo is `dev`.
- To regenerate the JavaScript SDK, run `./packages/sdk/js/script/build.ts`.
- To build and install the CLI binary locally, run `bun run packages/opensow/script/install-local.ts`. This builds the binary for the current platform and symlinks it to `~/.local/bin/opensow`.
- ALWAYS USE PARALLEL TOOLS WHEN APPLICABLE.

## Engineering Style

- Keep things in one function unless composable or reusable
- Avoid unnecessary destructuring. Instead of `const { a, b } = obj`, use `obj.a` and `obj.b` to preserve context
- Avoid `try`/`catch` where possible
- Avoid using the `any` type
- Prefer single word variable names where possible
- Use Bun APIs when possible, like `Bun.file()`
- Rely on type inference when possible; avoid explicit type annotations or interfaces unless necessary for exports or clarity

### Avoid let statements

We don't like `let` statements, especially combined with if/else statements.
Prefer `const`.

Good:

```ts
const foo = condition ? 1 : 2
```

Bad:

```ts
let foo

if (condition) foo = 1
else foo = 2
```

### Avoid else statements

Prefer early returns or using an `iife` to avoid else statements.

Good:

```ts
function foo() {
  if (condition) return 1
  return 2
}
```

Bad:

```ts
function foo() {
  if (condition) return 1
  else return 2
}
```

### Prefer single word naming

Try your best to find a single word name for your variables, functions, etc.
Only use multiple words if you cannot.

Good:

```ts
const foo = 1
const bar = 2
const baz = 3
```

Bad:

```ts
const fooBar = 1
const barBaz = 2
const bazFoo = 3
```

## Testing

You MUST avoid using `mocks` as much as possible.
Tests MUST test actual implementation, do not duplicate logic into a test.

## OpenSpec Workflow

This project uses [fission-ai/openspec](https://github.com/fission-ai/openspec) for structured feature development.

- All features from `project.md` are implemented as separate OpenSpec changes
- Each change follows the step-by-step workflow: `/opsx-new` -> `/opsx-continue` (proposal -> specs -> design -> tasks) -> `/opsx-apply` -> `/opsx-verify` -> `/opsx-archive`
- Progress is tracked in the Implementation Tracking table in `project.md`
- When resuming work across sessions, check `project.md` for the current feature and its OpenSpec phase, then use the appropriate `/opsx-*` command to continue
- Code for all gardening features lives in `packages/opensow`
- Feature order and dependencies are defined in `project.md`

### Important: One feature at a time

- Each OpenSpec change MUST be self-contained: it defines its own data model, persistence, and agent logic
- Do NOT create cross-cutting changes like "core-data-model" or "shared-infrastructure" that span multiple features
- Data structures and persistence emerge incrementally with the feature that needs them
- Only work on ONE change at a time. Complete the full lifecycle (new -> apply -> archive) before starting the next
- Later features build on prior ones by importing their types and functions, not by relying on a shared upfront design
