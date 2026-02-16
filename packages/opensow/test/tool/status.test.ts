import { describe, expect, test, afterAll } from "bun:test"
import { Storage } from "../../src/storage/storage"
import { Garden } from "../../src/garden/garden"
import { Season } from "../../src/season/season"
import { Crop } from "../../src/crop/crop"
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

describe("Status tool", () => {
  test("no gardens", async () => {
    const gardens = await GardenStorage.list()
    // This tests the empty state — result depends on pre-existing data
    // We verify the function returns without error
    expect(Array.isArray(gardens)).toBe(true)
  })

  test("garden with no season", async () => {
    const g = garden({ name: "Empty Plot" })
    await write("garden", [g.id], g)

    const seasons = await SeasonStorage.list(g.id)
    expect(seasons.length).toBe(0)

    const active = await SeasonStorage.active(g.id)
    expect(active).toBeUndefined()
  })

  test("garden with active season and crops", async () => {
    const g = garden({ name: "Backyard" })
    await write("garden", [g.id], g)

    const s = season(g.id, { year: 2026 })
    await write("season", [g.id, s.id], s)

    const c1 = crop(s.id, { name: "Tomato" })
    const c2 = crop(s.id, { name: "Basil" })
    await write("crop", [s.id, c1.id], c1)
    await write("crop", [s.id, c2.id], c2)

    const active = await SeasonStorage.active(g.id)
    expect(active).toBeDefined()
    expect(active!.year).toBe(2026)

    const crops = await CropStorage.list(s.id)
    expect(crops.length).toBe(2)
  })

  test("garden with active and archived seasons", async () => {
    const g = garden({ name: "Community Plot" })
    await write("garden", [g.id], g)

    const archived1 = season(g.id, { year: 2024, status: "archived" })
    const archived2 = season(g.id, { year: 2025, status: "archived" })
    const current = season(g.id, { year: 2026, status: "active" })
    await write("season", [g.id, archived1.id], archived1)
    await write("season", [g.id, archived2.id], archived2)
    await write("season", [g.id, current.id], current)

    const all = await SeasonStorage.list(g.id)
    expect(all.length).toBe(3)

    const active = await SeasonStorage.active(g.id)
    expect(active).toBeDefined()
    expect(active!.year).toBe(2026)

    const archivedCount = all.filter((s) => s.status === "archived").length
    expect(archivedCount).toBe(2)
  })

  test("multiple gardens aggregate correctly", async () => {
    const g1 = garden({ name: "Front Yard" })
    const g2 = garden({ name: "Side Yard" })
    await write("garden", [g1.id], g1)
    await write("garden", [g2.id], g2)

    const s1 = season(g1.id)
    await write("season", [g1.id, s1.id], s1)

    const c = crop(s1.id, { name: "Lettuce" })
    await write("crop", [s1.id, c.id], c)

    // g1 has active season with 1 crop, g2 has nothing
    const active1 = await SeasonStorage.active(g1.id)
    expect(active1).toBeDefined()

    const active2 = await SeasonStorage.active(g2.id)
    expect(active2).toBeUndefined()

    const crops1 = await CropStorage.list(s1.id)
    expect(crops1.length).toBe(1)
  })
})
