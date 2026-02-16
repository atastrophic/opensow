## Why

After users collect their plants (via guided-planting or direct-planting), they need a plan for the season: where to place each plant, when to start/transplant, how to pair companions, and how to succession plant for continuous harvest. Currently there is no subagent that takes the collected crops and turns them into an actionable layout and schedule. Season planner fills this gap — it is the final step before the gardener starts digging.

## What Changes

- Add a `season-planner` subagent that generates a season plan from collected crops, garden spaces, and zone/frost context
- The subagent produces a square foot gardening layout for each space, assigning crops to grid cells
- The subagent considers companion planting (good neighbors) and antagonists (bad neighbors) when placing crops
- The subagent generates a succession planting schedule for crops that benefit from staggered sowing
- Add a `plan` tool that aggregates all inputs (garden, season, crops, spaces) into a structured context for the LLM prompt
- Update gartenmeister routing rules to delegate to season-planner when the user asks for a plan

## Capabilities

### New Capabilities

- `season-planner`: Subagent registration, plan tool, square foot layout generation, companion planting logic, succession planting schedule, season timeline

### Modified Capabilities

- `orchestration`: Add routing rule for season-planner delegation from gartenmeister

## Impact

- New files: `src/tool/plan.ts` + `.txt`, `src/agent/prompt/season-planner.txt`
- Modified files: `src/tool/registry.ts` (register plan tool), `src/agent/agent.ts` (register season-planner subagent), `src/agent/prompt/gartenmeister.txt` (add routing rule + native agent entry)
- New tests: `test/season-planner/season-planner.test.ts`
