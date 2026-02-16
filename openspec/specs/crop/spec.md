## ADDED Requirements

### Requirement: Crop identity

The system SHALL assign each crop a unique UUID on creation and store a reference to the owning season ID, plus a human-readable name string.

#### Scenario: Create a crop

- **WHEN** a crop is created for season "season-1" with name "Roma Tomato"
- **THEN** the system assigns a UUID and persists the crop with season ID "season-1" and name "Roma Tomato"

### Requirement: Taxonomy and habit section

A crop SHALL contain a taxonomy section with: commonName (string), scientificName (string), family (string), bestCulinaryUse (string), growthHabit (string), productionStyle (string), sunExposure (string), sunHours (positive number), idealLocation (string), companions (array of strings), antagonists (array of strings), usdaHardinessZoneMin (integer 1-13), usdaHardinessZoneMax (integer 1-13).

#### Scenario: Valid taxonomy

- **WHEN** a crop is created with commonName "Artichoke", scientificName "Cynara scolymus", family "Asteraceae", sunHours 6, usdaHardinessZoneMin 7, usdaHardinessZoneMax 11
- **THEN** the system stores all taxonomy fields

#### Scenario: Zone range validation

- **WHEN** a crop is created with usdaHardinessZoneMin 11 and usdaHardinessZoneMax 7
- **THEN** the system rejects the creation with a validation error because min exceeds max

### Requirement: Spacing and dimensions section

A crop SHALL contain a spacing section with: rowSpacing (positive number, inches), plantSpacing (positive number, inches), expectedSpread (positive number, inches), expectedHeight (positive number, inches).

#### Scenario: Valid spacing

- **WHEN** a crop is created with rowSpacing 60, plantSpacing 48, expectedSpread 48, expectedHeight 60
- **THEN** the system stores all spacing fields

### Requirement: Seed starting indoors section

A crop SHALL contain an optional indoor seed starting section with: sowAnchor (enum: "First" or "Last", referring to frost date), sowWeeksRelativeToFrost (tuple of two integers, nullable for plants that cannot be started indoors), soilMix (string), soilTempMin (positive number, Fahrenheit), soilTempMax (positive number, Fahrenheit), stratification (string), seedingDepth (positive number, inches), lightForGermination (string), daysToGermination (tuple of two positive integers representing a range).

#### Scenario: Indoor start with frost-relative timing

- **WHEN** a crop has sowAnchor "Last" and sowWeeksRelativeToFrost [-10, -8]
- **THEN** the system interprets this as "start seeds 10 to 8 weeks before last frost"

#### Scenario: Plant cannot be started indoors

- **WHEN** a crop has seedStartingIndoors set to null
- **THEN** the system accepts the crop without indoor starting data

### Requirement: Direct sow outdoors section

A crop SHALL contain an optional direct sow section with: sowAnchor (enum: "First" or "Last"), sowWeeksRelativeToFrost (tuple of two integers, nullable for plants that cannot be direct sown), soilTempMin (positive number, Fahrenheit), soilTempMax (positive number, Fahrenheit), sowSeedingDepth (positive number, inches).

#### Scenario: Direct sow timing

- **WHEN** a crop has direct sow sowAnchor "Last" and sowWeeksRelativeToFrost [0, 2]
- **THEN** the system interprets this as "direct sow 0 to 2 weeks after last frost"

#### Scenario: Plant cannot be direct sown

- **WHEN** a crop has seedStartingDirectSowOutdoors set to null
- **THEN** the system accepts the crop without direct sow data

### Requirement: Transition potting up section

A crop SHALL contain an optional potting up section with: pottingUpCue (string describing when to pot up) and nutrientNeeds (string describing soil/nutrient requirements at this stage).

#### Scenario: Valid potting up

- **WHEN** a crop has pottingUpCue "2nd set true leaves" and nutrientNeeds "Move to nutrient-dense potting soil"
- **THEN** the system stores the potting up data

#### Scenario: No potting up needed

- **WHEN** a crop has transitionPottingUp set to null
- **THEN** the system accepts the crop without potting up data

### Requirement: Transplanting outdoors section

A crop SHALL contain an optional transplanting section with: transplantTiming (string describing when to transplant), plantingDepth (string), soilTemp (positive number, Fahrenheit), hardeningNote (boolean indicating whether hardening off is needed).

#### Scenario: Valid transplant data

- **WHEN** a crop has transplantTiming "2 weeks after last frost", plantingDepth "Crown Level", soilTemp 55, hardeningNote true
- **THEN** the system stores the transplanting data

#### Scenario: Direct-sow only plant

- **WHEN** a crop has transplantingOutdoors set to null
- **THEN** the system accepts the crop without transplanting data

### Requirement: Cultivation and maintenance section

A crop SHALL contain a cultivation section with: wateringNeeds (string), fertilizerVegetative (string), fertilizerFloweringFruiting (string), fertilizerFrequency (string).

#### Scenario: Valid cultivation data

- **WHEN** a crop has wateringNeeds "Moderate", fertilizerVegetative "Balanced", fertilizerFloweringFruiting "Phosphorus/Potassium-Heavy", fertilizerFrequency "Monthly"
- **THEN** the system stores the cultivation data

### Requirement: Harvest and seed saving section

A crop SHALL contain a harvest section with: daysToMaturity (tuple of two positive integers representing a range), harvestIndicator (string describing when/how to harvest), seedSavingMethod (string), seedHarvestCue (string describing when to harvest seeds).

#### Scenario: Valid harvest data

- **WHEN** a crop has daysToMaturity [120, 150] and harvestIndicator "Buds 3+ inches across, tight/closed"
- **THEN** the system stores the harvest data

### Requirement: Nullable sections for partial data

All sections except id, seasonId, and name SHALL be nullable. The system SHALL accept a crop record with any combination of populated and null sections.

#### Scenario: Minimal crop record

- **WHEN** a crop is created with only id, seasonId, name, and all other sections set to null
- **THEN** the system accepts and persists the crop

#### Scenario: Fully populated crop record

- **WHEN** a crop is created with all sections populated with valid data
- **THEN** the system accepts and persists the complete crop

### Requirement: Crop bus events

The system SHALL publish events when crop records are created, updated, or removed. Events SHALL include the full crop info.

#### Scenario: Crop created event

- **WHEN** a crop is created successfully
- **THEN** the system publishes a "crop.created" event with the crop info

#### Scenario: Crop removed event

- **WHEN** a crop is removed successfully
- **THEN** the system publishes a "crop.removed" event with the crop info
