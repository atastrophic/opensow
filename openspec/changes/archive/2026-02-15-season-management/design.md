## Context

Garden setup (feature #1) is complete. Gardens have identity, location, and growing spaces. There is no concept of time or growing cycles yet. Season management introduces the temporal container that all planting workflows depend on — guided planting, direct planting, and season planning all require an active season to operate within.

The codebase follows established patterns: `Storage` namespace for persistence with key-path arrays, `BusEvent.define` for domain events, `Tool.define` for agent tools, and Zod schemas for validation. Season management follows these same patterns.

## Goals / Non-Goals

**Goals:**

- Introduce a season entity with active/archived lifecycle tied to a garden
- Enforce one-active-season-per-garden invariant at the persistence layer
- Support perennial migration between seasons
- Provide a subagent that warns before archiving and guides season creation
- Keep plant references minimal (id, name, perennial) — full plant data deferred to `crop-data` (#3)

**Non-Goals:**

- Full plant/crop data model (deferred to `crop-data`)
- Planting schedules or task generation (deferred to `guided-planting` and `season-planner`)
- Season deletion (archived seasons are permanent records)
- Multi-year seasons or seasons spanning calendar year boundaries

## Decisions

### 1. Storage key structure: `["season", gardenId, seasonId]`

Seasons are scoped to a garden. Using `["season", gardenId, seasonId]` allows listing all seasons for a garden via `Storage.list(["season", gardenId])` without scanning unrelated data.

**Alternative considered:** `["garden", gardenId, "season", seasonId]` — nesting under the garden key. Rejected because it couples season storage to garden storage and complicates `Storage.list` prefix scanning (would need to filter by subpath).

### 2. Archive-on-create enforced in SeasonStorage.create

The one-active-season invariant is enforced in `SeasonStorage.create`, not in the tool or agent layer. When a new season is created, the storage layer finds and archives any existing active season for that garden before writing the new one. This keeps the invariant in one place.

**Alternative considered:** Enforce in the tool layer and keep storage "dumb". Rejected because it splits the invariant across layers — a direct `SeasonStorage.create` call could violate it.

### 3. Plant references are a simple array on the season object

Plant references live as an array field on the season schema: `plants: [{ id, name, perennial }]`. No separate storage entity for plant references.

**Alternative considered:** Separate storage for plant references with foreign key to season. Rejected as over-engineering for a minimal reference type — the full plant entity comes in `crop-data`.

### 4. Migration function takes explicit plant IDs

`migrate(gardenId, plantIds)` accepts a list of source plant reference IDs to copy. The function filters to only perennial plants from those IDs. This supports both "migrate all perennials" (pass all IDs) and "user picks subset" (pass selected IDs) without separate code paths.

### 5. Season namespace mirrors Garden namespace

`src/season/season.ts` exports the `Season` namespace with Zod schemas (`Info`, `Plant`) and `Event` definitions. `src/season/storage.ts` exports `SeasonStorage` namespace with CRUD + `active` + `migrate`. This mirrors the Garden pattern exactly.

### 6. Three tools, not CRUD

Tools are `season-start`, `season-list`, and `season-migrate`. There is no `season-update` or `season-delete` tool — the agent doesn't need direct mutation of seasons (plant additions come through future planting tools), and archived seasons are immutable.

### 7. Agent warns via prompt instructions, not code guards

The archive warning is handled by the agent's prompt instructions, not by a code-level confirmation gate. The prompt tells the agent to check for an active season, inform the user, and confirm before calling `season-start`. This is consistent with how the garden-setup agent works — behavior is prompt-driven.

**Alternative considered:** A two-step tool (check → confirm → create). Rejected because the LLM agent naturally handles conversational confirmation; adding a code gate adds complexity without benefit.

## Risks / Trade-offs

- **Race condition on archive-on-create**: If two `season-start` calls happen concurrently for the same garden, both could read "no active season" and create two active seasons. Mitigation: `Storage.update` uses file locks, and the create function reads + archives + writes sequentially. Concurrent CLI sessions are unlikely for a single-user gardening tool.

- **Plant reference duplication**: Migrated perennials get new UUIDs, so there's no link back to the source plant reference. This is intentional — seasons are independent snapshots. If cross-season plant tracking is needed later, `crop-data` can introduce a stable plant identity.

- **Prompt-driven warning is not enforced**: The agent _should_ warn before archiving but nothing prevents it from calling `season-start` directly. This is acceptable — the tool layer correctly archives regardless, and the agent prompt is the right place for UX behavior.
