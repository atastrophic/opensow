## MODIFIED Requirements

### Requirement: Season entity schema

The Season.Info schema SHALL include optional fields for gardener type and engagement level to persist guided planting preferences. These fields SHALL be optional with no default, allowing existing seasons to parse without migration.

#### Scenario: Season with preferences

- **WHEN** a season is created and preferences are later set via the preference tool
- **THEN** the season stores gardenerType ("chef" | "parent" | "homesteader") and engagement ("low" | "standard" | "high")

#### Scenario: Season without preferences

- **WHEN** an existing season is read that was created before the preference fields existed
- **THEN** the season parses successfully with gardenerType and engagement as undefined
