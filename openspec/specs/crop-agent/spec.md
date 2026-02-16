## ADDED Requirements

### Requirement: Crop data subagent registration

The system SHALL register a "crop-data" subagent accessible from the main agent and other subagents. The subagent SHALL have permissions for: crop_create, crop_read, crop_list, crop_remove, and garden_list.

#### Scenario: Subagent is available

- **WHEN** the agent system initializes
- **THEN** a "crop-data" subagent is registered with mode "subagent" and the required tool permissions

### Requirement: Populate crop from plant name

The crop-data subagent SHALL populate a complete crop record from a plant name using its horticultural knowledge. It SHALL use garden_list to look up the user's USDA zone and frost dates to validate timing fields.

#### Scenario: Populate crop for known plant

- **WHEN** the subagent is asked to create crop data for "Roma Tomato" in season "season-1"
- **THEN** the subagent looks up the garden's zone and frost dates, fills in the structured schema from its knowledge, and calls crop_create with the populated record

#### Scenario: Plant with ambiguous data

- **WHEN** the subagent encounters a plant variety it is uncertain about (e.g., spacing or timing)
- **THEN** the subagent flags the uncertain fields and asks the user to confirm before storing

### Requirement: Crop data agent prompt

The subagent SHALL have a dedicated prompt that instructs it to: fill the complete crop schema, use garden context for zone-relative timing, flag low-confidence values, and confirm critical timing fields with the user.

#### Scenario: Prompt guides schema population

- **WHEN** the subagent receives a request to populate crop data
- **THEN** the prompt directs it to fill all schema sections (taxonomy, spacing, seed starting, transplanting, cultivation, harvest) and store the result via crop_create

### Requirement: Crop tools for agent interaction

The system SHALL provide four tools for crop management: crop_create (accepts full Crop.Info), crop_read (accepts seasonId and cropId), crop_list (accepts seasonId), and crop_remove (accepts seasonId and cropId).

#### Scenario: crop_create tool

- **WHEN** the agent calls crop_create with a valid Crop.Info object
- **THEN** the system persists the crop and returns a confirmation with the crop id

#### Scenario: crop_list tool

- **WHEN** the agent calls crop_list with a seasonId
- **THEN** the system returns all crops for that season with name and id summary

#### Scenario: crop_read tool

- **WHEN** the agent calls crop_read with a seasonId and cropId
- **THEN** the system returns the full crop record

#### Scenario: crop_remove tool

- **WHEN** the agent calls crop_remove with a seasonId and cropId
- **THEN** the system removes the crop and returns a confirmation
