## MODIFIED Requirements

### Requirement: Plant collection loop

The direct-planting subagent SHALL collect plants one by one from the user. For each plant, it SHALL delegate to the crop-data subagent to populate the full agronomic record. After each plant is successfully added, the subagent SHALL use the `question` tool to ask the user whether to add another plant or finish, instead of waiting for unstructured input.

#### Scenario: User adds one plant

- **WHEN** the user says "tomato"
- **THEN** the subagent delegates to crop-data with the plant name and active season ID

#### Scenario: User adds multiple plants

- **WHEN** the user lists "tomato, basil, pepper"
- **THEN** the subagent delegates to crop-data for each plant in sequence

#### Scenario: After plant is added

- **WHEN** crop-data finishes adding a plant
- **THEN** the subagent uses the `question` tool with options "Add another plant" and "I'm done" to ask the user what to do next

#### Scenario: User is done adding plants

- **WHEN** the user selects "I'm done" from the question options
- **THEN** the subagent summarizes the plants added and ends the collection loop
