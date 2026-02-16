import z from "zod"
import { Tool } from "./tool"
import DESCRIPTION from "./status.txt"
import { GardenStorage } from "../garden/storage"
import { SeasonStorage } from "../season/storage"
import { CropStorage } from "../crop/storage"

export const StatusTool = Tool.define("status", {
  description: DESCRIPTION,
  parameters: z.object({}),
  async execute() {
    const gardens = await GardenStorage.list()
    if (gardens.length === 0)
      return {
        title: "Status",
        metadata: { gardens: 0 },
        output: "No gardens set up yet. Use the garden-setup agent to create one.",
      }
    const sections = await Promise.all(
      gardens.map(async (garden) => {
        const seasons = await SeasonStorage.list(garden.id)
        const season = seasons.find((s) => s.status === "active")
        const archived = seasons.filter((s) => s.status === "archived").length
        const lines = [`## ${garden.name} (zone ${garden.zone})`]
        lines.push(`- ID: ${garden.id}`)
        lines.push(`- Spaces: ${garden.spaces.length}`)
        if (!season) {
          lines.push(`- Active season: none`)
        }
        if (season) {
          const crops = await CropStorage.list(season.id)
          lines.push(`- Active season: ${season.year} (${crops.length} crop${crops.length === 1 ? "" : "s"})`)
        }
        if (archived > 0) lines.push(`- Archived seasons: ${archived}`)
        return lines.join("\n")
      }),
    )
    return {
      title: "Status",
      metadata: { gardens: gardens.length },
      output: sections.join("\n\n"),
    }
  },
})
