## Context

OpenSow has garden setup, season management, crop data, orchestration (gartenmeister), and guided planting features complete. Users who arrive knowing what they want to plant currently have no dedicated path — they must manually invoke crop-data or rely on the gartenmeister to improvise. Direct planting adds the structured "I know what I want" counterpart to guided planting's "I need ideas" flow.

The system already has all building blocks: GardenStorage for zone/frost data, SeasonStorage for active seasons, CropStorage for persisted crop records, and the crop-data subagent for populating agronomic records. Direct planting is primarily a new subagent prompt, a window tool, and a routing rule update.

## Goals / Non-Goals

**Goals:**

- Subagent that collects plants from the user and delegates to crop-data
- Two modes: full season planning vs. current planting window
- Window tool that computes planting categories from zone, frost dates, and current date
- Gartenmeister routing to direct-planting when user knows what to plant

**Non-Goals:**

- No automatic plant validation against zone compatibility (crop-data handles that)
- No quantity or bed assignment (that belongs to season-planner, feature #7)
- No succession planting logic (season-planner scope)

## Decisions

### Window tool returns categories, not specific plants

The window tool returns broad planting categories (indoor seed starting, direct sow cold-hardy, direct sow warm-season, transplant) based on weeks relative to frost dates. It does not recommend specific plants — that is the subagent prompt's job using the category context.

**Rationale:** Keeps the tool simple and deterministic. The LLM prompt uses the categories plus the user's plant choices to give specific timing advice. This avoids duplicating crop data logic in the tool.

**Alternative considered:** Returning a filtered list of plantable crops from the user's season. Rejected because the user hasn't added crops yet when the window tool is first called.

### Reuse recommend tool pattern for garden context

The window tool follows the same pattern as the recommend tool from guided-planting: read garden info, read active season, compute context, return formatted summary. No new storage abstractions needed.

### Single prompt covers both modes

Rather than two separate subagents for "full season" vs. "current window", a single prompt handles both with conditional instructions. The mode selection is just whether to call the window tool first.

**Rationale:** The plant collection loop is identical in both modes. Only the preamble differs.

## Risks / Trade-offs

- [Window calculation is approximate] → Uses weeks-relative-to-frost heuristics, not a precise regional database. Acceptable for v1 since the LLM prompt adds nuance.
- [No plant count limits] → User could add dozens of plants in one session. Acceptable since crop-data handles each individually and there is no session timeout.
