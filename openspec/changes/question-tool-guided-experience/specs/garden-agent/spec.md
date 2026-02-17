## MODIFIED Requirements

### Requirement: Collect growing spaces

The garden-setup agent SHALL walk the user through adding growing spaces by asking what types of spaces they have, then collecting type-specific attributes for each. For bed spaces, the agent SHALL use the `question` tool to collect light exposure and watering method since these are finite enumerations, while collecting name and dimensions as plain text.

#### Scenario: User adds a raised bed

- **WHEN** the user says they have a raised bed
- **THEN** the agent asks for name and dimensions as plain text, then uses the `question` tool for light exposure (Full sun / Partial sun / Full shade) with `custom: false`, and the `question` tool for watering method (Drip / Sprinkler / Hand watering / None) with `custom: false`

#### Scenario: User adds a pot

- **WHEN** the user says they have a container/pot
- **THEN** the agent asks for outer diameter, depth, and total gallons (offering to estimate if unknown)

#### Scenario: User adds an indoor tray

- **WHEN** the user says they start seeds indoors
- **THEN** the agent asks for cells per tray and presents the options: 32, 48, 72, or 128

### Requirement: Collect location

The garden-setup agent SHALL ask the user for their zipcode, then confirm the USDA hardiness zone and show first/last frost dates. The agent SHALL use the `question` tool to present the suggested zone and frost dates for confirmation.

#### Scenario: User provides zipcode

- **WHEN** the user provides zipcode "98011"
- **THEN** the agent uses the `question` tool to confirm USDA zone 8b with estimated first frost "Oct 15" and last frost "Apr 15", with an option to correct them

#### Scenario: User corrects zone

- **WHEN** the agent shows zone 8b and the user says their zone is actually 8a
- **THEN** the agent updates the zone and adjusts frost dates accordingly
