import z from "zod"
import { Tool } from "./tool"
import DESCRIPTION from "./garden-create.txt"
import { Garden } from "../garden/garden"
import { GardenStorage } from "../garden/storage"

export const GardenCreateTool = Tool.define("garden_create", {
  description: DESCRIPTION,
  parameters: z.object({
    name: z.string().describe("A friendly name for the garden"),
    zipcode: z.string().describe("US ZIP code for location-based frost dates and zone"),
    zone: z.string().describe("USDA hardiness zone (e.g. '8b', '6a', '10a')"),
    firstFrost: z.string().describe("Approximate first frost date (e.g. 2024-10-15)"),
    lastFrost: z.string().describe("Approximate last frost date (e.g. 2025-04-15)"),
  }),
  async execute(params) {
    const info = Garden.Info.parse({
      id: crypto.randomUUID(),
      name: params.name,
      zipcode: params.zipcode,
      zone: params.zone,
      firstFrost: params.firstFrost,
      lastFrost: params.lastFrost,
      spaces: [],
    })
    await GardenStorage.create(info)
    return {
      title: info.name,
      metadata: { id: info.id },
      output: `Created garden "${info.name}" (id: ${info.id}) in zone ${info.zone}, zipcode ${info.zipcode}.`,
    }
  },
})
