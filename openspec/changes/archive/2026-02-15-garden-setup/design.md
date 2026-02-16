## Context

OpenSow is a CLI agent built on `packages/opensow`. It already has a mature persistence layer (`Storage` namespace) using file-based JSON under `~/.local/share/opensow/storage/`, a tool system (`Tool.define`), agent definitions (`Agent` namespace with `.txt` prompts), and an event bus (`Bus`/`BusEvent`). This change adds the first domain entity (Garden) and a conversational setup agent, building on all of these existing patterns.

## Goals / Non-Goals

**Goals:**

- Garden entity type definitions using Zod schemas
- CRUD persistence for gardens using the existing `Storage` namespace pattern
- Growing space types with type-specific attributes (beds, pots, trays)
- A garden-setup subagent with tool-based interactions
- Gallon estimation for pots, cell size estimation for trays

**Non-Goals:**

- Season, plant, or crop data models (later changes)
- Main orchestrator agent (gartenmeister routing logic is a later change)
- USDA zone lookup API integration (agent uses LLM knowledge to confirm zone from zipcode; no external API call)
- UI/TUI components for garden setup (agent is conversational)

## Decisions

### 1. Persist gardens via `Storage` namespace

Use the existing `Storage.write/read/update/remove/list` API with key prefix `["garden", gardenId]`. This keeps gardens alongside sessions, todos, and other entities in `~/.local/share/opensow/storage/garden/`.

**Alternative considered:** Separate `~/.opensow/data/gardens/` directory with raw `Bun.file()`/`Bun.write()`. Rejected because the project already has a battle-tested storage layer with locking, migrations, and consistent path handling. No reason to introduce a parallel persistence mechanism.

### 2. Single file per garden (spaces embedded)

A garden JSON file contains its spaces array inline. No separate files for spaces. Spaces are identified by UUID within the garden document.

**Rationale:** Spaces are always accessed in the context of their garden. Splitting them into separate files would add complexity (cross-file consistency, listing joins) for no benefit at this scale. A garden with 20 spaces is still a tiny JSON document.

### 3. Zod schemas for all types

Define garden and space schemas using Zod in `src/garden/garden.ts`. This gives runtime validation, type inference, and consistency with the rest of the codebase (tool params, config, events all use Zod).

### 4. Garden-setup agent as a registered subagent

Define the garden-setup agent in `src/agent/agent.ts` alongside the existing agents (research, explore, etc.) with `mode: "subagent"`. Its prompt lives in `src/agent/prompt/garden-setup.txt`.

**Alternative considered:** Standalone agent file. Rejected because all built-in agents are defined together in `Agent`'s `state()` function, and the registration pattern is already established there.

### 5. Tools for the garden-setup agent

Define three tools in `src/tool/`:

- `garden-create.ts` — create a garden with location data, returns the garden id
- `garden-space-add.ts` — add a space to an existing garden
- `garden-list.ts` — list all gardens

These follow the existing `Tool.define(id, { description, parameters, execute })` pattern. The agent calls these tools during conversation rather than generating raw JSON.

### 6. Gallon and cell size estimation as pure functions

Gallon estimation (from pot diameter + depth) and cell size estimation (from cell count) are pure functions in `src/garden/garden.ts`, not tools. They are called within the tool execute functions.

**Rationale:** These are deterministic calculations, not agent decisions. Keeping them as functions avoids unnecessary tool-call overhead.

### 7. ID generation

Use `crypto.randomUUID()` for garden and space IDs. The project already uses ULIDs for some entities, but UUIDs are simpler and sufficient here — gardens don't need time-ordered sorting.

### 8. Bus events for garden mutations

Define `Garden.Event.Created`, `Garden.Event.Updated`, and `Garden.Event.Deleted` using `BusEvent.define()`. This allows the TUI or other listeners to react to garden changes.

## Risks / Trade-offs

- **[Single-file garden]** → Large gardens with many spaces could grow, but practically a garden will have <50 spaces. No risk at this scale.
- **[No external USDA API]** → The agent relies on LLM knowledge for zone/frost date confirmation. This is accurate for most US zipcodes but could be wrong for edge cases. Mitigation: agent always asks the user to confirm, and the user can override.
- **[Storage migration]** → Adding a new `garden` key prefix to Storage doesn't require a migration since it's a new entity type with no existing data.

## Open Questions

- None currently. The patterns are well established in the codebase.
