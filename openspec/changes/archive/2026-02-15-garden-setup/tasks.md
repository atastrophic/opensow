## 1. Garden Types and Schemas

- [x] 1.1 Create `src/garden/garden.ts` with Zod schemas for Garden (id, name, zipcode, zone, firstFrost, lastFrost, spaces array)
- [x] 1.2 Define discriminated union Zod schemas for space types: InGroundBed, RaisedBed, Pot, Tray — each with type-specific attributes
- [x] 1.3 Add gallon estimation function for pots (from diameter and depth)
- [x] 1.4 Add cell size estimation function for trays (from cell count: 32, 48, 72, 128)
- [x] 1.5 Add validation: tray cells must be one of 32, 48, 72, 128

## 2. Garden Persistence

- [x] 2.1 Create `src/garden/storage.ts` with create function — writes garden JSON via `Storage.write(["garden", id], data)`
- [x] 2.2 Add read function — loads garden via `Storage.read(["garden", id])`
- [x] 2.3 Add update function — overwrites garden via `Storage.update(["garden", id], fn)`
- [x] 2.4 Add remove function — deletes garden via `Storage.remove(["garden", id])`
- [x] 2.5 Add list function — lists all gardens via `Storage.list(["garden"])`
- [x] 2.6 Add duplicate-id guard on create (check if file exists before writing)

## 3. Bus Events

- [x] 3.1 Define `Garden.Event.Created`, `Garden.Event.Updated`, `Garden.Event.Deleted` using `BusEvent.define()`
- [x] 3.2 Publish events from create, update, and remove functions

## 4. Garden Tools

- [x] 4.1 Create `src/tool/garden-create.ts` — tool that accepts name + location fields, calls create, returns garden id
- [x] 4.2 Create `src/tool/garden-create.txt` — tool description for LLM
- [x] 4.3 Create `src/tool/garden-space-add.ts` — tool that accepts garden id + space type + attributes, calls update to append space
- [x] 4.4 Create `src/tool/garden-space-add.txt` — tool description for LLM
- [x] 4.5 Create `src/tool/garden-list.ts` — tool that lists all gardens with their spaces
- [x] 4.6 Create `src/tool/garden-list.txt` — tool description for LLM
- [x] 4.7 Register all three tools in `src/tool/registry.ts`

## 5. Garden Setup Agent

- [x] 5.1 Create `src/agent/prompt/garden-setup.txt` with system prompt: role, conversation flow (location -> confirm zone/frost -> walk through spaces -> persist)
- [x] 5.2 Register garden-setup agent in `src/agent/agent.ts` with mode "subagent", grant access to garden tools only

## 6. Tests

- [x] 6.1 Test garden schema validation (valid garden, invalid tray cells, missing location fields)
- [x] 6.2 Test gallon estimation function
- [x] 6.3 Test cell size estimation function
- [x] 6.4 Test CRUD operations (create, read, update, delete, list) using a temp data directory
- [x] 6.5 Test duplicate-id rejection on create
- [x] 6.6 Test space-add tool appends to existing garden
