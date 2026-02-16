# OpenSow

Use AI Agents for planning and growing vegetables and fruits.

The app revolves around gardens and seasons. A user can setup their garden and go through different seasons where each season starts next calendar year (January).

Each garden has its own ongoing season, only one at a time. A user can setup multiple gardens.
Old seasons are archived and become readonly.

All of these steps must be performed using main agent (Gartenmeister) which drives all workflows.

---

## Implementation Tracking

Features are implemented as separate OpenSpec changes (step-by-step workflow).
Code lives in `packages/opensow`. Progress tracked below.

Each change is self-contained: it defines its own data model, persistence, and agent logic.
Do NOT create cross-cutting "data model" or "infrastructure" changes that span multiple features.

| #   | Change Name         | Scope                                                                                                                                         | Deps       | Status   | OpenSpec Phase |
| --- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- | -------------- |
| 1   | `garden-setup`      | Garden entity (location, USDA zone, frost dates, spaces), persistence for gardens, setup agent that walks user through configuration          | --         | complete | archived       |
| 2   | `season-management` | Season entity (active/archived, one-per-garden, readonly), perennial migration, season management agent                                       | #1         | complete | archived       |
| 3   | `crop-data`         | Plant entity (full schema: taxonomy, spacing, seed starting, transplanting, cultivation, harvest), persistence for plants, crop data subagent | #1         | complete | archived       |
| 4   | `gartenmeister`     | Main orchestrating agent that routes to specialized sub-agents                                                                                | #1, #2, #3 | complete | archived       |
| 5   | `guided-planting`   | Gardener type quiz (Chef/Parent/Homesteader), engagement level, curated recommendations subagent                                              | #2, #3, #4 | complete | archived       |
| 6   | `direct-planting`   | Collect plants for full season or current planting window, subagent                                                                           | #2, #3, #4 | complete | archived       |
| 7   | `season-planner`    | Companion/succession planting, square foot gardening plan generation subagent                                                                 | #2, #3, #4 | complete | archived       |

**Status values:** `pending` | `in-progress` | `complete`
**OpenSpec phases:** `new` | `proposal` | `specs` | `design` | `tasks` | `apply` | `verify` | `archived`

---

## Requirements

### Garden Setup (use dedicated/specialized agent)

- Ask user location (zipcode)
  - Confirm USDA hardiness zone
  - Confirm and show first/last frost dates
- Set up available space by walking through types of spaces user may have
- Ask for indoor/greenhouse seed starting cells/trays
- Check if user owns a greenhouse or starts seeds indoors
- For seed starter cells/trays, ask for count of cells per tray
  - User must pick from 32, 48, 72, 128 cells/tray options
  - System estimates average cell size given cells/tray selection
- For in-ground and raised beds ask for:
  - Light conditions
  - Length x width
  - Watering method (helps with suggestions when to water)
- For pots and containers:
  - Ask for outer diameter
  - Depth/height
  - Total gallons (estimate if user doesn't know)

### Season Management (use dedicated/specialized agent)

- Start new season
- If user has existing season, move perennial plants over
  - Show all plants with perennials pre-selected to move
  - Allow further selection (some plants can be overwintered indoors or in greenhouse)
- Check if user knows what they want to plant or needs ideas

### Guided Planting Ideas (use dedicated/specialized subagent)

For users who want ideas:

**Step 1: "Choose Your Gardener Type" (The Class Selection)**
Present 3-4 cards with visuals and simple titles. This sets the "Theme" of their dashboard.

- **The Chef:** "I want fresh herbs and greens to upgrade my cooking."
  - Hidden logic: Prioritize high-yield, cut-and-come-again plants (Basil, Lettuce, Parsley)
- **The Parent:** "I want to teach my kids where food comes from."
  - Hidden logic: Prioritize sensory, fast-growing, large-seed plants (Peas, Sunflowers, Radishes, Strawberries)
- **The Homesteader:** "I want to reduce my grocery bill and feed the family."
  - Hidden logic: Prioritize calorie-dense, high-volume crops (Potatoes, Tomatoes, Zucchini, Beans)

**Step 2: "Set Your Engagement Level" (The Difficulty Setting)**
Ask about their desired relationship with the garden.

- **"Set It & Forget It"** (Low): "I want to plant once and check in occasionally."
  - Suggest perennials, hardy shrubs, automated irrigation tips. Avoid fussy plants.
- **"The Weekend Warrior"** (Standard): "I can dedicate a few hours on Saturday or Sunday."
  - Balanced mix. Standard veggies that need weekly weeding/watering.
- **"The Daily Ritual"** (High): "I love checking my plants every morning with coffee."
  - High-maintenance, high-reward plants (hothouse tomatoes, trellis systems, bonsai).

Once complete, the suggestions page transforms into a tailored "Curated Collection."

**Example Scenario:**

- User: Parent + Weekend Warrior + Backyard
- Date: Feb 14, Location: Bothell, WA
- Recommendations:
  - "For the Toddler": Sugar Snap Peas (large seeds, sprout in cold, sweet to eat raw in May)
  - "For the Kitchen": Asian Greens, Perennial Herbs
  - "The Long Game": Blueberry Bush (acidic soil in Bothell)

### Direct Plant Selection (use dedicated/specialized subagent)

For users who know what they want to plant:

- Ask if they want to plan entire season or what can go in now
- If entire season: collect all plants one by one
- Otherwise: collect what they want to grow right now
- For each plant, store key gardening attributes in a consistent format (use crop-data subagent)

### Season Planning (use dedicated/specialized subagent)

Given all collected information and current time of year:

- Create a plan for the season
- Consider companion planting and succession planting
- Always plan according to square foot gardening

### Design Principles

- NO: Generic plant database with 5,000 species
- NO: Complex companion planting matrices (unless hidden behind "Pro" toggle)
- YES: "Recipe-First" approach (e.g., "Grow a Salsa Garden" bundle)

## plant database format

The crop data subsgent must return and store data in following format for each
plant whether when each plant is provided by user or when part of the suggestions.

{
"id": "34178c73-feb1-4d06-bfc6-2c66d8b6c6c7",
"name": "Purple Italian Globe, Artichoke Seeds",
"speciesTaxonomyAndHabit": {
"commonName": "Artichoke",
"scientificName": "Cynara scolymus",
"family": "Asteraceae",
"bestCulinaryUse": "Hearts, steaming/roasting, dips",
"growthHabit": "Rosette/Root",
"productionStyle": "Indeterminate",
"sunExposure": "Full Sun",
"sunHours": 6,
"idealLocation": "Open Garden",
"companions": [
"Beans",
"Peas",
"Thyme"
],
"antagonists": [],
"usdaHardinessZoneMin": 7,
"usdaHardinessZoneMax": 11
},
"spacingAndDimensions": {
"rowSpacing": 60,
"plantSpacing": 48.0,
"expectedSpread": 48,
"expectedHeight": 60
},
"seedStartingIndoors": {
"sowAnchor": "Last",
"sowWeeksRelativeToFrost": [
-10,
-8
],
"soilMix": "Sterile Seed Starter",
"soilTempMin": 60,
"soilTempMax": 75,
"stratification": "None",
"seedingDepth": 0.25,
"lightForGermination": "Irrelevant",
"daysToGermination": [
10,
21
]
},
"seedStartingDirectSowOutdoors": {
"sowAnchor": "Last",
"sowWeeksRelativeToFrost": null,
"soilTempMin": 60,
"soilTempMax": 75,
"sowSeedingDepth": 0.25
},
"transitionPottingUp": {
"pottingUpCue": "2nd set true leaves",
"nutrientNeeds": "Move to nutrient-dense potting soil; vernalize (expose to 50°F) for 10 days if growing as annual"
},
"transplantingOutdoors": {
"transplantTiming": "2 weeks after last frost",
"plantingDepth": "Crown Level",
"soilTemp": 55,
"hardeningNote": true
},
"cultivationAndMaintenance": {
"wateringNeeds": "Moderate",
"fertilizerVegetative": "Balanced",
"fertilizerFloweringFruiting": "Phosphorus/Potassium-Heavy",
"fertilizerFrequency": "Monthly"
},
"harvestAndSeedSaving": {
"daysToMaturity": [
120,
150
],
"harvestIndicator": "Buds 3+ inches across, tight/closed; cut with 1-3 inches stem",
"seedSavingMethod": "Dry on plant",
"seedHarvestCue": "Allow select buds to fully flower; harvest dry seed heads"
}
}
