## ADDED Requirements

### Requirement: Garden identity

The system SHALL assign each garden a unique UUID on creation and store a user-provided name.

#### Scenario: Create a garden

- **WHEN** a garden is created with name "Backyard Veggie Patch"
- **THEN** the system assigns a UUID and persists the garden with that name

#### Scenario: Multiple gardens

- **WHEN** a user creates two gardens with names "Backyard" and "Front Yard"
- **THEN** both gardens exist independently with distinct UUIDs

### Requirement: Garden location

The system SHALL store zipcode (string), USDA hardiness zone (integer), first frost date (MM-DD string), and last frost date (MM-DD string) for each garden. All four fields are required.

#### Scenario: Location set on garden

- **WHEN** a garden is created with zipcode "98011", USDA zone 8, first frost "10-15", last frost "04-15"
- **THEN** the garden record contains all four location fields

#### Scenario: Missing location field

- **WHEN** a garden is created without a zipcode
- **THEN** the system rejects the creation with a validation error

### Requirement: Garden owns growing spaces

A garden SHALL contain zero or more growing spaces. Each space has a UUID, a user-provided name, and a type.

#### Scenario: Garden with no spaces

- **WHEN** a garden is created without any spaces
- **THEN** the garden exists with an empty spaces collection

#### Scenario: Add space to garden

- **WHEN** a space named "Main Bed" of type "raised-bed" is added to a garden
- **THEN** the garden contains that space with a UUID and the given name and type
