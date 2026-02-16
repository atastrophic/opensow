## Why

Users who already know what they want to plant need a streamlined path to collect their plants for the season. Currently there is no subagent to handle this workflow — season-management detects user intent but has nowhere to delegate. Direct planting fills the second branch of the "what do you want to plant?" decision: the user who arrives with a list.

## What Changes

- Add a `direct-planting` subagent that collects plants from the user
- The subagent asks whether the user wants to plan the entire season or just what can go in now
- Collects plants one by one, delegating each to the crop-data subagent for full agronomic records
- Uses garden context (zone, frost dates, current date) to filter planting-window advice when the user picks "what can go in now"
- Add a `window` tool that returns the current planting window (what can be started now based on zone, frost dates, and date)
- Update gartenmeister routing rules to delegate to direct-planting when the user knows what they want to plant

## Capabilities

### New Capabilities

- `direct-planting`: Subagent registration, conversational flow (full season vs. current window), plant collection loop, delegation to crop-data, planting window context

### Modified Capabilities

- `orchestration`: Add routing rule for direct-planting delegation from gartenmeister

## Impact

- New files: `src/tool/window.ts` + `.txt`, `src/agent/prompt/direct-planting.txt`
- Modified files: `src/tool/registry.ts` (register window tool), `src/agent/agent.ts` (register direct-planting subagent), `src/agent/prompt/gartenmeister.txt` (add routing rule)
- New tests: `test/direct-planting/direct-planting.test.ts`
