## ADDED Requirements

### Requirement: Four growing space types

The system SHALL support exactly four space types: "in-ground", "raised-bed", "pot", and "tray".

#### Scenario: Valid space type

- **WHEN** a space is created with type "raised-bed"
- **THEN** the space is accepted

#### Scenario: Invalid space type

- **WHEN** a space is created with type "aquaponic"
- **THEN** the system rejects it with a validation error

### Requirement: Bed attributes for in-ground and raised beds

Spaces of type "in-ground" or "raised-bed" SHALL store light (string), length (inches, number), width (inches, number), and watering (string).

#### Scenario: In-ground bed with all attributes

- **WHEN** a space of type "in-ground" is created with light "full-sun", length 48, width 24, watering "drip"
- **THEN** all four attributes are persisted on the space

#### Scenario: Raised bed with all attributes

- **WHEN** a space of type "raised-bed" is created with light "partial-shade", length 96, width 48, watering "hand"
- **THEN** all four attributes are persisted on the space

### Requirement: Pot and container attributes

Spaces of type "pot" SHALL store diameter (inches, number), depth (inches, number), and gallons (number).

#### Scenario: Pot with known gallons

- **WHEN** a space of type "pot" is created with diameter 14, depth 12, gallons 5
- **THEN** all three attributes are persisted

#### Scenario: Pot with estimated gallons

- **WHEN** a space of type "pot" is created with diameter 14, depth 12, and no gallons value
- **THEN** the system estimates gallons from diameter and depth and persists the estimate

### Requirement: Indoor tray attributes

Spaces of type "tray" SHALL store cells (integer). The value MUST be one of 32, 48, 72, or 128.

#### Scenario: Valid tray cell count

- **WHEN** a space of type "tray" is created with cells 72
- **THEN** the space is persisted with cells 72

#### Scenario: Invalid tray cell count

- **WHEN** a space of type "tray" is created with cells 50
- **THEN** the system rejects it because cells MUST be one of 32, 48, 72, or 128

### Requirement: Tray cell size estimation

The system SHALL estimate average cell size (cubic inches) given the cells-per-tray selection.

#### Scenario: Estimate for 72-cell tray

- **WHEN** a tray is created with cells 72
- **THEN** the system stores an estimated cell size based on standard 72-cell tray dimensions

#### Scenario: Estimate for 32-cell tray

- **WHEN** a tray is created with cells 32
- **THEN** the system stores a larger estimated cell size than a 72-cell tray
