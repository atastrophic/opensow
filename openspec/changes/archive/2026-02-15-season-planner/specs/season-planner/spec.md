## ADDED Requirements

### Requirement: Season planner subagent registration

The system SHALL register a "season-planner" subagent accessible from the main agent. The subagent SHALL have permissions for: plan, garden_list, season_list, crop_list, crop_read, and task.

#### Scenario: Subagent is available

- **WHEN** the agent system initializes
- **THEN** a "season-planner" subagent is registered with mode "subagent" and the required tool permissions

### Requirement: Plan tool

The system SHALL provide a `plan` tool that aggregates garden context, active season, all crops, and all spaces into a single structured summary for plan generation. The tool SHALL include each crop's companion and antagonist data, spacing requirements, days to maturity, and seed starting timing.

#### Scenario: Plan with crops and spaces

- **WHEN** the plan tool is called with a gardenId and the active season has 3 crops and the garden has 2 raised beds
- **THEN** the tool returns: garden name, zone, frost dates, current date, each space with dimensions, and each crop with its spacing, companions, antagonists, days to maturity, and seed starting windows

#### Scenario: Plan with no crops

- **WHEN** the plan tool is called and the active season has no crops
- **THEN** the tool returns the garden context and notes that no crops have been added yet

#### Scenario: Plan with no spaces

- **WHEN** the plan tool is called and the garden has no spaces configured
- **THEN** the tool returns the crop list and notes that no growing spaces have been set up

#### Scenario: No active season

- **WHEN** the plan tool is called and the garden has no active season
- **THEN** the tool returns an error message indicating no active season exists

### Requirement: Square foot gardening layout

The season-planner subagent prompt SHALL instruct the LLM to generate a square foot gardening layout for each space. Each space is divided into a grid of 1-foot squares, and crops are assigned to grid cells based on their spacing requirements.

#### Scenario: Raised bed layout

- **WHEN** the subagent generates a plan for a 4x8 raised bed with tomatoes (spacing 24"), basil (spacing 6"), and lettuce (spacing 6")
- **THEN** the layout shows a 4x8 grid with tomatoes occupying 4-square blocks, and basil and lettuce in remaining single squares

#### Scenario: Small container

- **WHEN** the subagent generates a plan for a pot with 12" diameter
- **THEN** the layout notes the pot can hold one plant based on spacing (e.g., one herb or one pepper)

### Requirement: Companion planting consideration

The season-planner subagent prompt SHALL instruct the LLM to place companion plants adjacent to each other and keep antagonists separated in the layout.

#### Scenario: Companions placed together

- **WHEN** tomatoes list basil as a companion
- **THEN** the layout places basil in squares adjacent to tomato squares

#### Scenario: Antagonists separated

- **WHEN** tomatoes list fennel as an antagonist
- **THEN** the layout places fennel as far from tomato squares as possible, ideally in a different bed

### Requirement: Succession planting schedule

The season-planner subagent prompt SHALL instruct the LLM to generate a succession planting schedule for crops that benefit from staggered sowing (short-season crops like lettuce, radishes, beans).

#### Scenario: Lettuce succession

- **WHEN** lettuce has days to maturity of 30-60 and the growing season is 180 days
- **THEN** the schedule recommends sowing lettuce every 2-3 weeks for continuous harvest

#### Scenario: Single-harvest crop

- **WHEN** a crop like tomato has days to maturity of 70-90 and is a long-season crop
- **THEN** no succession schedule is generated for that crop

### Requirement: Season timeline

The season-planner subagent prompt SHALL instruct the LLM to generate a month-by-month timeline showing when to start seeds indoors, direct sow, transplant, and harvest for each crop.

#### Scenario: Timeline for zone 8 garden

- **WHEN** the plan is generated for a zone 8 garden with last frost April 15
- **THEN** the timeline shows indoor seed starting dates (relative to frost), transplant windows, and expected harvest periods for each crop

### Requirement: Season planner agent prompt

The subagent SHALL have a dedicated prompt that defines the output structure: call plan tool, generate square foot layout per space, apply companion planting rules, create succession schedule, produce month-by-month timeline.

#### Scenario: Full planning flow

- **WHEN** the season-planner subagent is invoked
- **THEN** the prompt directs it through: call plan tool, generate layouts, apply companions, schedule successions, produce timeline
