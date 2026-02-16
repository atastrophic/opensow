import { describe, expect, test, afterAll } from "bun:test"
import { Season } from "../../src/season/season"
import { Garden } from "../../src/garden/garden"
import { Storage } from "../../src/storage/storage"
import { SeasonStorage } from "../../src/season/storage"
import { GardenStorage } from "../../src/garden/storage"
import { Log } from "../../src/util/log"

Log.init({ print: false })

const tracked: Array<{ key: string[] }> = []

function garden(overrides?: Partial<Garden.Info>) {
  return Garden.Info.parse({
    id: crypto.randomUUID(),
    name: "Test Garden",
    zipcode: "98011",
    zone: 8,
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

describe("Season preference fields", () => {
  test("season without preferences parses (backward compatible)", () => {
    const info = Season.Info.parse({
      id: crypto.randomUUID(),
      gardenId: crypto.randomUUID(),
      year: 2026,
    })
    expect(info.gardenerType).toBeUndefined()
    expect(info.engagement).toBeUndefined()
    expect(info.status).toBe("active")
  })

  test("season with preferences parses", () => {
    const info = Season.Info.parse({
      id: crypto.randomUUID(),
      gardenId: crypto.randomUUID(),
      year: 2026,
      gardenerType: "chef",
      engagement: "standard",
    })
    expect(info.gardenerType).toBe("chef")
    expect(info.engagement).toBe("standard")
  })

  test("all gardener types accepted", () => {
    for (const type of ["chef", "parent", "homesteader"] as const) {
      const result = Season.GardenerType.safeParse(type)
      expect(result.success).toBe(true)
    }
  })

  test("invalid gardener type rejected", () => {
    const result = Season.GardenerType.safeParse("wizard")
    expect(result.success).toBe(false)
  })

  test("all engagement levels accepted", () => {
    for (const level of ["low", "standard", "high"] as const) {
      const result = Season.Engagement.safeParse(level)
      expect(result.success).toBe(true)
    }
  })

  test("invalid engagement rejected", () => {
    const result = Season.Engagement.safeParse("extreme")
    expect(result.success).toBe(false)
  })
})

describe("Preference persistence", () => {
  test("preferences round-trip through storage", async () => {
    const g = garden()
    const s = season(g.id, { gardenerType: "parent", engagement: "high" })
    await write("season", [g.id, s.id], s)
    const read = await Storage.read<Season.Info>(["season", g.id, s.id])
    expect(read.gardenerType).toBe("parent")
    expect(read.engagement).toBe("high")
  })

  test("update preferences on existing season", async () => {
    const g = garden()
    const s = season(g.id)
    await write("season", [g.id, s.id], s)
    const before = await Storage.read<Season.Info>(["season", g.id, s.id])
    expect(before.gardenerType).toBeUndefined()
    await Storage.update<Season.Info>(["season", g.id, s.id], (draft) => {
      draft.gardenerType = "homesteader"
      draft.engagement = "low"
    })
    const after = await Storage.read<Season.Info>(["season", g.id, s.id])
    expect(after.gardenerType).toBe("homesteader")
    expect(after.engagement).toBe("low")
  })
})

describe("Recommend context", () => {
  test("garden context readable for recommendations", async () => {
    const g = garden({ name: "Backyard", zone: 8 })
    await write("garden", [g.id], g)
    const s = season(g.id, { gardenerType: "chef", engagement: "standard" })
    await write("season", [g.id, s.id], s)

    const gardens = await GardenStorage.list()
    const found = gardens.find((x) => x.id === g.id)
    expect(found).toBeDefined()
    expect(found!.zone).toBe(8)

    const active = await SeasonStorage.active(g.id)
    expect(active).toBeDefined()
    expect(active!.gardenerType).toBe("chef")
    expect(active!.engagement).toBe("standard")
  })

  test("recommend context without preferences", async () => {
    const g = garden({ name: "Side Yard" })
    await write("garden", [g.id], g)
    const s = season(g.id)
    await write("season", [g.id, s.id], s)

    const active = await SeasonStorage.active(g.id)
    expect(active).toBeDefined()
    expect(active!.gardenerType).toBeUndefined()
    expect(active!.engagement).toBeUndefined()
  })
})
