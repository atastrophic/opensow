## Why

When a user finishes setting up a season, the season-management agent asks if they want guided ideas or direct selection — but "guided ideas" routes to nothing. Users who don't know what to plant need a conversational flow that narrows recommendations based on their gardener type (Chef/Parent/Homesteader) and engagement level (low/standard/high), then produces a curated plant list tailored to their zone, spaces, and preferences.

## What Changes

- Add a `guided-planting` subagent that runs the two-step quiz (gardener type + engagement level), generates tailored crop recommendations using garden context, and delegates to `crop-data` for each selected plant
- Add a `preference` tool to persist the user's gardener type and engagement level on the season so the recommendations can be regenerated or referenced later
- Add a `recommend` tool that returns a curated plant list based on gardener type, engagement level, zone, and current date
- Register the subagent in the agent system and add it to the gartenmeister prompt routing rules
- Update the gartenmeister prompt to route "I want ideas" / "help me pick" / "what should I plant" to the guided-planting subagent

## Capabilities

### New Capabilities

- `guided-planting`: The guided planting quiz and recommendation workflow — gardener type selection, engagement level, curated recommendations, and delegation to crop-data for selected plants

### Modified Capabilities

- `orchestration`: Add routing rule for guided-planting subagent delegation
- `season`: Add preference fields (gardenerType, engagement) to Season.Info

## Impact

- New files: `src/tool/preference.ts`, `src/tool/preference.txt`, `src/tool/recommend.ts`, `src/tool/recommend.txt`, `src/agent/prompt/guided-planting.txt`
- Modified: `src/season/season.ts` (add preference fields to Info schema)
- Modified: `src/tool/registry.ts` (register preference + recommend tools)
- Modified: `src/agent/agent.ts` (register guided-planting subagent)
- Modified: `src/agent/prompt/gartenmeister.txt` (add guided-planting routing rule)
- New test: `test/guided-planting/guided-planting.test.ts`
