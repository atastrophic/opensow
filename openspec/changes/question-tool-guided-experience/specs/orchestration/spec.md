## MODIFIED Requirements

### Requirement: Orientation on session start

The gartenmeister prompt SHALL instruct the agent to call the status tool as its first action in a new conversation, then immediately use the `question` tool to present state-appropriate next actions as selectable choices. The agent SHALL NOT use plain text suggestions or open-ended greetings — the first user-facing interaction MUST be a structured `question` with options.

#### Scenario: First message in session

- **WHEN** a user starts a new session with the gartenmeister
- **THEN** the agent calls the status tool, gives a one-line summary of current state, and uses the `question` tool to present relevant next actions

#### Scenario: No gardens exist

- **WHEN** status shows no gardens exist
- **THEN** the gartenmeister presents a `question` with "Set up a new garden" as an option, with `custom: true`

#### Scenario: Garden exists but no active season

- **WHEN** status shows a garden exists but has no active season
- **THEN** the gartenmeister presents a `question` with options "Start a new season" and "Set up another garden", with `custom: true`

#### Scenario: Active season but no crops

- **WHEN** status shows an active season with no crops
- **THEN** the gartenmeister presents a `question` with options "Get planting suggestions", "Add plants I already know", and "Plan my season layout", with `custom: true`

#### Scenario: Active season with crops

- **WHEN** status shows an active season with crops already added
- **THEN** the gartenmeister presents a `question` with options "Add more plants", "Get planting suggestions", "Plan my season layout", "Start a new season", and "Set up another garden", with `custom: true`

### Requirement: Gartenmeister routing rules

The gartenmeister prompt SHALL include explicit routing rules that map user intent to subagent delegation. The rules SHALL cover: garden setup, season management, crop data entry, guided planting ideas, direct planting, and season planning. When intent is ambiguous, the gartenmeister SHALL use the `question` tool to present routing options as selectable choices instead of asking in plain text.

#### Scenario: User wants to create a garden

- **WHEN** a user asks to set up, create, or configure a garden
- **THEN** the gartenmeister delegates to the garden-setup subagent

#### Scenario: User wants to start a season

- **WHEN** a user asks to start a new season, manage seasons, or migrate perennials
- **THEN** the gartenmeister delegates to the season-management subagent

#### Scenario: User wants to add a crop

- **WHEN** a user asks to add, create, or look up a plant or crop
- **THEN** the gartenmeister delegates to the crop-data subagent

#### Scenario: User wants planting ideas

- **WHEN** a user asks for planting ideas, suggestions, recommendations, or says they don't know what to plant
- **THEN** the gartenmeister delegates to the guided-planting subagent

#### Scenario: User knows what to plant

- **WHEN** a user says they know what they want to plant, lists specific plants for their season, or wants to plan their planting
- **THEN** the gartenmeister delegates to the direct-planting subagent

#### Scenario: User wants a season plan

- **WHEN** a user asks to plan the season, create a garden layout, generate a planting schedule, or asks about companion planting or succession planting
- **THEN** the gartenmeister delegates to the season-planner subagent

#### Scenario: Ambiguous intent

- **WHEN** the user's intent is unclear and does not match any routing rule
- **THEN** the gartenmeister uses the `question` tool to present relevant routing options as selectable choices with `custom: true`
