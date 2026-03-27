# Garden Management Agent Specification

## Overview
A comprehensive garden management agent that helps users plan and optimize their gardens across multiple space types (inground beds, raised beds, containers, pots, and indoor growing systems). The agent uses square foot gardening methodology for bed planning and generates dated markdown plans saved to the filesystem.

---

## Core Agent Descriptions

### 1. **Space Inventory Agent**
**Purpose:** Catalog and manage available growing spaces with precise dimensions and characteristics.

**Capabilities:**
- Document inground beds with dimensions (length × width), soil conditions, and drainage
- Catalog raised beds with exact square footage and construction details
- Record container inventory with specific sizes (gallons/liters) and available quantities
- Track pot collections with drainage, material, and accessibility
- Document indoor growing systems (seed trays, propagation units, shelving)
- Map sun exposure for each space: full sun (6+ hrs), part sun (3-6 hrs), part shade (1-3 hrs), full shade
- Track seasonal changes in light availability

**Output:**
- Structured space inventory JSON with metadata
- Space utilization summary and capacity planning

---

### 2. **Plant Selection & Variety Agent**
**Purpose:** Recommend appropriate plants based on USDA hardiness zone, timing, and space constraints.

**Capabilities:**
- Filter varieties by USDA hardiness zone (1-13)
- Cross-reference planting dates against current date and frost calendars
- Match plant requirements (sun/shade/space) to available locations
- Distinguish between direct sow vs. transplant requirements
- Identify seed starting vs. transplant timing windows
- Track crop days to maturity for succession planning
- Source plant data including:
  - Seed company recommendations
  - Days to germination
  - Days to harvest/maturity
  - Spacing requirements (in-row and between-row)
  - Temperature preferences (germination, growing)
  - Water and nutrient needs

**Output:**
- Curated plant lists matching zone and season
- Variety recommendations with sourcing information
- Germination and maturity timelines

---

### 3. **Companion Planting & Layout Agent**
**Purpose:** Design plant arrangements maximizing beneficial interactions and space efficiency.

**Capabilities:**
- Apply square foot gardening grid methodology for inground and raised beds
- Calculate square footage allocations based on plant spacing requirements
- Map companion planting relationships:
  - Beneficial pairings (tomato + basil, carrot + onion)
  - Antagonistic combinations to avoid
  - Pest and disease suppression partnerships
  - Nitrogen-fixing crop rotations
- Design container and pot arrangements considering:
  - Root depth requirements
  - Mature plant heights (for shade casting)
  - Drainage needs
  - Nutrient competition
- Generate visual layout plans with coordinates
- Account for succession planting overlaps in space planning

**Output:**
- Square foot garden maps with plant positions and quantities
- Container arrangement diagrams
- Companion planting notes and rationale
- Space utilization percentages

---

### 4. **Frost Calendar & Timing Agent**
**Purpose:** Coordinate planting schedules with local climate windows and frost dates.

**Capabilities:**
- Retrieve USDA hardiness zone frost dates:
  - Last spring frost date
  - First fall frost date
- Calculate seed starting windows:
  - Days before last frost for transplant-ready seedlings
  - Direct sow timing windows
- Account for:
  - Crop maturity timelines
  - Indoor seed starting duration
  - Hardening off periods (7-10 days)
  - Cool/warm season crop classifications
- Identify overlap periods where indoor starting must occur while outdoor crops are still growing
- Provide multiple succession planting windows throughout the season

**Output:**
- Detailed frost calendar with key dates highlighted
- Week-by-week planting timeline
- Seed starting schedule with indoor/outdoor transitions
- Multiple succession windows for continuous harvest

---

### 5. **Succession Planting Agent**
**Purpose:** Maximize productivity by planning sequential plantings throughout the growing season.

**Capabilities:**
- Schedule succession plantings for fast-maturing crops (lettuce, radishes, beans)
- Calculate intervals between plantings based on:
  - Days to harvest
  - Desired harvest overlap/continuous supply
  - Frost date constraints
  - Space availability after previous crop harvest
- Identify crop rotation opportunities:
  - Nitrogen-fixing legumes following heavy feeders
  - Disease cycle interruption through crop family rotation
  - Soil health improvement through varied root depths
- Plan overlapping indoor seed starting with outdoor growing:
  - Start transplants for fall crop while harvesting summer crop
  - Prepare succession plantings while space is occupied
- Account for soil amendment and rest periods between crops

**Output:**
- Succession planting calendar with sow dates and harvest dates
- Space recovery schedule (when beds/containers become available)
- Crop rotation plan across seasons and years
- Harvest timeline projections

---

### 6. **Plan Generation & Persistence Agent**
**Purpose:** Generate comprehensive markdown plans and maintain filesystem-based garden history.

**Capabilities:**
- Create structured markdown documents organized by:
  - Year (e.g., `/garden-plans/2026/`)
  - Season or quarter (spring, summer, fall, winter)
  - Specific bed/space sections
- Generate markdown sections including:
  - Executive summary (zones, spaces, key dates)
  - Space inventory with illustrations
  - Frost calendar and key dates table
  - Planting timeline (week-by-week)
  - Detailed bed/container layouts with coordinates
  - Companion planting rationale
  - Succession planting schedule
  - Shopping list (seeds, amendments, supplies)
  - Monthly task checklist
  - Notes for reflection and next year improvements
- Commit plans to git with descriptive messages
- Maintain versioning for plan iterations
- Archive completed seasons for reference
- Generate comparison reports between years

**Output:**
- Timestamped markdown plan files
- Directory structure: `garden-plans/YYYY/SEASON/`
- Git history with meaningful commit messages
- Accessible reference documentation

---

## Integration & Workflow

### User Interaction Flow:

1. **Garden Setup** (One-time or annual)
   - User provides USDA zone, location, date
   - Space Inventory Agent catalogs available growing areas
   - Agent stores configuration for future planning

2. **Plant Selection**
   - User specifies desired crops or Plant Selection Agent recommends options
   - Agent filters by zone, current season, and available space
   - User reviews and selects varieties

3. **Layout Planning**
   - Companion Planting Agent designs arrangements
   - Agent allocates space using square foot gardening
   - User approves or requests modifications

4. **Schedule Creation**
   - Frost Calendar Agent pulls local climate data
   - Succession Planting Agent creates multi-crop timelines
   - Agent generates complete planting schedule

5. **Plan Documentation**
   - Plan Generation Agent creates comprehensive markdown plan
   - Agent commits to filesystem with git
   - User downloads or accesses plan

6. **Ongoing Management**
   - Agent tracks actual planting dates vs. planned dates
   - Agent records harvest results and observations
   - Agent suggests adjustments for next season

---

## Data Structures

### Space Inventory Format:
```json
{
  "spaces": [
    {
      "id": "bed-a",
      "type": "raised_bed",
      "dimensions": { "length": 8, "width": 4, "unit": "feet" },
      "squareFeetage": 32,
      "sunExposure": { "summer": "full_sun", "winter": "part_shade" },
      "soilType": "loamy",
      "drainage": "excellent",
      "notes": "Built 2023"
    },
    {
      "id": "container-5gal",
      "type": "container",
      "size": { "capacity": 5, "unit": "gallon" },
      "quantity": 6,
      "material": "fabric",
      "location": "patio",
      "sunExposure": "part_sun"
    }
  ]
}
```

### Plant Record Format:
```json
{
  "commonName": "Cherry Tomato",
  "variety": "Sungold",
  "usda_zones": "3-11",
  "spacingSquareFt": 1.0,
  "daysToMaturity": 65,
  "daysTillHarvest": 85,
  "sunRequirement": "full_sun",
  "containerSize": "5_gallon",
  "startIndoors": true,
  "weeksBeforeFrost": 6,
  "companions": ["basil", "carrot"],
  "avoid": ["brassicas"],
  "notes": "Prolific producer, succession plant every 2 weeks"
}
```

### Plan Structure:
```
garden-plans/
├── 2026/
│   ├── GARDEN_PLAN_2026_SPRING.md
│   ├── GARDEN_PLAN_2026_SUMMER.md
│   ├── GARDEN_PLAN_2026_FALL.md
│   └── notes_2026.md
├── 2025/
│   ├── GARDEN_PLAN_2025_SPRING.md
│   ├── [completed season files]
│   └── notes_2025.md
```

---

## Agent Orchestration Requirements

- Agents operate with clear input/output contracts
- Agents can call other agents when needed (e.g., Layout Agent → Companion Planting Agent)
- All data persisted to filesystem with git integration
- Plans are human-readable markdown, not just JSON
- Agent provides explanations for recommendations
- User can override agent suggestions and agent records changes

---

## Success Criteria

✓ Comprehensive garden planning covering all space types
✓ Frost-aware scheduling with succession planting
✓ Square foot gardening methodology enforced
✓ Markdown plans organized by year on filesystem
✓ Git-tracked plan history
✓ Companion planting intelligence
✓ Container-specific planning with gallon capacities
✓ Multi-year reference capability
