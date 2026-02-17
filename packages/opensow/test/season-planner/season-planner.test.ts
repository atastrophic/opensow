import { describe, expect, test, afterAll } from "bun:test"
import { Season } from "../../src/season/season"
import { Garden } from "../../src/garden/garden"
import { Crop } from "../../src/crop/crop"
import { Storage } from "../../src/storage/storage"
import { GardenStorage } from "../../src/garden/storage"
import { SeasonStorage } from "../../src/season/storage"
import { CropStorage } from "../../src/crop/storage"
import { Log } from "../../src/util/log"

Log.init({ print: false })

const tracked: Array<{ key: string[] }> = []

function garden(overrides?: Partial<Garden.Info>) {
  return Garden.Info.parse({
    id: crypto.randomUUID(),
    name: "Test Garden",
    zipcode: "98011",
    zone: "8b",
    firstFrost: "Oct 15",
    lastFrost: "Apr 15",
    spaces: [],
    ...overrides,
  })
}

function season(gardenId: string, overrides?: Partial<Season.Info>) {
  return Season.Info.parse({
    id: crypto.randomUUID(),
    gardenId,
    year: 2026,
    status: "active",
    plants: [],
    ...overrides,
  })
}

function crop(seasonId: string, overrides?: Partial<Crop.Info>) {
  return Crop.Info.parse({
    id: crypto.randomUUID(),
    seasonId,
    name: "Tomato",
    ...overrides,
  })
}

async function write(prefix: string, keys: string[], data: unknown) {
  const key = [prefix, ...keys]
  tracked.push({ key })
  await Storage.write(key, data)
}

afterAll(async () => {
  for (const entry of tracked) {
    await Storage.remove(entry.key).catch(() => {})
  }
})

describe("Planner tool logic", () => {
  test("planner context with crops and spaces", async () => {
    const g = garden({
      spaces: [
        {
          id: crypto.randomUUID(),
          name: "Main Bed",
          type: "raised-bed",
          light: "full sun",
          length: 4,
          width: 8,
          watering: "drip",
        },
        {
          id: crypto.randomUUID(),
          name: "Herb Pot",
          type: "pot",
          diameter: 12,
          depth: 10,
          gallons: 3,
        },
      ],
    })
    await write("garden", [g.id], g)
    const s = season(g.id)
    await write("season", [g.id, s.id], s)
    const c1 = crop(s.id, {
      name: "Tomato",
      spacing: { rowSpacing: 36, plantSpacing: 24, expectedSpread: 24, expectedHeight: 60 },
      taxonomy: {
        commonName: "Tomato",
        scientificName: "Solanum lycopersicum",
        family: "Solanaceae",
        bestCulinaryUse: "Fresh, sauce",
        growthHabit: "Vine",
        productionStyle: "Indeterminate",
        sunExposure: "Full Sun",
        sunHours: 8,
        idealLocation: "Open Garden",
        companions: ["Basil", "Carrot"],
        antagonists: ["Fennel"],
        usdaHardinessZoneMin: "3a",
        usdaHardinessZoneMax: "11b",
      },
      harvest: {
        daysToMaturity: [70, 90],
        harvestIndicator: "Fruit fully colored",
        seedSavingMethod: "Ferment",
        seedHarvestCue: "Overripe fruit",
      },
    })
    await write("crop", [s.id, c1.id], c1)
    const c2 = crop(s.id, {
      name: "Basil",
      spacing: { rowSpacing: 12, plantSpacing: 6, expectedSpread: 12, expectedHeight: 18 },
      taxonomy: {
        commonName: "Basil",
        scientificName: "Ocimum basilicum",
        family: "Lamiaceae",
        bestCulinaryUse: "Fresh, pesto",
        growthHabit: "Bush",
        productionStyle: "Determinate",
        sunExposure: "Full Sun",
        sunHours: 6,
        idealLocation: "Open Garden",
        companions: ["Tomato"],
        antagonists: [],
        usdaHardinessZoneMin: "4a",
        usdaHardinessZoneMax: "10b",
      },
      harvest: {
        daysToMaturity: [50, 65],
        harvestIndicator: "Leaves large enough to pinch",
        seedSavingMethod: "Dry",
        seedHarvestCue: "Flower stalks dry",
      },
    })
    await write("crop", [s.id, c2.id], c2)

    const read = await GardenStorage.read(g.id)
    expect(read.spaces.length).toBe(2)
    expect(read.spaces[0].name).toBe("Main Bed")

    const active = await SeasonStorage.active(g.id)
    expect(active).toBeDefined()

    const crops = await CropStorage.list(s.id)
    expect(crops.length).toBe(2)
    const names = crops.map((c) => c.name).sort()
    expect(names).toEqual(["Basil", "Tomato"])
  })

  test("planner with no crops", async () => {
    const g = garden({
      spaces: [
        {
          id: crypto.randomUUID(),
          name: "Raised Bed",
          type: "raised-bed",
          light: "full sun",
          length: 4,
          width: 4,
          watering: "hand",
        },
      ],
    })
    await write("garden", [g.id], g)
    const s = season(g.id)
    await write("season", [g.id, s.id], s)

    const crops = await CropStorage.list(s.id)
    expect(crops.length).toBe(0)
  })

  test("planner with no spaces", async () => {
    const g = garden({ spaces: [] })
    await write("garden", [g.id], g)
    const s = season(g.id)
    await write("season", [g.id, s.id], s)
    const c = crop(s.id, { name: "Lettuce" })
    await write("crop", [s.id, c.id], c)

    const read = await GardenStorage.read(g.id)
    expect(read.spaces.length).toBe(0)

    const crops = await CropStorage.list(s.id)
    expect(crops.length).toBe(1)
  })

  test("planner with no active season", async () => {
    const g = garden()
    await write("garden", [g.id], g)

    const active = await SeasonStorage.active(g.id)
    expect(active).toBeUndefined()
  })

  test("crop companion and antagonist data accessible", async () => {
    const g = garden()
    await write("garden", [g.id], g)
    const s = season(g.id)
    await write("season", [g.id, s.id], s)
    const c = crop(s.id, {
      name: "Tomato",
      taxonomy: {
        commonName: "Tomato",
        scientificName: "Solanum lycopersicum",
        family: "Solanaceae",
        bestCulinaryUse: "Fresh",
        growthHabit: "Vine",
        productionStyle: "Indeterminate",
        sunExposure: "Full Sun",
        sunHours: 8,
        idealLocation: "Open Garden",
        companions: ["Basil", "Carrot"],
        antagonists: ["Fennel", "Dill"],
        usdaHardinessZoneMin: "3a",
        usdaHardinessZoneMax: "11b",
      },
    })
    await write("crop", [s.id, c.id], c)

    const crops = await CropStorage.list(s.id)
    expect(crops.length).toBe(1)
    expect(crops[0].taxonomy).not.toBeNull()
    expect(crops[0].taxonomy!.companions).toEqual(["Basil", "Carrot"])
    expect(crops[0].taxonomy!.antagonists).toEqual(["Fennel", "Dill"])
  })

  test("garden not found returns NotFoundError", async () => {
    const result = await GardenStorage.read("nonexistent-planner-id").catch((e) => {
      if (e instanceof Storage.NotFoundError) return "not_found"
      throw e
    })
    expect(result).toBe("not_found")
  })

  test("multiple spaces with different types", async () => {
    const g = garden({
      spaces: [
        {
          id: crypto.randomUUID(),
          name: "Veggie Bed",
          type: "in-ground",
          light: "full sun",
          length: 10,
          width: 4,
          watering: "sprinkler",
        },
        {
          id: crypto.randomUUID(),
          name: "Seedling Tray",
          type: "tray",
          cells: 72,
          cellSize: 2.5,
        },
        {
          id: crypto.randomUUID(),
          name: "Patio Pot",
          type: "pot",
          diameter: 16,
          depth: 14,
          gallons: 7,
        },
      ],
    })
    await write("garden", [g.id], g)

    const read = await GardenStorage.read(g.id)
    expect(read.spaces.length).toBe(3)
    const types = read.spaces.map((s) => s.type)
    expect(types).toContain("in-ground")
    expect(types).toContain("tray")
    expect(types).toContain("pot")
  })

  test("crop with seed starting windows accessible for timeline", async () => {
    const g = garden()
    await write("garden", [g.id], g)
    const s = season(g.id)
    await write("season", [g.id, s.id], s)
    const c = crop(s.id, {
      name: "Pepper",
      seedStartingIndoors: {
        sowAnchor: "Last",
        sowWeeksRelativeToFrost: [-10, -8],
        soilMix: "Sterile Seed Starter",
        soilTempMin: 70,
        soilTempMax: 85,
        stratification: "None",
        seedingDepth: 0.25,
        lightForGermination: "Light Helpful",
        daysToGermination: [10, 21],
      },
      seedStartingOutdoors: {
        sowAnchor: "Last",
        sowWeeksRelativeToFrost: [2, 4],
        soilTempMin: 65,
        soilTempMax: 85,
        sowSeedingDepth: 0.25,
      },
      harvest: {
        daysToMaturity: [60, 90],
        harvestIndicator: "Fruit firm and colored",
        seedSavingMethod: "Dry",
        seedHarvestCue: "Overripe fruit",
      },
    })
    await write("crop", [s.id, c.id], c)

    const crops = await CropStorage.list(s.id)
    expect(crops.length).toBe(1)
    expect(crops[0].seedStartingIndoors).not.toBeNull()
    expect(crops[0].seedStartingIndoors!.sowWeeksRelativeToFrost).toEqual([-10, -8])
    expect(crops[0].seedStartingOutdoors).not.toBeNull()
    expect(crops[0].seedStartingOutdoors!.sowWeeksRelativeToFrost).toEqual([2, 4])
    expect(crops[0].harvest).not.toBeNull()
    expect(crops[0].harvest!.daysToMaturity).toEqual([60, 90])
  })
})
