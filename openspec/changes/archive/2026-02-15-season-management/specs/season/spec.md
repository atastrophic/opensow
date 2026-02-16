## ADDED Requirements

### Requirement: Season identity

The system SHALL assign each season a unique UUID on creation and store a reference to the owning garden ID, a year (integer), and a status.

#### Scenario: Create a season

- **WHEN** a season is created for garden "garden-1" with year 2026
- **THEN** the system assigns a UUID and persists the season with garden ID "garden-1", year 2026, and status "active"

### Requirement: Season status lifecycle

A season SHALL have exactly one of two statuses: "active" or "archived". A season is created with status "active". Once archived, a season SHALL NOT return to "active".

#### Scenario: New season is active

- **WHEN** a season is created
- **THEN** its status is "active"

#### Scenario: Archived season cannot reactivate

- **WHEN** a season with status "archived" is set to "active"
- **THEN** the system rejects the operation with a validation error

### Requirement: One active season per garden

A garden SHALL have at most one season with status "active" at any time. Creating a new active season SHALL archive the currently active season for that garden (if one exists).

#### Scenario: First season for a garden

- **WHEN** a season is created for a garden with no existing seasons
- **THEN** the season is created with status "active" and no archiving occurs

#### Scenario: New season archives previous

- **WHEN** a season is created for a garden that already has an active season "season-old"
- **THEN** "season-old" is set to status "archived" and the new season is created with status "active"

#### Scenario: Garden with only archived seasons

- **WHEN** a season is created for a garden where all existing seasons are archived
- **THEN** the new season is created with status "active" and no archiving occurs

### Requirement: Season plant references

A season SHALL contain a collection of plant references. Each plant reference has an id (UUID), a name (string), and a perennial flag (boolean).

#### Scenario: Season with plant references

- **WHEN** a season is created and a plant reference with id "plant-1", name "Tomato", perennial false is added
- **THEN** the season contains that plant reference

#### Scenario: Season with no plants

- **WHEN** a season is created without any plant references
- **THEN** the season exists with an empty plant references collection

### Requirement: Season year tracking

A season SHALL store a year as a positive integer. The year represents the growing season's calendar year.

#### Scenario: Valid year

- **WHEN** a season is created with year 2026
- **THEN** the season stores year 2026

#### Scenario: Invalid year rejected

- **WHEN** a season is created with year 0 or a negative number
- **THEN** the system rejects the creation with a validation error
