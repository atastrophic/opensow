## Context

OpenSow agents interact with users through prompt-driven conversations. Some decision points already use the `question` tool (interactive CLI choices with selectable options), but several key interaction patterns still rely on plain text chat. This creates an inconsistent experience where some choices are structured and others require the user to type free-form responses to discrete questions.

The `question` tool infrastructure is already complete end-to-end: `Question.ask()` backend, `QuestionTool` definition, `QuestionPrompt` TUI component with arrow keys, number hotkeys, multi-select, and custom answer textarea. Agent permissions for the `question` tool were added in a prior commit. This change is purely prompt-level.

## Goals / Non-Goals

**Goals:**

- Make the gartenmeister orientation flow lead with structured options immediately after `status`, so users see selectable choices as their first interaction
- Convert all remaining finite-choice decision points to use the `question` tool
- Ensure the experience feels guided rather than chat-driven at decision points

**Non-Goals:**

- Changing any tool implementations, schemas, or permissions (already done)
- Converting open-ended inputs (plant names, garden names, dimensions) to structured choices — these remain as plain text chat
- Modifying the `question` tool itself or the TUI component

## Decisions

**Prompt-only changes**: All modifications are to `.txt` prompt files. No TypeScript code changes are needed since permissions and tool infrastructure are already in place.

**State-based orientation options**: The gartenmeister orientation presents different `question` options depending on the state returned by `status`. This keeps the option set relevant — a user with no gardens doesn't see "Plan my season layout". All option sets include `custom: true` so users can type something not listed.

**`custom: false` for enumerations**: Light exposure and watering method use `custom: false` because these map directly to schema fields with known valid values. Allowing free-text here would create data that doesn't match the expected values.

**Loop exit via `question`**: The direct-planting collection loop uses the `question` tool after each plant is added. This is cleaner than waiting for the user to say "I'm done" in free-form chat, and makes the workflow feel like a guided wizard.

## Risks / Trade-offs

- [Prompt drift] Agents may not always follow prompt instructions perfectly, especially with complex conditional logic like state-based option selection → Mitigation: The conditions are simple (check garden/season/crop counts) and map directly to the `status` tool output.
- [Over-structuring] Too many `question` prompts in quick succession could feel clunky → Mitigation: Only converting genuine decision points, not confirmations or open-ended inputs. The bed setup collects name + dimensions as plain text before presenting the two `question` choices.
