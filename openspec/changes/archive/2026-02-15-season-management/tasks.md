## 1. Season Entity

- [x] 1.1 Create `src/season/season.ts` with `Season` namespace: `Plant` schema (id, name, perennial), `Info` schema (id, gardenId, year, status, plants), status literal union ("active" | "archived")
- [x] 1.2 Add year validation (positive integer) to the `Info` schema
- [x] 1.3 Define `Season.Event` with `Created`, `Updated`, `Archived` bus events

## 2. Season Persistence

- [x] 2.1 Create `src/season/storage.ts` with `SeasonStorage` namespace and `PREFIX` constant
- [x] 2.2 Implement `SeasonStorage.create` — write new season, archive existing active season for the garden if one exists
- [x] 2.3 Implement `SeasonStorage.read` — read season by garden ID and season ID
- [x] 2.4 Implement `SeasonStorage.update` — update season, reject if status is "archived"
- [x] 2.5 Implement `SeasonStorage.list` — list all seasons for a garden
- [x] 2.6 Implement `SeasonStorage.active` — find the active season for a garden (returns undefined if none)

## 3. Season Migration

- [x] 3.1 Implement `SeasonStorage.migrate` — accept garden ID and plant reference IDs, filter to perennials from the most recently archived season, copy to active season with new UUIDs

## 4. Season Tools

- [x] 4.1 Create `src/tool/season-start.ts` + `.txt` — tool that creates a new season for a garden (params: gardenId, year)
- [x] 4.2 Create `src/tool/season-list.ts` + `.txt` — tool that lists seasons for a garden (params: gardenId)
- [x] 4.3 Create `src/tool/season-migrate.ts` + `.txt` — tool that migrates perennial plants (params: gardenId, plantIds)
- [x] 4.4 Register all three tools in `src/tool/registry.ts`

## 5. Season Agent

- [x] 5.1 Create `src/agent/prompt/season-management.txt` — prompt instructing the agent to warn about archiving, guide season creation, offer perennial migration, and prompt for planting approach
- [x] 5.2 Register `season-management` subagent in `src/agent/agent.ts` with season tool permissions
- [x] 5.3 Add `season-management` to the native agents section in `src/agent/prompt/gartenmeister.txt`

## 6. Tests

- [x] 6.1 Test `Season.Info` and `Season.Plant` schema validation (valid input, invalid year, invalid status)
- [x] 6.2 Test `SeasonStorage.create` — creates season, archives existing active season
- [x] 6.3 Test `SeasonStorage.read` — returns season or undefined
- [x] 6.4 Test `SeasonStorage.update` — updates active season, rejects archived season
- [x] 6.5 Test `SeasonStorage.list` — lists all seasons for a garden, empty list for no seasons
- [x] 6.6 Test `SeasonStorage.active` — returns active season or undefined
- [x] 6.7 Test `SeasonStorage.migrate` — migrates selected perennials with new UUIDs, skips annuals and unknown IDs
