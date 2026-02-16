## ADDED Requirements

### Requirement: Data directory structure

The system SHALL store garden data as JSON files under a configurable root directory at `<root>/gardens/<garden-id>.json`.

#### Scenario: Default data directory

- **WHEN** no custom root is configured
- **THEN** garden data is stored under `~/.opensow/data/gardens/`

#### Scenario: Custom data directory

- **WHEN** the root is configured to "/tmp/opensow-test"
- **THEN** garden files are written under "/tmp/opensow-test/gardens/"

### Requirement: Create garden on disk

The system SHALL write a new garden as a JSON file using Bun.write(). The file name MUST be `<garden-id>.json`.

#### Scenario: Create a garden file

- **WHEN** a garden with id "abc-123" is created
- **THEN** a file `gardens/abc-123.json` is written containing the full garden JSON

#### Scenario: Duplicate ID rejected

- **WHEN** a create is attempted for a garden id that already has a file on disk
- **THEN** the system rejects the operation with an error

### Requirement: Read garden from disk

The system SHALL read a garden by loading its JSON file using Bun.file() and parsing it.

#### Scenario: Read existing garden

- **WHEN** a garden with id "abc-123" is requested
- **THEN** the system reads `gardens/abc-123.json` and returns the parsed object

#### Scenario: Read nonexistent garden

- **WHEN** a garden with id "no-exist" is requested
- **THEN** the system returns null

### Requirement: Update garden on disk

The system SHALL overwrite an existing garden's JSON file with updated data.

#### Scenario: Update a garden

- **WHEN** garden "abc-123" has a new space added
- **THEN** the file `gardens/abc-123.json` is overwritten with the updated JSON

#### Scenario: Update nonexistent garden

- **WHEN** an update is attempted for a garden id with no file on disk
- **THEN** the system rejects the operation with a not-found error

### Requirement: Delete garden from disk

The system SHALL remove a garden's JSON file from disk.

#### Scenario: Delete a garden

- **WHEN** garden "abc-123" is deleted
- **THEN** the file `gardens/abc-123.json` is removed from disk

### Requirement: List all gardens

The system SHALL list all gardens by scanning the gardens directory and reading each JSON file.

#### Scenario: List gardens

- **WHEN** the gardens directory contains "a.json" and "b.json"
- **THEN** the list operation returns both parsed garden objects

#### Scenario: List from empty directory

- **WHEN** the gardens directory is empty or does not exist
- **THEN** the list operation returns an empty array

### Requirement: Directory auto-creation

The system SHALL create the gardens directory automatically on first write if it does not exist.

#### Scenario: First garden created

- **WHEN** a garden is created and the `gardens/` directory does not yet exist
- **THEN** the system creates the directory and writes the file
