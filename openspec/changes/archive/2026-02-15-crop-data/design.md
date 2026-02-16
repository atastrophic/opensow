## Context

OpenSow currently tracks plants in seasons as lightweight references (`Season.Plant`: id, name, perennial flag). Downstream features — guided planting, direct planting, and season planner — need rich agronomic data for each plant (spacing, seed starting windows, transplant timing, harvest indicators, companions) to compute schedules and space allocation. The `project.md` defines a detailed JSON schema (lines 126-207) that every plant record must conform to.

Garden setup (#1) and season management (#2) are complete. Their patterns — `Storage` namespace for persistence, `Tool.define()` for tools, `BusEvent.define()` for events, subagent registration in `agent.ts` — are well established and will be reused here.

## Goals / Non-Goals

**Goals:**

- Define a `Crop` entity with Zod schemas mirroring the full plant database format from `project.md`
- Persist crop records scoped per season (storage key: `["crop", seasonId, cropId]`)
- Provide CRUD tools (create, read, list, remove) for crop records
- Register a `crop-data` subagent that uses LLM knowledge to populate the structured schema from a plant name, leveraging garden context (zone, frost dates) for timing fields

**Non-Goals:**

- No global/shared plant database — crops are always per-season snapshots
- No companion planting logic or schedule computation — those belong to `season-planner` (#7)
- No UI for browsing crops — the agent conversation is the interface
- No import/export of crop data from external sources

## Decisions

### 1. Crop records scoped per season, not per garden

**Decision:** Storage key `["crop", seasonId, cropId]`.

**Rationale:** A gardener may grow "Tomato" differently across years (different variety, adjusted spacing). Per-season scoping gives each season its own immutable snapshot. When a season is archived, its crop data freezes naturally.

**Alternative considered:** Per-garden keying with a season reference field. Rejected because it requires cleanup logic when seasons archive and complicates multi-year querying.

### 2. Flat schema sections as nested Zod objects

**Decision:** Model each section of the plant format (taxonomy, spacing, seed starting indoor, seed starting outdoor, potting up, transplanting, cultivation, harvest) as a separate Zod schema nested inside `Crop.Info`. Fields use camelCase matching the JSON format in `project.md`.

**Rationale:** Follows the existing `Garden.Info` / `Season.Info` pattern. Separate section schemas allow the subagent to populate incrementally and enable per-section validation. The schema is defined once in `src/crop/crop.ts` and shared by storage, tools, and agent.

**Alternative considered:** A single flat object with all fields at the top level. Rejected because 40+ fields become unwieldy and the JSON format already groups them logically.

### 3. Nullable sections for partial population

**Decision:** All sections except `name` and `id` are nullable at the `Crop.Info` level. The subagent populates them progressively.

**Rationale:** The LLM may not know every field for every plant (e.g., a rare variety's exact seed-saving method). Allowing nulls lets the agent store what it knows and flag gaps. The user can fill in missing data later.

### 4. Single `crop_create` tool handles full records

**Decision:** One `crop_create` tool accepts the complete `Crop.Info` schema. The subagent assembles the full record in one pass rather than using separate tools per section.

**Rationale:** The subagent fills in the schema from its knowledge in a single tool call. Multiple section-level tools would add unnecessary round trips. A `crop_list` tool returns summaries, and `crop_read` returns the full record.

**Alternative considered:** A `crop_upsert` tool that merges partial updates. Deferred — can be added later if needed.

### 5. Crop-data subagent with garden context in prompt

**Decision:** The `crop-data` subagent receives a prompt instructing it to use `garden_list` (to look up zone/frost dates) and `crop_create` to populate and store a crop record. It has permission for `garden_list`, `crop_create`, `crop_read`, `crop_list`, and `crop_remove`.

**Rationale:** The subagent needs garden context to fill in zone-relative timing fields (e.g., "sow 8-10 weeks before last frost"). Reading garden data gives it the zone and frost dates. It does not need season tools — the calling agent provides the season ID.

### 6. Season ID passed as tool parameter, not inferred

**Decision:** `crop_create`, `crop_list`, `crop_read`, and `crop_remove` all take an explicit `seasonId` parameter.

**Rationale:** Explicit is better than implicit. The calling agent (season-management or gartenmeister) knows which season is active and passes the ID. This avoids the crop subagent needing to call season tools.

## Risks / Trade-offs

**[LLM knowledge accuracy]** → The subagent fills crop data from its training knowledge, which may be imprecise for niche varieties. Mitigation: the prompt instructs the agent to flag low-confidence values and ask the user to confirm critical timing fields.

**[Large schema size]** → The full crop schema is ~40 fields across 8 sections. This uses significant tokens in tool definitions. Mitigation: section schemas keep it organized, and the tool description `.txt` file provides a concise summary rather than repeating every field.

**[No update tool]** → V1 only has create/remove, no partial update. If users want to tweak one field, they must remove and recreate. Mitigation: acceptable for MVP; an `crop_update` tool can be added in a follow-up.
