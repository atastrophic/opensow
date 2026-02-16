## ADDED Requirements

### Requirement: Direct planting subagent registration

The system SHALL register a "direct-planting" subagent accessible from the main agent. The subagent SHALL have permissions for: window, garden_list, season_list, crop_list, and task (to delegate to crop-data).

#### Scenario: Subagent is available

- **WHEN** the agent system initializes
- **THEN** a "direct-planting" subagent is registered with mode "subagent" and the required tool permissions

### Requirement: Planning mode selection

The direct-planting subagent SHALL ask the user whether they want to plan the entire season or only what can go in the ground now.

#### Scenario: User picks full season

- **WHEN** the subagent asks the planning question and the user says "entire season"
- **THEN** the subagent enters full-season collection mode and collects plants without planting-window filtering

#### Scenario: User picks current window

- **WHEN** the subagent asks the planning question and the user says "what can go in now"
- **THEN** the subagent calls the window tool to get the current planting window context and uses it to advise the user

### Requirement: Plant collection loop

The direct-planting subagent SHALL collect plants one by one from the user. For each plant, it SHALL delegate to the crop-data subagent to populate the full agronomic record.

#### Scenario: User adds one plant

- **WHEN** the user says "tomato"
- **THEN** the subagent delegates to crop-data with the plant name and active season ID

#### Scenario: User adds multiple plants

- **WHEN** the user lists "tomato, basil, pepper"
- **THEN** the subagent delegates to crop-data for each plant in sequence

#### Scenario: User is done adding plants

- **WHEN** the user says they are done or has no more plants to add
- **THEN** the subagent summarizes the plants added and ends the collection loop

### Requirement: Window tool

The system SHALL provide a `window` tool that returns the current planting window for a garden. The tool SHALL use the garden's zone, frost dates, and the current date to determine what categories of plants can be started (indoor seed starting, direct sow, or transplant).

#### Scenario: Early spring before last frost

- **WHEN** the window tool is called for a garden in zone 8b with last frost April 15 and the current date is February 15
- **THEN** the tool returns that indoor seed starting is active, direct sow is available for cold-hardy crops, and transplanting outdoors is not yet recommended

#### Scenario: After last frost

- **WHEN** the window tool is called for a garden in zone 8b with last frost April 15 and the current date is May 1
- **THEN** the tool returns that all planting methods are available and the frost-free growing season is active

#### Scenario: No garden found

- **WHEN** the window tool is called with a gardenId that does not exist
- **THEN** the tool returns an error message indicating the garden was not found

### Requirement: Direct planting agent prompt

The subagent SHALL have a dedicated prompt that defines the conversational flow: ask planning mode, optionally call window tool, collect plants via delegation to crop-data, and summarize when done.

#### Scenario: Full flow with current window

- **WHEN** the direct-planting subagent is invoked and the user picks "what can go in now"
- **THEN** the prompt directs it through: call window tool, share planting window context, collect plants, delegate each to crop-data, summarize

#### Scenario: Full flow with entire season

- **WHEN** the direct-planting subagent is invoked and the user picks "entire season"
- **THEN** the prompt directs it through: collect plants, delegate each to crop-data, summarize
