import z from "zod"
import { Tool } from "./tool"
import DESCRIPTION from "./recommend.txt"
import { GardenStorage } from "../garden/storage"
import { SeasonStorage } from "../season/storage"

export const RecommendTool = Tool.define("recommend", {
  description: DESCRIPTION,
  parameters: z.object({
    gardenId: z.string().describe("The garden ID"),
  }),
  async execute(args) {
    const garden = await GardenStorage.read(args.gardenId)
    const active = await SeasonStorage.active(args.gardenId)
    if (!active)
      return {
        title: "Recommend",
        metadata: {},
        output: "No active season found for this garden. Start a season first.",
      }
    const lines = [
      `## Garden Context for Recommendations`,
      `- Garden: ${garden.name}`,
      `- USDA Zone: ${garden.zone}`,
      `- First Frost: ${garden.firstFrost}`,
      `- Last Frost: ${garden.lastFrost}`,
      `- Spaces: ${garden.spaces.length === 0 ? "none" : garden.spaces.map((s) => `${s.name} (${s.type})`).join(", ")}`,
      `- Season: ${active.year}`,
      `- Current Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
    ]
    if (active.gardenerType && active.engagement) {
      lines.push(`- Gardener Type: ${active.gardenerType}`)
      lines.push(`- Engagement Level: ${active.engagement}`)
    }
    if (!active.gardenerType || !active.engagement) {
      lines.push(`- Preferences: not set (run the gardener type and engagement quiz first)`)
    }
    return {
      title: "Recommend",
      metadata: { gardenId: args.gardenId, seasonId: active.id },
      output: lines.join("\n"),
    }
  },
})
