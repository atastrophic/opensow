## 1. Window Tool

- [x] 1.1 Create `src/tool/window.ts` with Tool.define("window") — accepts gardenId, reads garden info and active season, computes planting window categories based on zone, frost dates, and current date
- [x] 1.2 Create `src/tool/window.txt` with LLM description for the window tool
- [x] 1.3 Register WindowTool in `src/tool/registry.ts`

## 2. Direct Planting Subagent

- [x] 2.1 Create `src/agent/prompt/direct-planting.txt` with conversational flow: ask planning mode (full season vs. current window), call window tool if current window, collect plants one by one delegating to crop-data, summarize when done
- [x] 2.2 Register direct-planting subagent in `src/agent/agent.ts` with permissions: window, garden_list, season_list, crop_list, task

## 3. Orchestration Update

- [x] 3.1 Add direct-planting to Native Agents section in `src/agent/prompt/gartenmeister.txt`
- [x] 3.2 Add routing rule for direct-planting in Routing Rules section of `src/agent/prompt/gartenmeister.txt`

## 4. Tests

- [x] 4.1 Create `test/direct-planting/direct-planting.test.ts` with tests for: window tool output format, window tool with missing garden, window tool planting categories (before vs after last frost), direct-planting subagent registration verification

## 5. Project Tracking

- [x] 5.1 Update project.md to mark direct-planting as in-progress/apply
