## 1. Status Tool

- [x] 1.1 Create `src/tool/status.ts` — status tool that calls GardenStorage.list(), SeasonStorage.list/active() per garden, CropStorage.list() per active season, returns formatted text summary
- [x] 1.2 Create `src/tool/status.txt` — LLM description for the status tool
- [x] 1.3 Register StatusTool in `src/tool/registry.ts`
- [x] 1.4 Add `status: "allow"` to gartenmeister agent permissions in `src/agent/agent.ts`

## 2. Gartenmeister Prompt

- [x] 2.1 Add routing rules section to `src/agent/prompt/gartenmeister.txt` — explicit WHEN/THEN rules for delegating to garden-setup, season-management, and crop-data subagents
- [x] 2.2 Add orientation section to `src/agent/prompt/gartenmeister.txt` — instruct agent to call status tool at session start before responding
- [x] 2.3 Add ambiguity fallback rule — when intent is unclear, ask the user to clarify

## 3. Tests

- [x] 3.1 Create `test/tool/status.test.ts` — test status tool output with no gardens, one garden no season, one garden with active season and crops, multiple gardens, archived season count
