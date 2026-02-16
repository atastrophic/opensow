import z from "zod"
import { Tool } from "./tool"
import DESCRIPTION from "./window.txt"
import { GardenStorage } from "../garden/storage"
import { SeasonStorage } from "../season/storage"
import { CropStorage } from "../crop/storage"
import { Storage } from "../storage/storage"

export const WindowTool = Tool.define("window", {
  description: DESCRIPTION,
  parameters: z.object({
    gardenId: z.string().describe("The garden ID"),
  }),
  async execute(args) {
    const garden = await GardenStorage.read(args.gardenId).catch((e) => {
      if (e instanceof Storage.NotFoundError) return undefined
      throw e
    })
    if (!garden)
      return {
        title: "Window",
        metadata: {},
        output: "Garden not found. Use garden_list to see available gardens.",
      }
    const active = await SeasonStorage.active(args.gardenId)
    if (!active)
      return {
        title: "Window",
        metadata: {},
        output: "No active season found for this garden. Start a season first.",
      }
    const crops = await CropStorage.list(active.id)
    const now = new Date()
    const last = parse(garden.lastFrost, now.getFullYear())
    const first = parse(garden.firstFrost, now.getFullYear())
    const weeks = Math.round((last.getTime() - now.getTime()) / (7 * 24 * 60 * 60 * 1000))
    const past = now >= last
    const categories = [] as string[]
    if (!past) {
      categories.push(`Indoor seed starting: ACTIVE (${Math.abs(weeks)} weeks until last frost on ${garden.lastFrost})`)
      if (weeks <= 4)
        categories.push("Direct sow outdoors: cold-hardy crops only (lettuce, peas, spinach, radishes, kale)")
      if (weeks > 4) categories.push("Direct sow outdoors: too early for most crops, wait closer to last frost")
      categories.push("Transplant outdoors: not yet — wait until after last frost")
    }
    if (past) {
      categories.push("Indoor seed starting: ACTIVE (can start succession plantings)")
      categories.push("Direct sow outdoors: ACTIVE — all crops can be direct sown")
      categories.push("Transplant outdoors: ACTIVE — safe to transplant hardened seedlings")
    }
    const lines = [
      `## Planting Window`,
      `- Garden: ${garden.name}`,
      `- USDA Zone: ${garden.zone}`,
      `- Last Frost: ${garden.lastFrost}`,
      `- First Frost: ${garden.firstFrost}`,
      `- Current Date: ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
      `- Season: ${active.year} (${crops.length} crops so far)`,
      ``,
      `### Categories`,
      ...categories.map((c) => `- ${c}`),
    ]
    return {
      title: "Window",
      metadata: { gardenId: args.gardenId, seasonId: active.id },
      output: lines.join("\n"),
    }
  },
})

function parse(frost: string, year: number) {
  const result = new Date(`${frost} ${year}`)
  if (isNaN(result.getTime())) return new Date(year, 3, 15)
  return result
}
