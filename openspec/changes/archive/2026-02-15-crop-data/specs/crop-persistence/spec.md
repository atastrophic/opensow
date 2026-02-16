## ADDED Requirements

### Requirement: Crop storage key structure

The system SHALL persist crop records using the storage key pattern `["crop", seasonId, cropId]` where seasonId is the owning season's UUID and cropId is the crop's UUID.

#### Scenario: Storage key for a crop

- **WHEN** a crop with id "crop-1" belongs to season "season-1"
- **THEN** the system stores it at key `["crop", "season-1", "crop-1"]`

### Requirement: Create crop

The system SHALL accept a complete or partial `Crop.Info` object and persist it. The system SHALL reject creation if a crop with the same id already exists for that season.

#### Scenario: Create new crop

- **WHEN** a crop with id "crop-1" is created for season "season-1"
- **THEN** the system persists the crop and publishes a "crop.created" event

#### Scenario: Duplicate crop rejected

- **WHEN** a crop with id "crop-1" already exists for season "season-1" and another crop with the same id is created
- **THEN** the system rejects the creation with an error

### Requirement: Read crop

The system SHALL retrieve a single crop record by season ID and crop ID. The system SHALL return undefined if the crop does not exist.

#### Scenario: Read existing crop

- **WHEN** a crop with id "crop-1" exists in season "season-1"
- **THEN** the system returns the full crop record

#### Scenario: Read non-existent crop

- **WHEN** no crop with id "crop-99" exists in season "season-1"
- **THEN** the system returns undefined

### Requirement: List crops by season

The system SHALL list all crop records for a given season ID.

#### Scenario: List crops in a season with records

- **WHEN** season "season-1" has 3 crops
- **THEN** the system returns all 3 crop records

#### Scenario: List crops in an empty season

- **WHEN** season "season-1" has no crops
- **THEN** the system returns an empty array

### Requirement: Remove crop

The system SHALL remove a crop record by season ID and crop ID and publish a "crop.removed" event.

#### Scenario: Remove existing crop

- **WHEN** a crop with id "crop-1" is removed from season "season-1"
- **THEN** the system deletes the record and publishes a "crop.removed" event

#### Scenario: Remove non-existent crop

- **WHEN** no crop with id "crop-99" exists in season "season-1" and a remove is attempted
- **THEN** the system throws an error
