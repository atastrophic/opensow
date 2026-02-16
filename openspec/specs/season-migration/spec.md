## ADDED Requirements

### Requirement: Identify perennial plants

The system SHALL identify which plant references in a season are marked as perennial by filtering the season's plant references collection for entries with perennial flag set to true.

#### Scenario: Season with perennial and annual plants

- **WHEN** a season contains plant references [("Tomato", perennial: false), ("Rosemary", perennial: true), ("Basil", perennial: false)]
- **THEN** the perennial identification returns only "Rosemary"

#### Scenario: Season with no perennial plants

- **WHEN** a season contains only plant references with perennial flag set to false
- **THEN** the perennial identification returns an empty collection

### Requirement: Migrate perennials to new season

The system SHALL copy selected perennial plant references from a source season into a target season. Each migrated plant reference SHALL receive a new UUID in the target season while preserving the name and perennial flag.

#### Scenario: Migrate all perennials

- **WHEN** season "s-old" has perennials ["Rosemary", "Lavender"] and both are selected for migration to season "s-new"
- **THEN** "s-new" contains plant references for "Rosemary" and "Lavender" with new UUIDs and perennial set to true

#### Scenario: Migrate subset of perennials

- **WHEN** season "s-old" has perennials ["Rosemary", "Lavender", "Thyme"] and only "Rosemary" and "Thyme" are selected
- **THEN** "s-new" contains plant references for "Rosemary" and "Thyme" only

#### Scenario: No perennials to migrate

- **WHEN** season "s-old" has no perennial plant references
- **THEN** no plant references are added to "s-new" via migration

### Requirement: Migration uses plant IDs for selection

The system SHALL accept a list of plant reference IDs from the source season to determine which perennials to migrate. Only plant references whose IDs appear in the selection list AND are marked perennial SHALL be migrated.

#### Scenario: Selection filters non-perennials

- **WHEN** a migration selection includes the ID of an annual plant
- **THEN** that plant reference is not migrated (only perennials are eligible)

#### Scenario: Selection with unknown IDs

- **WHEN** a migration selection includes an ID not present in the source season
- **THEN** that ID is ignored and no error is raised
