## Why

Gardens are organized around seasons. Without a season entity, there is no container for planting plans, schedules, or harvest tracking. Season management is the structural prerequisite for all planting workflows — guided, direct, and planned. Each garden needs exactly one active season at a time, with old seasons archived as a readonly record.

## What Changes

- Introduce a season entity tied to a garden (year, status, plant references)
- Enforce one active season per garden — creating a new season archives the previous one
- Warn users before archiving: the season-management agent must inform users that starting a new season will archive the current active season, and confirm intent before proceeding
- Archived seasons become readonly (no mutations allowed)
- Support perennial migration: when starting a new season, carry forward plants marked as perennial from the prior season
- Add a season-management subagent that walks users through starting a new season
- Add tools for season CRUD and perennial migration
- Persist seasons via the existing Storage namespace

## Capabilities

### New Capabilities

- `season`: Season entity schema, lifecycle states (active/archived), one-active-per-garden constraint, plant reference collection, year tracking
- `season-persistence`: CRUD operations for seasons via Storage, archive enforcement (reject writes to archived seasons), list seasons by garden
- `season-migration`: Perennial migration logic — copy perennial plant references from the previous season into the new one, allow user to select/deselect which plants to carry forward
- `season-agent`: Dedicated subagent that guides users through starting a new season, migrating perennials, and choosing a planting approach (guided ideas vs. direct selection). Must warn users that starting a new season will archive the current active season and confirm before proceeding

### Modified Capabilities

_(none — garden specs are unchanged; seasons reference gardens by ID but do not alter garden behavior)_

## Impact

- New files: `src/season/season.ts` (schema + events), `src/season/storage.ts` (persistence)
- New tools: `season-start`, `season-list`, `season-migrate`
- New agent: `season-management` subagent in `src/agent/agent.ts` with prompt
- Existing: `src/tool/registry.ts` (register new tools), `src/agent/prompt/gartenmeister.txt` (add season-management to native agents)
- Plant references within seasons use a minimal schema (id, name, perennial flag) — the full plant data model is deferred to `crop-data` (#3)
