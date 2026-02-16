import { Bus } from "@/bus"
import { Storage } from "../storage/storage"
import { Season } from "./season"

export namespace SeasonStorage {
  const PREFIX = "season" as const

  export async function create(info: Season.Info) {
    const current = await active(info.gardenId)
    if (current) {
      current.status = "archived"
      await Storage.write([PREFIX, current.gardenId, current.id], current)
      Bus.publish(Season.Event.Archived, { info: current })
    }
    await Storage.write([PREFIX, info.gardenId, info.id], info)
    Bus.publish(Season.Event.Created, { info })
    return info
  }

  export async function read(gardenId: string, id: string) {
    return Storage.read<Season.Info>([PREFIX, gardenId, id]).catch(() => undefined)
  }

  export async function update(gardenId: string, id: string, fn: (draft: Season.Info) => void) {
    const current = await read(gardenId, id)
    if (!current) throw new Error(`Season ${id} not found`)
    if (current.status === "archived") throw new Error("Cannot update archived season")
    const info = await Storage.update<Season.Info>([PREFIX, gardenId, id], fn)
    Bus.publish(Season.Event.Updated, { info })
    return info
  }

  export async function list(gardenId: string) {
    const keys = await Storage.list([PREFIX, gardenId])
    const results = await Promise.all(keys.map((key) => Storage.read<Season.Info>(key)))
    return results
  }

  export async function active(gardenId: string) {
    const all = await list(gardenId)
    return all.find((s) => s.status === "active")
  }

  export async function migrate(gardenId: string, plantIds: string[]) {
    const current = await active(gardenId)
    if (!current) throw new Error("No active season to migrate into")
    const all = await list(gardenId)
    const archived = all.filter((s) => s.status === "archived").sort((a, b) => b.year - a.year)
    if (archived.length === 0) throw new Error("No archived season to migrate from")
    const source = archived[0]
    const ids = new Set(plantIds)
    const perennials = source.plants.filter((p) => p.perennial && ids.has(p.id))
    const migrated = perennials.map((p) => ({
      id: crypto.randomUUID(),
      name: p.name,
      perennial: true,
    }))
    const info = await Storage.update<Season.Info>([PREFIX, gardenId, current.id], (draft) => {
      draft.plants.push(...migrated)
    })
    Bus.publish(Season.Event.Updated, { info })
    return migrated
  }
}
