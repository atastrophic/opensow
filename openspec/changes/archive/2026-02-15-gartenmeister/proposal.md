## Why

The gartenmeister agent exists as a configuration entry with a prompt, but it has no orchestration logic beyond the prompt text itself. Users must know which subagent to invoke or rely entirely on the LLM to infer routing. The gartenmeister needs a defined routing workflow — detecting user intent (new garden, new season, add crops) and delegating to the correct subagent — plus a status tool that summarizes the current state across gardens, seasons, and crops so the agent can orient itself and guide the user.

## What Changes

- Add a `status` tool that aggregates state across gardens, seasons, and crops into a single summary (garden count, active season per garden, crop count per season)
- Add a gartenmeister prompt section that defines explicit routing rules: when to delegate to garden-setup, season-management, or crop-data based on user intent
- Update the gartenmeister agent permissions to include the new status tool
- Refine the gartenmeister prompt to use status output as context before suggesting next steps

## Capabilities

### New Capabilities

- `orchestration`: Routing rules and status aggregation for the main gartenmeister agent — defines how intent maps to subagent delegation and how the agent orients itself via a status tool

### Modified Capabilities

<!-- No spec-level requirement changes to existing capabilities -->

## Impact

- New tool: `status` in `src/tool/status.ts`
- Modified: `src/agent/prompt/gartenmeister.txt` (routing rules, status usage)
- Modified: `src/agent/agent.ts` (gartenmeister permissions for status tool)
- Modified: `src/tool/registry.ts` (register status tool)
