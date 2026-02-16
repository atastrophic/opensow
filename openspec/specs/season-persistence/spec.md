## ADDED Requirements

### Requirement: Season storage keys

The system SHALL store season data as JSON using the Storage namespace with key path `["season", gardenId, seasonId]`.

#### Scenario: Season storage key format

- **WHEN** a season with id "s-1" for garden "g-1" is persisted
- **THEN** the storage key is `["season", "g-1", "s-1"]`

### Requirement: Create season on disk

The system SHALL write a new season to storage. If an active season already exists for the garden, the system SHALL archive it before writing the new season.

#### Scenario: Create a season

- **WHEN** a season with id "s-1" for garden "g-1" is created
- **THEN** the season is written to storage at key `["season", "g-1", "s-1"]`

#### Scenario: Create archives existing active season

- **WHEN** a season is created for garden "g-1" and season "s-old" is currently active
- **THEN** "s-old" is updated to status "archived" and the new season is written as "active"

### Requirement: Read season from storage

The system SHALL read a season by garden ID and season ID from storage.

#### Scenario: Read existing season

- **WHEN** a season with id "s-1" for garden "g-1" is requested
- **THEN** the system returns the parsed season object

#### Scenario: Read nonexistent season

- **WHEN** a season with id "no-exist" for garden "g-1" is requested
- **THEN** the system returns undefined

### Requirement: Update season in storage

The system SHALL overwrite an existing season's data in storage. Updates to archived seasons SHALL be rejected.

#### Scenario: Update active season

- **WHEN** an active season "s-1" has a plant reference added
- **THEN** the storage entry is overwritten with the updated data

#### Scenario: Update archived season rejected

- **WHEN** an update is attempted on a season with status "archived"
- **THEN** the system rejects the operation with an error indicating archived seasons are readonly

### Requirement: List seasons by garden

The system SHALL list all seasons for a given garden by scanning storage entries with the prefix `["season", gardenId]`.

#### Scenario: List seasons for a garden

- **WHEN** garden "g-1" has seasons "s-1" and "s-2"
- **THEN** the list operation returns both parsed season objects

#### Scenario: List from garden with no seasons

- **WHEN** garden "g-1" has no seasons
- **THEN** the list operation returns an empty array

### Requirement: Find active season for garden

The system SHALL provide a function to find the currently active season for a given garden. Returns the active season or undefined if none exists.

#### Scenario: Garden has active season

- **WHEN** garden "g-1" has an active season "s-1" and an archived season "s-0"
- **THEN** the active lookup returns "s-1"

#### Scenario: Garden has no active season

- **WHEN** garden "g-1" has only archived seasons
- **THEN** the active lookup returns undefined
