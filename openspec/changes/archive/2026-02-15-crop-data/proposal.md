## Why

Seasons track plants as lightweight references (id, name, perennial flag) but have no place to store the rich agronomic data needed for planning — spacing, seed starting windows, transplant timing, harvest indicators, and more. Without structured crop data, downstream features (guided planting, direct planting, season planner) cannot compute planting schedules, space allocation, or companion groupings. This change introduces a full crop entity, persistence, and a dedicated subagent that populates crop records from LLM knowledge when plants are added.

## What Changes

- Introduce a `Crop` entity with the complete plant database schema: taxonomy & habit, spacing & dimensions, indoor seed starting, direct sow outdoors, potting up / transition, transplant outdoors, cultivation & maintenance, and harvest & seed saving.
- Persist crop records per season so each season owns its own snapshot of crop data (allows year-over-year tweaks without polluting a global database).
- Add CRUD tools for crops: create, read, list (by season), and remove.
- Add a `crop-data` subagent that the main agent (or other subagents) delegates to when a plant needs its full data populated. The subagent uses its horticultural knowledge to fill in the structured schema, confirms key values with the user when ambiguous, and stores the result.

## Capabilities

### New Capabilities

- `crop`: The crop entity schema — Zod schemas for all sections (taxonomy, spacing, seed starting indoor/outdoor, potting up, transplanting, cultivation, harvest) and the composite `Crop.Info` type. Includes Bus events for created/updated/removed.
- `crop-persistence`: Storage namespace for crop records keyed by season. CRUD operations: create, read, list, remove.
- `crop-agent`: Subagent that populates a crop record from a plant name, using LLM knowledge to fill the structured schema. Registered as a subagent accessible from season management and planting workflows.

### Modified Capabilities

_(none — the season plant reference stays as-is; crop data is a separate entity linked by season ID)_

## Impact

- **New source files**: `src/crop/crop.ts` (entity), `src/crop/storage.ts` (persistence), `src/tool/crop-*.ts` (tools), `src/agent/prompt/crop-data.txt` (agent prompt)
- **Modified files**: `src/tool/registry.ts` (register crop tools), `src/agent/agent.ts` (register crop-data subagent), `src/agent/prompt/gartenmeister.txt` (list crop-data in native agents)
- **Storage keys**: `["crop", seasonId, cropId]` — scoped per season
- **Dependencies**: Requires garden-setup (#1) for garden context (zone, frost dates used by the subagent to validate timing). Does not modify season entity or its persistence.
