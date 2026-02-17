import { describe, expect, test, afterAll } from "bun:test"
import { Season } from "../../src/season/season"
import { Garden } from "../../src/garden/garden"
import { Storage } from "../../src/storage/storage"
import { GardenStorage } from "../../src/garden/storage"
import { SeasonStorage } from "../../src/season/storage"
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

describe("Window tool logic", () => {
  test("garden context readable for window calculation", async () => {
    const g = garden({ name: "Backyard", zone: "8b", lastFrost: "Apr 15", firstFrost: "Oct 15" })
    await write("garden", [g.id], g)
    const s = season(g.id)
    await write("season", [g.id, s.id], s)

    const read = await GardenStorage.read(g.id)
    expect(read.zone).toBe("8b")
    expect(read.lastFrost).toBe("Apr 15")
    expect(read.firstFrost).toBe("Oct 15")

    const active = await SeasonStorage.active(g.id)
    expect(active).toBeDefined()
    expect(active!.year).toBe(2026)
  })

  test("missing garden returns NotFoundError", async () => {
    const result = await GardenStorage.read("nonexistent-id").catch((e) => {
      if (e instanceof Storage.NotFoundError) return "not_found"
      throw e
    })
    expect(result).toBe("not_found")
  })

  test("no active season detectable", async () => {
    const g = garden()
    await write("garden", [g.id], g)
    const active = await SeasonStorage.active(g.id)
    expect(active).toBeUndefined()
  })

  test("frost date parsing — valid date format", () => {
    const date = new Date("Apr 15 2026")
    expect(date.getMonth()).toBe(3)
    expect(date.getDate()).toBe(15)
  })

  test("weeks calculation — before last frost", () => {
    const now = new Date("2026-02-15")
    const last = new Date("Apr 15 2026")
    const weeks = Math.round((last.getTime() - now.getTime()) / (7 * 24 * 60 * 60 * 1000))
    expect(weeks).toBeGreaterThan(0)
    expect(weeks).toBeLessThanOrEqual(9)
  })

  test("weeks calculation — after last frost", () => {
    const now = new Date("2026-05-01")
    const last = new Date("Apr 15 2026")
    const weeks = Math.round((last.getTime() - now.getTime()) / (7 * 24 * 60 * 60 * 1000))
    expect(weeks).toBeLessThanOrEqual(0)
  })

  test("planting categories — before last frost, far out", () => {
    const now = new Date("2026-02-01")
    const last = new Date("Apr 15 2026")
    const weeks = Math.round((last.getTime() - now.getTime()) / (7 * 24 * 60 * 60 * 1000))
    const past = now >= last
    expect(past).toBe(false)
    expect(weeks).toBeGreaterThan(4)
  })

  test("planting categories — before last frost, close", () => {
    const now = new Date("2026-04-01")
    const last = new Date("Apr 15 2026")
    const weeks = Math.round((last.getTime() - now.getTime()) / (7 * 24 * 60 * 60 * 1000))
    const past = now >= last
    expect(past).toBe(false)
    expect(weeks).toBeLessThanOrEqual(4)
  })

  test("planting categories — after last frost", () => {
    const now = new Date("2026-05-01")
    const last = new Date("Apr 15 2026")
    const past = now >= last
    expect(past).toBe(true)
  })

  test("garden with spaces included in context", async () => {
    const g = garden({
      spaces: [
        {
          id: crypto.randomUUID(),
          name: "Main Bed",
          type: "raised-bed",
          light: "full sun",
          length: 8,
          width: 4,
          watering: "drip",
        },
      ],
    })
    await write("garden", [g.id], g)
    const read = await GardenStorage.read(g.id)
    expect(read.spaces.length).toBe(1)
    expect(read.spaces[0].name).toBe("Main Bed")
  })
})
