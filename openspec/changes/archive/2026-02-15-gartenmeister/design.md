## Context

The gartenmeister is the primary agent in opensow. It currently has a detailed prompt (`gartenmeister.txt`) describing all native agents and their purposes, plus full tool permissions. However, it lacks:

1. A way to see current state at a glance (which gardens exist, their active seasons, crop counts)
2. Explicit routing logic in the prompt — it describes agents but doesn't define clear decision rules for when to delegate

Three subagents are already registered and working: `garden-setup`, `season-management`, and `crop-data`. The gartenmeister prompt already describes them but relies on the LLM to figure out routing from prose descriptions.

## Goals / Non-Goals

**Goals:**

- Add a `status` tool that aggregates state across gardens, seasons, and crops into a single summary
- Add explicit routing rules to the gartenmeister prompt so intent-to-subagent mapping is deterministic
- Ensure the gartenmeister calls status on session start to orient itself before responding

**Non-Goals:**

- Modifying any subagent (garden-setup, season-management, crop-data) — they are complete
- Adding new subagents — guided-planting, direct-planting, and season-planner are separate future changes
- Implementing any conversational UI beyond what the LLM naturally provides
- Adding a state machine or programmatic routing — routing stays in the prompt as LLM instructions

## Decisions

### Decision 1: Status tool reads from all three storage layers

The `status` tool will call `GardenStorage.list()`, then for each garden call `SeasonStorage.list(gardenId)` and `SeasonStorage.active(gardenId)`, then for each active season call `CropStorage.list(seasonId)`. It returns a structured summary.

**Alternative considered**: Separate status tools per domain (garden-status, season-status, crop-status). Rejected because the gartenmeister needs a single call to orient — multiple calls waste tokens and steps.

**Alternative considered**: Cached/precomputed status. Rejected — the data volume is small (a few gardens, one active season each, maybe 20 crops). Direct reads are fast enough.

### Decision 2: Routing rules embedded in prompt, not code

Routing logic lives in the gartenmeister prompt as explicit WHEN/THEN rules (e.g., "WHEN user wants to set up a garden THEN delegate to garden-setup"). This keeps routing transparent, editable, and consistent with how the agent system works.

**Alternative considered**: Programmatic intent classifier before the agent. Rejected — adds complexity, the LLM handles intent well with clear rules, and prompt-based routing is already the pattern used.

### Decision 3: Status tool is read-only, available to gartenmeister only

The status tool calls storage read/list functions. It publishes no events, modifies no data. Only the gartenmeister agent needs it for orientation — subagents have their own scoped tools.

### Decision 4: Status tool returns structured text, not raw JSON

The tool formats output as readable text (garden name, zone, active season year, crop count) rather than raw JSON arrays. This reduces token overhead for the LLM and makes the output directly usable in conversation.

## Risks / Trade-offs

- **[Risk]** Status output grows large with many gardens/seasons → **Mitigation**: Only show active season details, summarize archived seasons as a count. Practical limit is small (hobby gardeners have 1-3 gardens).
- **[Risk]** Prompt-based routing misroutes on ambiguous intent → **Mitigation**: Add fallback rule: when unclear, ask the user to clarify. The gartenmeister already has `question` permission.
- **[Risk]** Status tool creates a dependency on all three storage modules → **Mitigation**: These are all stable, already-tested storage layers. Import coupling is acceptable for a read-only aggregation tool.
