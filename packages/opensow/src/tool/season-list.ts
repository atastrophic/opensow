import z from "zod"
import { Tool } from "./tool"
import DESCRIPTION from "./season-list.txt"
import { SeasonStorage } from "../season/storage"

export const SeasonListTool = Tool.define("season_list", {
  description: DESCRIPTION,
  parameters: z.object({
    gardenId: z.string().describe("The UUID of the garden to list seasons for"),
  }),
  async execute(params) {
    const seasons = await SeasonStorage.list(params.gardenId)
    if (seasons.length === 0)
      return {
        title: "Seasons",
        metadata: { count: 0 },
        output: "No seasons found for this garden. Use the season_start tool to start one.",
      }
    const lines = seasons.map((s) => {
      const plants = s.plants.length === 0 ? "no plants" : `${s.plants.length} plant(s)`
      return `- ${s.year} [${s.status}] (id: ${s.id}, ${plants})`
    })
    return {
      title: "Seasons",
      metadata: { count: seasons.length },
      output: lines.join("\n"),
    }
  },
})
