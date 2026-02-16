## 1. Season Schema Update

- [x] 1.1 Add optional `gardenerType` field ("chef" | "parent" | "homesteader") to Season.Info in `src/season/season.ts`
- [x] 1.2 Add optional `engagement` field ("low" | "standard" | "high") to Season.Info in `src/season/season.ts`

## 2. Preference Tool

- [x] 2.1 Create `src/tool/preference.ts` — preference tool that accepts gardenId, gardenerType, engagement; calls SeasonStorage.update on the active season
- [x] 2.2 Create `src/tool/preference.txt` — LLM description for the preference tool
- [x] 2.3 Register PreferenceTool in `src/tool/registry.ts`

## 3. Recommend Tool

- [x] 3.1 Create `src/tool/recommend.ts` — recommend tool that accepts gardenId; reads garden context (zone, frost, spaces) and active season preferences; returns formatted summary with current date
- [x] 3.2 Create `src/tool/recommend.txt` — LLM description for the recommend tool
- [x] 3.3 Register RecommendTool in `src/tool/registry.ts`

## 4. Guided Planting Subagent

- [x] 4.1 Create `src/agent/prompt/guided-planting.txt` — subagent prompt with quiz flow, recommendation heuristics per type+engagement, and crop-data delegation instructions
- [x] 4.2 Register guided-planting subagent in `src/agent/agent.ts` with permissions for preference, recommend, garden_list, season_list, and task
- [x] 4.3 Import guided-planting prompt in `src/agent/agent.ts`

## 5. Gartenmeister Routing

- [x] 5.1 Add guided-planting routing rule to `src/agent/prompt/gartenmeister.txt`
- [x] 5.2 Add guided-planting agent description to the Native Agents section in `src/agent/prompt/gartenmeister.txt`

## 6. Tests

- [x] 6.1 Create `test/guided-planting/guided-planting.test.ts` — test season schema with preference fields (optional, backward compatible), preference persistence via Storage, recommend context aggregation
