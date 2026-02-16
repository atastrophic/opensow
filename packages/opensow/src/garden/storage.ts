import { Bus } from "@/bus"
import { Storage } from "../storage/storage"
import { Garden } from "./garden"

export namespace GardenStorage {
  const PREFIX = "garden" as const

  export async function create(info: Garden.Info) {
    const exists = await Storage.read([PREFIX, info.id]).catch(() => undefined)
    if (exists) throw new Error(`Garden with id ${info.id} already exists`)
    await Storage.write([PREFIX, info.id], info)
    Bus.publish(Garden.Event.Created, { info })
    return info
  }

  export async function read(id: string) {
    return Storage.read<Garden.Info>([PREFIX, id])
  }

  export async function update(id: string, fn: (draft: Garden.Info) => void) {
    const info = await Storage.update<Garden.Info>([PREFIX, id], fn)
    Bus.publish(Garden.Event.Updated, { info })
    return info
  }

  export async function remove(id: string) {
    const info = await Storage.read<Garden.Info>([PREFIX, id])
    await Storage.remove([PREFIX, id])
    Bus.publish(Garden.Event.Deleted, { info })
    return info
  }

  export async function list() {
    const keys = await Storage.list([PREFIX])
    const results = await Promise.all(keys.map((key) => Storage.read<Garden.Info>(key)))
    return results
  }
}
