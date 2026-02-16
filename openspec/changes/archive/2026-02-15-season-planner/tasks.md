## 1. Plan Tool

- [x] 1.1 Create `src/tool/planner.ts` with Tool.define("planner") — accepts gardenId, reads garden info, active season, all crops for that season, and returns a structured summary with spaces, crop details (spacing, companions, antagonists, days to maturity, seed starting windows), zone, frost dates, and current date
- [x] 1.2 Create `src/tool/planner.txt` with LLM description for the planner tool
- [x] 1.3 Register PlannerTool in `src/tool/registry.ts`

## 2. Season Planner Subagent

- [x] 2.1 Create `src/agent/prompt/season-planner.txt` with instructions for: calling planner tool, generating square foot layouts per space, applying companion planting rules, creating succession planting schedules, producing month-by-month timelines
- [x] 2.2 Register season-planner subagent in `src/agent/agent.ts` with permissions: planner, garden_list, season_list, crop_list, crop_read, task

## 3. Orchestration Update

- [x] 3.1 Add season-planner to Native Agents section in `src/agent/prompt/gartenmeister.txt`
- [x] 3.2 Add routing rule for season-planner in Routing Rules section of `src/agent/prompt/gartenmeister.txt`

## 4. Tests

- [x] 4.1 Create `test/season-planner/season-planner.test.ts` with tests for: planner tool output with crops and spaces, planner tool with no crops, planner tool with no spaces, planner tool with no active season, crop companion/antagonist data accessible for planning

## 5. Project Tracking

- [x] 5.1 Update project.md to mark season-planner as in-progress/apply
