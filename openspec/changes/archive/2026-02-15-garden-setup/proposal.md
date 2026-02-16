## Why

OpenSow has no way to represent a garden or persist its configuration. Before any agent can plan seasons, suggest plants, or generate schedules, we need a garden entity that captures the user's location, climate context, and available growing spaces. This is the first feature and the foundation everything else builds on.

## What Changes

- Define the Garden entity: name, zipcode, USDA hardiness zone, first/last frost dates
- Define typed growing spaces owned by a garden: in-ground beds, raised beds, pots/containers, indoor seed-starting trays
- Implement file-based persistence (CRUD) for gardens using Bun APIs
- Build a garden-setup agent that walks the user through configuring a new garden via conversation

## Capabilities

### New Capabilities

- `garden`: Garden entity with identity, location (zipcode, USDA hardiness zone, first/last frost dates), and a collection of typed growing spaces (in-ground bed, raised bed, pot/container, indoor tray)
- `space`: Growing space types with type-specific attributes — dimensions and light/watering for beds, diameter/depth/gallons for pots, cell count (32/48/72/128) for trays
- `garden-persistence`: File-based storage for garden data using Bun.file()/Bun.write(), JSON files on disk, CRUD operations, directory auto-creation
- `garden-agent`: Conversational agent that guides the user through garden setup — collects location, confirms USDA zone and frost dates, walks through adding growing spaces

### Modified Capabilities

_(none — first change, no existing specs)_

## Impact

- New source files in `packages/opensow` for garden types, storage, and the setup agent
- Establishes the persistence pattern (file-based JSON) that later features will reuse
- No external dependencies — uses Bun built-in file APIs and LLM tool calls for the agent
