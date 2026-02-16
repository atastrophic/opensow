## ADDED Requirements

### Requirement: Garden setup agent identity

The system SHALL provide a dedicated garden-setup agent that is invoked as a subagent. It has a system prompt describing its role and access to garden-related tools.

#### Scenario: Agent is available

- **WHEN** the system starts
- **THEN** a garden-setup agent is registered and can be invoked by the main orchestrator

### Requirement: Collect location

The garden-setup agent SHALL ask the user for their zipcode, then confirm the USDA hardiness zone and show first/last frost dates.

#### Scenario: User provides zipcode

- **WHEN** the user provides zipcode "98011"
- **THEN** the agent confirms USDA zone 8b and displays estimated first frost "Oct 15" and last frost "Apr 15"

#### Scenario: User corrects zone

- **WHEN** the agent shows zone 8b and the user says their zone is actually 8a
- **THEN** the agent updates the zone and adjusts frost dates accordingly

### Requirement: Collect growing spaces

The garden-setup agent SHALL walk the user through adding growing spaces by asking what types of spaces they have, then collecting type-specific attributes for each.

#### Scenario: User adds a raised bed

- **WHEN** the user says they have a raised bed
- **THEN** the agent asks for length, width, light conditions, and watering method

#### Scenario: User adds a pot

- **WHEN** the user says they have a container/pot
- **THEN** the agent asks for outer diameter, depth, and total gallons (offering to estimate if unknown)

#### Scenario: User adds an indoor tray

- **WHEN** the user says they start seeds indoors
- **THEN** the agent asks for cells per tray and presents the options: 32, 48, 72, or 128

### Requirement: Check for greenhouse or indoor seed starting

The garden-setup agent SHALL ask whether the user owns a greenhouse or starts seeds indoors, to determine if tray spaces are relevant.

#### Scenario: User has greenhouse

- **WHEN** the user says they have a greenhouse
- **THEN** the agent proceeds to collect tray/cell information for greenhouse seed starting

#### Scenario: User has neither

- **WHEN** the user says they do not have a greenhouse and do not start seeds indoors
- **THEN** the agent skips tray configuration

### Requirement: Persist garden on completion

The garden-setup agent SHALL save the fully configured garden to disk once the user confirms the setup is complete.

#### Scenario: Setup complete

- **WHEN** the user confirms they are done adding spaces
- **THEN** the agent persists the garden via the garden-persistence capability and confirms to the user

### Requirement: Agent uses tools not free-form generation

The garden-setup agent SHALL interact with the data layer via defined tool calls (create garden, add space, etc.), not by generating raw JSON.

#### Scenario: Agent creates garden via tool

- **WHEN** the agent has collected location data
- **THEN** it calls a create-garden tool with the structured data rather than emitting JSON directly
