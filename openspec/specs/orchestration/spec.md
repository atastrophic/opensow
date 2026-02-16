## ADDED Requirements

### Requirement: Status tool

The system SHALL provide a `status` tool that aggregates the current state across gardens, seasons, and crops into a single summary. The tool is read-only and publishes no events.

#### Scenario: Status with one garden and active season

- **WHEN** the status tool is called and garden "Backyard" (zone 8b) has an active season 2026 with 5 crops
- **THEN** the tool returns a summary showing: garden name, zone, active season year, crop count (5), and no archived seasons

#### Scenario: Status with no gardens

- **WHEN** the status tool is called and no gardens exist
- **THEN** the tool returns a message indicating no gardens have been set up yet

#### Scenario: Status with garden but no active season

- **WHEN** the status tool is called and garden "Backyard" exists but has no active season
- **THEN** the tool returns the garden info and indicates no active season

#### Scenario: Status with multiple gardens

- **WHEN** the status tool is called and two gardens exist ("Backyard" with active season, "Community Plot" with no season)
- **THEN** the tool returns a summary for each garden showing their respective states

#### Scenario: Status shows archived season count

- **WHEN** the status tool is called and a garden has 1 active season and 2 archived seasons
- **THEN** the tool includes the archived season count alongside the active season details

### Requirement: Status tool permission

The gartenmeister agent SHALL have permission to call the `status` tool. No other agent requires this permission.

#### Scenario: Gartenmeister can call status

- **WHEN** the gartenmeister agent is initialized
- **THEN** its permission set includes `status: "allow"`

### Requirement: Gartenmeister routing rules

The gartenmeister prompt SHALL include explicit routing rules that map user intent to subagent delegation. The rules SHALL cover: garden setup, season management, crop data entry, guided planting ideas, direct planting, and season planning.

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
- **THEN** the gartenmeister asks the user to clarify what they want to do

### Requirement: Orientation on session start

The gartenmeister prompt SHALL instruct the agent to call the status tool early in a conversation to understand the current state before suggesting next steps.

#### Scenario: First message in session

- **WHEN** a user starts a new session with the gartenmeister
- **THEN** the agent calls the status tool to understand the current garden/season/crop state before responding

#### Scenario: Status informs recommendations

- **WHEN** status shows a garden exists but has no active season
- **THEN** the gartenmeister suggests starting a new season as a next step
