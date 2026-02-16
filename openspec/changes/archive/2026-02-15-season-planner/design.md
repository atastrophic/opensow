## Context

OpenSow has all data collection features complete: garden setup, season management, crop data, guided planting, and direct planting. Users can set up gardens with spaces, start seasons, and collect crops with full agronomic data (including spacing, companions, antagonists, seed starting windows, and days to maturity). The missing piece is turning this collected data into an actionable plan.

The plan tool follows the same pattern as recommend (guided-planting) and window (direct-planting): read garden + season + crops, aggregate into a structured summary for the LLM prompt to reason over.

## Goals / Non-Goals

**Goals:**

- Plan tool that aggregates garden context, spaces, and crops into a structured summary
- Subagent prompt that generates square foot gardening layouts per space
- Companion planting: place companions adjacent, antagonists separated
- Succession planting schedule for short-season crops
- Month-by-month timeline with indoor start, direct sow, transplant, and harvest dates
- Gartenmeister routing to season-planner when user asks for a plan

**Non-Goals:**

- No persistent plan storage (plans are generated on-demand, rendered as text)
- No visual/graphical grid rendering (text-based ASCII grids in markdown)
- No automated rebalancing when crops change (user re-runs the planner)
- No bed rotation tracking across seasons (future feature)

## Decisions

### Plan tool returns raw data, prompt does the reasoning

The plan tool aggregates all inputs and returns a structured summary. The LLM prompt contains the heuristics for layout generation, companion placement, and succession scheduling. This keeps the tool simple and deterministic while giving the LLM flexibility.

**Rationale:** The layout and scheduling logic is inherently fuzzy — there are many valid arrangements. The LLM can handle trade-offs and explain its reasoning in natural language, which a deterministic algorithm cannot.

**Alternative considered:** A layout algorithm that returns a pre-computed grid. Rejected because (a) it would need to handle many edge cases, (b) the LLM can produce better explanations, and (c) the prompt-based approach is faster to iterate.

### Square foot gardening as the grid system

All layouts use the square foot gardening method: spaces divided into 1-foot squares, each square assigned to one crop type based on spacing requirements.

**Rationale:** Square foot gardening is the most widely understood intensive planting system. It maps directly to the spacing data already stored in crop records.

### Text-based output only

Plans are rendered as markdown text with ASCII grid layouts. No images, no HTML, no persistent files.

**Rationale:** OpenSow is a CLI tool. Text output is native and can be piped, saved, or printed. Visual grids can be a future enhancement.

## Risks / Trade-offs

- [LLM layout quality varies] → The prompt includes clear heuristics and examples. For complex gardens with many crops, quality may degrade. Acceptable for v1.
- [No plan persistence] → Each invocation regenerates the plan. If the user wants to save it, they can copy the output. Persistent plans can be added later.
- [Companion data depends on crop records] → If a crop was added without companion/antagonist data, the planner cannot consider it. The plan tool notes when companion data is missing.
