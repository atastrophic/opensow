import { Bus } from "@/bus"
import { Storage } from "../storage/storage"
import { Crop } from "./crop"

export namespace CropStorage {
  const PREFIX = "crop" as const

  export async function create(info: Crop.Info) {
    const exists = await Storage.read([PREFIX, info.seasonId, info.id]).catch(() => undefined)
    if (exists) throw new Error(`Crop with id ${info.id} already exists in season ${info.seasonId}`)
    await Storage.write([PREFIX, info.seasonId, info.id], info)
    Bus.publish(Crop.Event.Created, { info })
    return info
  }

  export async function read(seasonId: string, id: string) {
    return Storage.read<Crop.Info>([PREFIX, seasonId, id]).catch(() => undefined)
  }

  export async function list(seasonId: string) {
    const keys = await Storage.list([PREFIX, seasonId])
    const results = await Promise.all(keys.map((key) => Storage.read<Crop.Info>(key)))
    return results
  }

  export async function remove(seasonId: string, id: string) {
    const info = await read(seasonId, id)
    if (!info) throw new Error(`Crop ${id} not found in season ${seasonId}`)
    await Storage.remove([PREFIX, seasonId, id])
    Bus.publish(Crop.Event.Removed, { info })
    return info
  }
}
