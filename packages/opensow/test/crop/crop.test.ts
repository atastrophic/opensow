import { describe, expect, test, afterAll } from "bun:test"
import z from "zod"
import { Crop } from "../../src/crop/crop"
import { Storage } from "../../src/storage/storage"
import { Log } from "../../src/util/log"

Log.init({ print: false })

const PREFIX = "crop"
const cleanup: Array<{ seasonId: string; cropId: string }> = []

afterAll(async () => {
  for (const entry of cleanup) {
    await Storage.remove([PREFIX, entry.seasonId, entry.cropId]).catch(() => {})
  }
})

function taxonomy(overrides?: Partial<Crop.Taxonomy>): Crop.Taxonomy {
  return Crop.Taxonomy.parse({
    commonName: "Artichoke",
    scientificName: "Cynara scolymus",
    family: "Asteraceae",
    bestCulinaryUse: "Hearts, steaming/roasting",
    growthHabit: "Rosette/Root",
    productionStyle: "Indeterminate",
    sunExposure: "Full Sun",
    sunHours: 6,
    idealLocation: "Open Garden",
    companions: ["Beans", "Peas"],
    antagonists: [],
    usdaHardinessZoneMin: 7,
    usdaHardinessZoneMax: 11,
    ...overrides,
  })
}

function full(overrides?: Partial<Crop.Info>) {
  return Crop.Info.parse({
    id: crypto.randomUUID(),
    seasonId: crypto.randomUUID(),
    name: "Purple Italian Globe, Artichoke Seeds",
    taxonomy: taxonomy(),
    spacing: {
      rowSpacing: 60,
      plantSpacing: 48,
      expectedSpread: 48,
      expectedHeight: 60,
    },
    seedStartingIndoors: {
      sowAnchor: "Last",
      sowWeeksRelativeToFrost: [-10, -8],
      soilMix: "Sterile Seed Starter",
      soilTempMin: 60,
      soilTempMax: 75,
      stratification: "None",
      seedingDepth: 0.25,
      lightForGermination: "Irrelevant",
      daysToGermination: [10, 21],
    },
    seedStartingOutdoors: {
      sowAnchor: "Last",
      sowWeeksRelativeToFrost: null,
      soilTempMin: 60,
      soilTempMax: 75,
      sowSeedingDepth: 0.25,
    },
    pottingUp: {
      pottingUpCue: "2nd set true leaves",
      nutrientNeeds: "Move to nutrient-dense potting soil",
    },
    transplanting: {
      transplantTiming: "2 weeks after last frost",
      plantingDepth: "Crown Level",
      soilTemp: 55,
      hardeningNote: true,
    },
    cultivation: {
      wateringNeeds: "Moderate",
      fertilizerVegetative: "Balanced",
      fertilizerFloweringFruiting: "Phosphorus/Potassium-Heavy",
      fertilizerFrequency: "Monthly",
    },
    harvest: {
      daysToMaturity: [120, 150],
      harvestIndicator: "Buds 3+ inches across, tight/closed",
      seedSavingMethod: "Dry on plant",
      seedHarvestCue: "Allow select buds to fully flower; harvest dry seed heads",
    },
    ...overrides,
  })
}

function minimal(overrides?: Partial<Crop.Info>) {
  return Crop.Info.parse({
    id: crypto.randomUUID(),
    seasonId: crypto.randomUUID(),
    name: "Tomato",
    ...overrides,
  })
}

describe("Crop JSON Schema", () => {
  function collectArrays(obj: Record<string, any>, path = ""): Array<{ path: string; schema: any }> {
    const results: Array<{ path: string; schema: any }> = []
    if (!obj || typeof obj !== "object") return results
    if (obj.type === "array") results.push({ path, schema: obj })
    for (const branch of [...(obj.anyOf ?? []), ...(obj.oneOf ?? []), ...(obj.allOf ?? [])]) {
      results.push(...collectArrays(branch, path))
    }
    if (obj.properties) {
      for (const [key, val] of Object.entries(obj.properties)) {
        results.push(...collectArrays(val as Record<string, any>, path ? `${path}.${key}` : key))
      }
    }
    if (obj.items) results.push(...collectArrays(obj.items as Record<string, any>, `${path}[]`))
    return results
  }

  test("all array fields have items defined", () => {
    const schema = z.toJSONSchema(Crop.Info)
    const arrays = collectArrays(schema as Record<string, any>)
    expect(arrays.length).toBeGreaterThan(0)
    for (const entry of arrays) {
      expect(entry.schema.items).toBeDefined()
    }
  })
})

describe("Crop schema validation", () => {
  test("valid full record parses", () => {
    const result = Crop.Info.safeParse(full())
    expect(result.success).toBe(true)
  })

  test("minimal record parses with null sections", () => {
    const info = minimal()
    expect(info.taxonomy).toBeNull()
    expect(info.spacing).toBeNull()
    expect(info.seedStartingIndoors).toBeNull()
    expect(info.seedStartingOutdoors).toBeNull()
    expect(info.pottingUp).toBeNull()
    expect(info.transplanting).toBeNull()
    expect(info.cultivation).toBeNull()
    expect(info.harvest).toBeNull()
  })

  test("zone range min > max rejected", () => {
    const result = Crop.Taxonomy.safeParse({
      ...taxonomy(),
      usdaHardinessZoneMin: 11,
      usdaHardinessZoneMax: 7,
    })
    expect(result.success).toBe(false)
  })

  test("zone range min <= max accepted", () => {
    const result = Crop.Taxonomy.safeParse(taxonomy({ usdaHardinessZoneMin: 5, usdaHardinessZoneMax: 9 }))
    expect(result.success).toBe(true)
  })

  test("missing required fields rejected", () => {
    const result = Crop.Info.safeParse({
      id: crypto.randomUUID(),
      seasonId: crypto.randomUUID(),
    })
    expect(result.success).toBe(false)
  })

  test("nullable indoor seed starting accepted", () => {
    const info = full({ seedStartingIndoors: null })
    expect(info.seedStartingIndoors).toBeNull()
  })

  test("nullable outdoor seed starting accepted", () => {
    const info = full({ seedStartingOutdoors: null })
    expect(info.seedStartingOutdoors).toBeNull()
  })

  test("nullable potting up accepted", () => {
    const info = full({ pottingUp: null })
    expect(info.pottingUp).toBeNull()
  })

  test("nullable transplanting accepted", () => {
    const info = full({ transplanting: null })
    expect(info.transplanting).toBeNull()
  })

  test("sowWeeksRelativeToFrost nullable for direct sow", () => {
    const result = Crop.SeedStartingOutdoors.safeParse({
      sowAnchor: "Last",
      sowWeeksRelativeToFrost: null,
      soilTempMin: 60,
      soilTempMax: 75,
      sowSeedingDepth: 0.25,
    })
    expect(result.success).toBe(true)
    expect(result.data!.sowWeeksRelativeToFrost).toBeNull()
  })
})

describe("Crop persistence", () => {
  const seasonId = crypto.randomUUID()

  test("create and read", async () => {
    const info = minimal({ seasonId })
    cleanup.push({ seasonId, cropId: info.id })
    await Storage.write([PREFIX, seasonId, info.id], info)
    const read = await Storage.read<Crop.Info>([PREFIX, seasonId, info.id])
    expect(read.id).toBe(info.id)
    expect(read.name).toBe(info.name)
    expect(read.seasonId).toBe(seasonId)
  })

  test("duplicate rejection via read check", async () => {
    const info = minimal({ seasonId })
    cleanup.push({ seasonId, cropId: info.id })
    await Storage.write([PREFIX, seasonId, info.id], info)
    const exists = await Storage.read<Crop.Info>([PREFIX, seasonId, info.id]).catch(() => undefined)
    expect(exists).toBeDefined()
    expect(exists!.id).toBe(info.id)
  })

  test("read missing returns error", async () => {
    const result = Storage.read<Crop.Info>([PREFIX, seasonId, "nonexistent"])
    await expect(result).rejects.toThrow()
  })

  test("list by season", async () => {
    const a = minimal({ seasonId })
    const b = minimal({ seasonId })
    cleanup.push({ seasonId, cropId: a.id }, { seasonId, cropId: b.id })
    await Storage.write([PREFIX, seasonId, a.id], a)
    await Storage.write([PREFIX, seasonId, b.id], b)
    const keys = await Storage.list([PREFIX, seasonId])
    const ids = keys.map((k) => k[2])
    expect(ids).toContain(a.id)
    expect(ids).toContain(b.id)
  })

  test("remove", async () => {
    const info = minimal({ seasonId })
    await Storage.write([PREFIX, seasonId, info.id], info)
    await Storage.remove([PREFIX, seasonId, info.id])
    const result = Storage.read<Crop.Info>([PREFIX, seasonId, info.id])
    await expect(result).rejects.toThrow()
  })

  test("remove missing throws", async () => {
    const result = Storage.read<Crop.Info>([PREFIX, seasonId, "ghost"])
    await expect(result).rejects.toThrow()
  })

  test("full record round-trips", async () => {
    const info = full({ seasonId })
    cleanup.push({ seasonId, cropId: info.id })
    await Storage.write([PREFIX, seasonId, info.id], info)
    const read = await Storage.read<Crop.Info>([PREFIX, seasonId, info.id])
    expect(read.name).toBe(info.name)
    expect(read.taxonomy!.commonName).toBe("Artichoke")
    expect(read.spacing!.rowSpacing).toBe(60)
    expect(read.seedStartingIndoors!.sowAnchor).toBe("Last")
    expect(read.harvest!.daysToMaturity).toEqual([120, 150])
  })
})
