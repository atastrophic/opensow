## Why

Agent prompts currently mix interactive decision points with plain text chat. When an agent needs the user to choose between options — selecting a garden, picking light exposure, confirming they're done adding plants — some prompts use the `question` tool (interactive CLI choices) while others present options as chat text. This inconsistency makes the experience feel like a chatbot instead of a guided workflow. All discrete decision points should go through the `question` tool so users get selectable options, not open-ended prompts.

## What Changes

- **Gartenmeister orientation**: After calling `status`, immediately present state-appropriate next actions via the `question` tool instead of suggesting them in chat text. This makes the first interaction a structured choice, not an empty chatbox.
- **Direct planting loop exit**: After each plant is added, use the `question` tool to ask "Add another plant" / "I'm done" instead of waiting for unstructured input.
- **Garden setup bed attributes**: Use the `question` tool for light exposure (Full sun / Partial sun / Full shade) and watering method (Drip / Sprinkler / Hand watering / None) since these are finite enumerations, not free-text inputs.
- **Garden setup frost confirmation**: Tighten the loose "let the user confirm" phrasing to explicitly reference the `question` tool for consistency.

## Capabilities

### New Capabilities

_(none — this change modifies existing agent prompt behavior)_

### Modified Capabilities

- `orchestration`: The gartenmeister orientation flow changes from chat-based suggestions to structured `question` tool usage for state-based next actions.
- `direct-planting`: The plant collection loop exit changes from open-ended chat to a structured `question` tool choice after each plant.
- `garden-agent`: The garden setup flow changes to use `question` tool for bed light exposure and watering method enumerations, and tightens frost date confirmation language.

## Impact

- **Prompt files only**: `gartenmeister.txt`, `direct-planting.txt`, `garden-setup.txt`. No code changes to tools, schemas, or permissions (those were already completed in the prior commit).
- No breaking changes — all modifications are prompt-level behavioral guidance.
- No new dependencies.
