## MODIFIED Requirements

### Requirement: Gartenmeister routing rules

The gartenmeister prompt SHALL include explicit routing rules that map user intent to subagent delegation. The rules SHALL cover: garden setup, season management, crop data entry, guided planting ideas, and direct planting.

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

#### Scenario: Ambiguous intent

- **WHEN** the user's intent is unclear and does not match any routing rule
- **THEN** the gartenmeister asks the user to clarify what they want to do
