## ADDED Requirements

### Requirement: Guided planting subagent registration

The system SHALL register a "guided-planting" subagent accessible from the main agent. The subagent SHALL have permissions for: preference, recommend, garden_list, season_list, and task (to delegate to crop-data).

#### Scenario: Subagent is available

- **WHEN** the agent system initializes
- **THEN** a "guided-planting" subagent is registered with mode "subagent" and the required tool permissions

### Requirement: Gardener type quiz

The guided-planting subagent SHALL present three gardener type options and collect the user's selection: Chef, Parent, or Homesteader.

#### Scenario: User selects Chef

- **WHEN** the subagent presents gardener types and the user picks "Chef"
- **THEN** the subagent records gardenerType as "chef" and proceeds to engagement level

#### Scenario: User selects Parent

- **WHEN** the subagent presents gardener types and the user picks "Parent"
- **THEN** the subagent records gardenerType as "parent" and proceeds to engagement level

#### Scenario: User selects Homesteader

- **WHEN** the subagent presents gardener types and the user picks "Homesteader"
- **THEN** the subagent records gardenerType as "homesteader" and proceeds to engagement level

### Requirement: Engagement level quiz

The guided-planting subagent SHALL present three engagement levels and collect the user's selection: low, standard, or high.

#### Scenario: User selects low engagement

- **WHEN** the subagent presents engagement levels and the user picks "Set It & Forget It"
- **THEN** the subagent records engagement as "low" and proceeds to recommendations

#### Scenario: User selects standard engagement

- **WHEN** the subagent presents engagement levels and the user picks "Weekend Warrior"
- **THEN** the subagent records engagement as "standard" and proceeds to recommendations

#### Scenario: User selects high engagement

- **WHEN** the subagent presents engagement levels and the user picks "Daily Ritual"
- **THEN** the subagent records engagement as "high" and proceeds to recommendations

### Requirement: Preference tool

The system SHALL provide a `preference` tool that persists the user's gardener type and engagement level on the active season. The tool SHALL call SeasonStorage.update to set these fields.

#### Scenario: Save preferences

- **WHEN** the preference tool is called with gardenId, gardenerType "chef", and engagement "standard"
- **THEN** the active season for that garden is updated with gardenerType "chef" and engagement "standard"

#### Scenario: No active season

- **WHEN** the preference tool is called and the garden has no active season
- **THEN** the tool returns an error message indicating no active season exists

### Requirement: Recommend tool

The system SHALL provide a `recommend` tool that returns the user's garden context (zone, frost dates, spaces, gardener type, engagement, current date) as a structured summary. The guided-planting subagent prompt uses this context to generate tailored recommendations.

#### Scenario: Recommend with full context

- **WHEN** the recommend tool is called with a gardenId and the active season has preferences set
- **THEN** the tool returns: garden name, zone, frost dates, space list, gardener type, engagement level, and current date

#### Scenario: Recommend without preferences

- **WHEN** the recommend tool is called and the active season has no gardener type or engagement set
- **THEN** the tool returns the garden context and notes that preferences are not set

### Requirement: Curated recommendations via subagent prompt

The guided-planting subagent prompt SHALL include heuristics for generating recommendations based on gardener type and engagement level. The recommendations SHALL be tailored to the user's zone and current date.

#### Scenario: Chef + Standard recommendations

- **WHEN** the subagent has context showing gardenerType "chef" and engagement "standard" in zone 8b in February
- **THEN** the subagent recommends high-yield cut-and-come-again plants suitable for the zone and planting window (e.g., lettuce, basil, parsley)

#### Scenario: Parent + Low recommendations

- **WHEN** the subagent has context showing gardenerType "parent" and engagement "low" in zone 8b in February
- **THEN** the subagent recommends fast-growing, sensory, hardy plants (e.g., peas, sunflowers, perennial herbs)

### Requirement: Delegate crop creation to crop-data

After the user selects plants from the recommendations, the guided-planting subagent SHALL delegate to the crop-data subagent to populate each plant's full agronomic record.

#### Scenario: User selects two plants

- **WHEN** the user selects "Basil" and "Lettuce" from the curated recommendations
- **THEN** the subagent delegates to crop-data for each plant, providing the plant name and season ID

### Requirement: Guided planting agent prompt

The subagent SHALL have a dedicated prompt that defines the conversational flow: gardener type quiz, engagement level quiz, call recommend tool, present curated recommendations, and delegate selected plants to crop-data.

#### Scenario: Full flow

- **WHEN** the guided-planting subagent is invoked
- **THEN** the prompt directs it through the quiz steps, recommendation generation, and crop-data delegation in order
