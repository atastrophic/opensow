## Context

The season-management agent already asks users whether they want "guided planting ideas" or "direct plant selection" after creating a season. Currently, "guided ideas" is a placeholder — it captures the preference but routes nowhere. The guided-planting subagent fills this gap.

Three prior features provide the foundation: gardens have zone/frost dates/spaces (garden-setup), seasons track plants (season-management), and crop-data populates full agronomic records. The gartenmeister routes to subagents via prompt rules (orchestration).

## Goals / Non-Goals

**Goals:**

- Implement the two-step quiz: gardener type (Chef/Parent/Homesteader) and engagement level (Low/Standard/High)
- Persist quiz answers on the season so they survive session boundaries
- Generate a curated recommendation list based on type + engagement + zone + date
- Let the user select which recommendations to add, then delegate to crop-data for each
- Register the subagent and wire it into gartenmeister routing

**Non-Goals:**

- Building a plant database — the LLM generates recommendations from its knowledge, filtered by zone and engagement
- Visual "cards" — this is a CLI agent, recommendations are text
- Changing the season-management flow — it already asks about planting approach; guided-planting is just the destination
- Implementing "recipe bundles" (e.g., "Grow a Salsa Garden") — that's a future enhancement

## Decisions

### Decision 1: Preferences stored on Season.Info, not separate storage

Add `gardenerType` and `engagement` as optional fields on `Season.Info`. This keeps the quiz answers co-located with the season they apply to and avoids a new storage key prefix.

**Alternative considered**: Separate `preference` storage key. Rejected — adds unnecessary indirection when the data is intrinsically scoped to a season.

### Decision 2: Recommend tool returns LLM-friendly text, not structured data

The `recommend` tool builds a prompt-like summary of the user's context (zone, frost dates, gardener type, engagement, date, spaces) and returns plant recommendations as formatted text. The LLM in the guided-planting subagent interprets the context and generates tailored suggestions.

**Alternative considered**: Hard-coded recommendation lists per type+engagement matrix. Rejected — too rigid, doesn't account for zone, date, or space constraints. The LLM's horticultural knowledge is the recommendation engine.

### Decision 3: Recommend tool reads context, subagent prompt drives suggestions

The recommend tool aggregates the garden context (zone, frost, spaces) and season preferences into a structured prompt that the subagent's system prompt knows how to use. The actual recommendation logic lives in the subagent prompt, not in code.

**Alternative considered**: Recommendation logic in TypeScript. Rejected — the LLM is better suited to generate contextual gardening recommendations than a static algorithm.

### Decision 4: Preference tool uses SeasonStorage.update

The `preference` tool calls `SeasonStorage.update` to set `gardenerType` and `engagement` on the active season. This reuses existing update infrastructure and publishes the Season.Updated event.

### Decision 5: Guided-planting subagent delegates to crop-data via Task tool

When the user selects plants from recommendations, the guided-planting subagent delegates to crop-data to populate each crop record. It does not call crop tools directly — it dispatches via the Task tool to keep subagent responsibilities clean.

**Alternative considered**: Give guided-planting direct crop tool access. Rejected — crop-data already has the specialized prompt for schema population; duplicating that knowledge would violate single-responsibility.

## Risks / Trade-offs

- **[Risk]** LLM recommendation quality varies by model → **Mitigation**: The subagent prompt includes explicit heuristics per type+engagement combination (from project.md), so even weaker models have guardrails.
- **[Risk]** Adding fields to Season.Info could break existing data → **Mitigation**: Fields are optional with defaults, so existing stored seasons parse without migration.
- **[Risk]** Subagent delegation chain (gartenmeister → guided-planting → crop-data) could be slow → **Mitigation**: Acceptable for interactive use; the user is in a conversational flow anyway.
