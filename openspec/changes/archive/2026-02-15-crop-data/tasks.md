## 1. Crop Entity

- [x] 1.1 Create `src/crop/crop.ts` with Zod schemas: Taxonomy, Spacing, SeedStartingIndoors, SeedStartingOutdoors, PottingUp, Transplanting, Cultivation, Harvest sections
- [x] 1.2 Create composite `Crop.Info` schema with id, seasonId, name, and all nullable sections
- [x] 1.3 Add zone range refinement (min <= max) to Taxonomy schema
- [x] 1.4 Define Bus events: crop.created, crop.removed

## 2. Crop Persistence

- [x] 2.1 Create `src/crop/storage.ts` with CropStorage namespace using key pattern `["crop", seasonId, cropId]`
- [x] 2.2 Implement `create` with duplicate guard and event publishing
- [x] 2.3 Implement `read` returning undefined for missing records
- [x] 2.4 Implement `list` by season ID
- [x] 2.5 Implement `remove` with event publishing and error on missing record

## 3. Crop Tools

- [x] 3.1 Create `src/tool/crop-create.ts` and `crop-create.txt` — accepts full Crop.Info, calls CropStorage.create
- [x] 3.2 Create `src/tool/crop-read.ts` and `crop-read.txt` — accepts seasonId and cropId, calls CropStorage.read
- [x] 3.3 Create `src/tool/crop-list.ts` and `crop-list.txt` — accepts seasonId, calls CropStorage.list, returns name+id summary
- [x] 3.4 Create `src/tool/crop-remove.ts` and `crop-remove.txt` — accepts seasonId and cropId, calls CropStorage.remove
- [x] 3.5 Register all four crop tools in `src/tool/registry.ts`

## 4. Crop Data Subagent

- [x] 4.1 Create `src/agent/prompt/crop-data.txt` with instructions to populate full schema using garden context
- [x] 4.2 Register `crop-data` subagent in `src/agent/agent.ts` with permissions for crop_create, crop_read, crop_list, crop_remove, garden_list
- [x] 4.3 Add crop-data to native agents section in `src/agent/prompt/gartenmeister.txt`

## 5. Tests

- [x] 5.1 Create `test/crop/crop.test.ts` with schema validation tests: valid full record, minimal record, zone range validation, nullable sections
- [x] 5.2 Add persistence tests: create, duplicate rejection, read existing, read missing, list, remove, remove missing
- [x] 5.3 Run all tests and verify passing
