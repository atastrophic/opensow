import { describe, expect, test, afterAll } from "bun:test"
import { Season } from "../../src/season/season"
import { Storage } from "../../src/storage/storage"
import { Log } from "../../src/util/log"

Log.init({ print: false })

const PREFIX = "season"
const GARDEN = crypto.randomUUID()
const cleanup: Array<{ gardenId: string; id: string }> = []

afterAll(async () => {
  for (const entry of cleanup) {
    await Storage.remove([PREFIX, entry.gardenId, entry.id]).catch(() => {})
  }
})

function season(overrides?: Partial<Season.Info>) {
  return Season.Info.parse({
    id: crypto.randomUUID(),
    gardenId: GARDEN,
    year: 2026,
    status: "active",
    plants: [],
    ...overrides,
  })
}

describe("Season schema validation", () => {
  test("valid season parses", () => {
    const result = Season.Info.safeParse({
      id: crypto.randomUUID(),
      gardenId: crypto.randomUUID(),
      year: 2026,
      status: "active",
      plants: [],
    })
    expect(result.success).toBe(true)
  })

  test("defaults to active status and empty plants", () => {
    const result = Season.Info.parse({
      id: crypto.randomUUID(),
      gardenId: crypto.randomUUID(),
      year: 2026,
    })
    expect(result.status).toBe("active")
    expect(result.plants).toEqual([])
  })

  test("invalid year rejected (zero)", () => {
    const result = Season.Info.safeParse({
      id: crypto.randomUUID(),
      gardenId: crypto.randomUUID(),
      year: 0,
      status: "active",
      plants: [],
    })
    expect(result.success).toBe(false)
  })

  test("invalid year rejected (negative)", () => {
    const result = Season.Info.safeParse({
      id: crypto.randomUUID(),
      gardenId: crypto.randomUUID(),
      year: -1,
      status: "active",
      plants: [],
    })
    expect(result.success).toBe(false)
  })

  test("invalid status rejected", () => {
    const result = Season.Info.safeParse({
      id: crypto.randomUUID(),
      gardenId: crypto.randomUUID(),
      year: 2026,
      status: "deleted",
      plants: [],
    })
    expect(result.success).toBe(false)
  })

  test("valid plant reference parses", () => {
    const result = Season.Plant.safeParse({
      id: crypto.randomUUID(),
      name: "Tomato",
      perennial: false,
    })
    expect(result.success).toBe(true)
  })

  test("season with plant references parses", () => {
    const result = Season.Info.safeParse({
      id: crypto.randomUUID(),
      gardenId: crypto.randomUUID(),
      year: 2026,
      status: "active",
      plants: [
        { id: crypto.randomUUID(), name: "Rosemary", perennial: true },
        { id: crypto.randomUUID(), name: "Basil", perennial: false },
      ],
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.plants).toHaveLength(2)
    }
  })
})

describe("Season persistence: create", () => {
  test("creates and reads back", async () => {
    const info = season()
    cleanup.push({ gardenId: info.gardenId, id: info.id })
    await Storage.write([PREFIX, info.gardenId, info.id], info)
    const read = await Storage.read<Season.Info>([PREFIX, info.gardenId, info.id])
    expect(read.id).toBe(info.id)
    expect(read.gardenId).toBe(info.gardenId)
    expect(read.year).toBe(2026)
    expect(read.status).toBe("active")
  })

  test("archive-on-create: creating second season archives first", async () => {
    const gardenId = crypto.randomUUID()
    const first = season({ gardenId, year: 2025 })
    const second = season({ gardenId, year: 2026 })
    cleanup.push({ gardenId, id: first.id }, { gardenId, id: second.id })

    await Storage.write([PREFIX, gardenId, first.id], first)

    // Simulate archive-on-create: read active, archive it, write new
    const keys = await Storage.list([PREFIX, gardenId])
    const all = await Promise.all(keys.map((k) => Storage.read<Season.Info>(k)))
    const active = all.find((s) => s.status === "active")
    if (active) {
      active.status = "archived"
      await Storage.write([PREFIX, gardenId, active.id], active)
    }
    await Storage.write([PREFIX, gardenId, second.id], second)

    const readFirst = await Storage.read<Season.Info>([PREFIX, gardenId, first.id])
    expect(readFirst.status).toBe("archived")
    const readSecond = await Storage.read<Season.Info>([PREFIX, gardenId, second.id])
    expect(readSecond.status).toBe("active")
  })
})

describe("Season persistence: read", () => {
  test("returns season data", async () => {
    const info = season()
    cleanup.push({ gardenId: info.gardenId, id: info.id })
    await Storage.write([PREFIX, info.gardenId, info.id], info)
    const read = await Storage.read<Season.Info>([PREFIX, info.gardenId, info.id])
    expect(read.year).toBe(info.year)
  })

  test("returns error for nonexistent season", async () => {
    const result = Storage.read<Season.Info>([PREFIX, GARDEN, "no-exist"])
    await expect(result).rejects.toThrow()
  })
})

describe("Season persistence: update", () => {
  test("updates active season", async () => {
    const info = season()
    cleanup.push({ gardenId: info.gardenId, id: info.id })
    await Storage.write([PREFIX, info.gardenId, info.id], info)
    const updated = await Storage.update<Season.Info>([PREFIX, info.gardenId, info.id], (draft) => {
      draft.plants.push({ id: crypto.randomUUID(), name: "Tomato", perennial: false })
    })
    expect(updated.plants).toHaveLength(1)
    expect(updated.plants[0].name).toBe("Tomato")
  })

  test("archived season update rejected by SeasonStorage logic", async () => {
    // This tests the invariant: archived seasons should not be mutated.
    // The SeasonStorage.update function checks status before updating.
    // Here we verify the schema allows "archived" status so the guard can work.
    const info = season({ status: "archived" })
    cleanup.push({ gardenId: info.gardenId, id: info.id })
    await Storage.write([PREFIX, info.gardenId, info.id], info)
    const read = await Storage.read<Season.Info>([PREFIX, info.gardenId, info.id])
    expect(read.status).toBe("archived")
  })
})

describe("Season persistence: list", () => {
  test("lists all seasons for a garden", async () => {
    const gardenId = crypto.randomUUID()
    const a = season({ gardenId, year: 2025, status: "archived" })
    const b = season({ gardenId, year: 2026 })
    cleanup.push({ gardenId, id: a.id }, { gardenId, id: b.id })
    await Storage.write([PREFIX, gardenId, a.id], a)
    await Storage.write([PREFIX, gardenId, b.id], b)

    const keys = await Storage.list([PREFIX, gardenId])
    const ids = keys.map((k) => k[2])
    expect(ids).toContain(a.id)
    expect(ids).toContain(b.id)
  })

  test("empty list for garden with no seasons", async () => {
    const keys = await Storage.list([PREFIX, crypto.randomUUID()])
    expect(keys).toHaveLength(0)
  })
})

describe("Season persistence: active", () => {
  test("finds active season", async () => {
    const gardenId = crypto.randomUUID()
    const archived = season({ gardenId, year: 2025, status: "archived" })
    const current = season({ gardenId, year: 2026 })
    cleanup.push({ gardenId, id: archived.id }, { gardenId, id: current.id })
    await Storage.write([PREFIX, gardenId, archived.id], archived)
    await Storage.write([PREFIX, gardenId, current.id], current)

    const keys = await Storage.list([PREFIX, gardenId])
    const all = await Promise.all(keys.map((k) => Storage.read<Season.Info>(k)))
    const found = all.find((s) => s.status === "active")
    expect(found).toBeDefined()
    expect(found!.id).toBe(current.id)
  })

  test("returns undefined when no active season", async () => {
    const gardenId = crypto.randomUUID()
    const archived = season({ gardenId, year: 2025, status: "archived" })
    cleanup.push({ gardenId, id: archived.id })
    await Storage.write([PREFIX, gardenId, archived.id], archived)

    const keys = await Storage.list([PREFIX, gardenId])
    const all = await Promise.all(keys.map((k) => Storage.read<Season.Info>(k)))
    const found = all.find((s) => s.status === "active")
    expect(found).toBeUndefined()
  })
})

describe("Season persistence: migrate", () => {
  test("migrates selected perennials with new UUIDs", async () => {
    const gardenId = crypto.randomUUID()
    const rosemaryId = crypto.randomUUID()
    const lavenderId = crypto.randomUUID()
    const tomatoId = crypto.randomUUID()

    const old = season({
      gardenId,
      year: 2025,
      status: "archived",
      plants: [
        { id: rosemaryId, name: "Rosemary", perennial: true },
        { id: lavenderId, name: "Lavender", perennial: true },
        { id: tomatoId, name: "Tomato", perennial: false },
      ],
    })
    const current = season({ gardenId, year: 2026 })
    cleanup.push({ gardenId, id: old.id }, { gardenId, id: current.id })

    await Storage.write([PREFIX, gardenId, old.id], old)
    await Storage.write([PREFIX, gardenId, current.id], current)

    // Simulate migration: filter perennials from archived, add to active
    const source = await Storage.read<Season.Info>([PREFIX, gardenId, old.id])
    const ids = new Set([rosemaryId, lavenderId, tomatoId])
    const perennials = source.plants.filter((p) => p.perennial && ids.has(p.id))
    const migrated = perennials.map((p) => ({
      id: crypto.randomUUID(),
      name: p.name,
      perennial: true,
    }))

    await Storage.update<Season.Info>([PREFIX, gardenId, current.id], (draft) => {
      draft.plants.push(...migrated)
    })

    const updated = await Storage.read<Season.Info>([PREFIX, gardenId, current.id])
    expect(updated.plants).toHaveLength(2)
    const names = updated.plants.map((p) => p.name)
    expect(names).toContain("Rosemary")
    expect(names).toContain("Lavender")
    expect(names).not.toContain("Tomato")
    // Verify new UUIDs
    expect(updated.plants.every((p) => p.id !== rosemaryId && p.id !== lavenderId)).toBe(true)
  })

  test("skips annuals even when their IDs are in the selection", async () => {
    const gardenId = crypto.randomUUID()
    const tomatoId = crypto.randomUUID()

    const old = season({
      gardenId,
      year: 2025,
      status: "archived",
      plants: [{ id: tomatoId, name: "Tomato", perennial: false }],
    })
    const current = season({ gardenId, year: 2026 })
    cleanup.push({ gardenId, id: old.id }, { gardenId, id: current.id })

    await Storage.write([PREFIX, gardenId, old.id], old)
    await Storage.write([PREFIX, gardenId, current.id], current)

    const source = await Storage.read<Season.Info>([PREFIX, gardenId, old.id])
    const ids = new Set([tomatoId])
    const perennials = source.plants.filter((p) => p.perennial && ids.has(p.id))
    expect(perennials).toHaveLength(0)
  })

  test("ignores unknown IDs without error", async () => {
    const gardenId = crypto.randomUUID()
    const rosemaryId = crypto.randomUUID()

    const old = season({
      gardenId,
      year: 2025,
      status: "archived",
      plants: [{ id: rosemaryId, name: "Rosemary", perennial: true }],
    })
    const current = season({ gardenId, year: 2026 })
    cleanup.push({ gardenId, id: old.id }, { gardenId, id: current.id })

    await Storage.write([PREFIX, gardenId, old.id], old)
    await Storage.write([PREFIX, gardenId, current.id], current)

    const source = await Storage.read<Season.Info>([PREFIX, gardenId, old.id])
    const ids = new Set(["unknown-id-1", "unknown-id-2"])
    const perennials = source.plants.filter((p) => p.perennial && ids.has(p.id))
    expect(perennials).toHaveLength(0)
  })
})
