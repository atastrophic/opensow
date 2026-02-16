## ADDED Requirements

### Requirement: Season management subagent

The system SHALL provide a season-management subagent that guides users through starting and managing seasons. The subagent is accessible from the main gartenmeister agent.

#### Scenario: Subagent available from main agent

- **WHEN** a user asks the gartenmeister agent about starting a season
- **THEN** the gartenmeister delegates to the season-management subagent

### Requirement: Archive warning before new season

The season-management agent SHALL warn users that starting a new season will archive the current active season before proceeding. The agent MUST present the name and year of the season that will be archived and ask the user to confirm.

#### Scenario: Warning when active season exists

- **WHEN** a user asks to start a new season and garden "g-1" has an active season "Spring 2025"
- **THEN** the agent informs the user that "Spring 2025" will be archived and asks for confirmation before creating the new season

#### Scenario: No warning when no active season

- **WHEN** a user asks to start a new season and the garden has no active season
- **THEN** the agent proceeds to create the season without an archive warning

#### Scenario: User declines after warning

- **WHEN** the agent warns about archiving and the user declines
- **THEN** the agent does not create a new season and does not archive the existing one

### Requirement: Season start workflow

The season-management agent SHALL guide users through creating a new season by collecting the year and confirming the garden. After creation, if a previous season had perennial plants, the agent SHALL offer to migrate them.

#### Scenario: Start first season

- **WHEN** a user starts a season for a garden with no prior seasons
- **THEN** the agent collects the year, creates the season, and skips perennial migration

#### Scenario: Start season with perennial migration offer

- **WHEN** a user starts a season and the previously active season had perennial plants
- **THEN** the agent presents the list of perennials and asks which ones to carry forward

### Requirement: Season list tool

The system SHALL provide a tool that lists all seasons for a given garden, showing their year, status, and plant count.

#### Scenario: List seasons

- **WHEN** the season-list tool is called with garden ID "g-1"
- **THEN** it returns all seasons for that garden with year, status, and number of plant references

### Requirement: Season start tool

The system SHALL provide a tool that creates a new season for a garden, handling the archive-on-create logic. The tool accepts garden ID and year as required parameters.

#### Scenario: Start season via tool

- **WHEN** the season-start tool is called with garden ID "g-1" and year 2026
- **THEN** a new active season is created for "g-1" with year 2026 (archiving any existing active season)

### Requirement: Season migrate tool

The system SHALL provide a tool that migrates selected perennial plants from the most recently archived season to the current active season. The tool accepts garden ID and a list of plant reference IDs to migrate.

#### Scenario: Migrate via tool

- **WHEN** the season-migrate tool is called with garden ID "g-1" and plant IDs ["p-1", "p-2"]
- **THEN** the perennial plants "p-1" and "p-2" are copied from the most recently archived season to the active season with new UUIDs

### Requirement: Planting approach prompt

After season creation and optional perennial migration, the agent SHALL ask the user how they want to add plants: guided ideas (suggestions based on zone and space) or direct selection (user picks specific plants). This choice is informational for the current scope — it routes to future capabilities.

#### Scenario: Prompt after season start

- **WHEN** a season has been successfully created and any perennial migration is complete
- **THEN** the agent asks the user to choose between guided planting ideas and direct plant selection
