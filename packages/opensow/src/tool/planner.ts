import z from "zod"
import { Tool } from "./tool"
import DESCRIPTION from "./planner.txt"
import { GardenStorage } from "../garden/storage"
import { SeasonStorage } from "../season/storage"
import { CropStorage } from "../crop/storage"
import { Storage } from "../storage/storage"

export const PlannerTool = Tool.define("planner", {
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
        title: "Planner",
        metadata: {} as { gardenId: string; seasonId: string; crops: number; spaces: number },
        output: "Garden not found. Use garden_list to see available gardens.",
      }
    const active = await SeasonStorage.active(args.gardenId)
    if (!active)
      return {
        title: "Planner",
        metadata: {} as { gardenId: string; seasonId: string; crops: number; spaces: number },
        output: "No active season found for this garden. Start a season first.",
      }
    const crops = await CropStorage.list(active.id)
    const now = new Date()
    const lines = [
      `## Season Plan Context`,
      ``,
      `### Garden`,
      `- Name: ${garden.name}`,
      `- USDA Zone: ${garden.zone}`,
      `- Last Frost: ${garden.lastFrost}`,
      `- First Frost: ${garden.firstFrost}`,
      `- Current Date: ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
      `- Season: ${active.year}`,
      ``,
    ]
    if (garden.spaces.length === 0) {
      lines.push(`### Spaces`, `- No growing spaces configured. Set up spaces before planning.`, ``)
    }
    if (garden.spaces.length > 0) {
      lines.push(`### Spaces (${garden.spaces.length})`)
      for (const space of garden.spaces) {
        if (space.type === "in-ground" || space.type === "raised-bed")
          lines.push(
            `- **${space.name}** (${space.type}): ${space.length}ft x ${space.width}ft, ${space.light}, ${space.watering}`,
          )
        if (space.type === "pot")
          lines.push(
            `- **${space.name}** (pot): ${space.diameter}" diameter, ${space.depth}" deep, ${space.gallons} gal`,
          )
        if (space.type === "tray")
          lines.push(`- **${space.name}** (tray): ${space.cells} cells, ${space.cellSize} cu in/cell`)
      }
      lines.push(``)
    }
    if (crops.length === 0) {
      lines.push(`### Crops`, `- No crops added yet. Add plants before planning.`, ``)
    }
    if (crops.length > 0) {
      lines.push(`### Crops (${crops.length})`)
      for (const crop of crops) {
        const parts = [`- **${crop.name}**`]
        if (crop.spacing)
          parts.push(
            `  - Spacing: ${crop.spacing.plantSpacing}" between plants, ${crop.spacing.rowSpacing}" between rows, spread ${crop.spacing.expectedSpread}", height ${crop.spacing.expectedHeight}"`,
          )
        if (crop.taxonomy) {
          parts.push(
            `  - Companions: ${crop.taxonomy.companions.length > 0 ? crop.taxonomy.companions.join(", ") : "none listed"}`,
          )
          parts.push(
            `  - Antagonists: ${crop.taxonomy.antagonists.length > 0 ? crop.taxonomy.antagonists.join(", ") : "none listed"}`,
          )
          parts.push(`  - Sun: ${crop.taxonomy.sunExposure} (${crop.taxonomy.sunHours}h)`)
        }
        if (crop.harvest)
          parts.push(`  - Days to maturity: ${crop.harvest.daysToMaturity[0]}-${crop.harvest.daysToMaturity[1]}`)
        if (crop.seedStartingIndoors) {
          const anchor = crop.seedStartingIndoors.sowAnchor === "Last" ? "last frost" : "first frost"
          const weeks = crop.seedStartingIndoors.sowWeeksRelativeToFrost
          if (weeks) parts.push(`  - Indoor start: ${weeks[0]} to ${weeks[1]} weeks relative to ${anchor}`)
        }
        if (crop.seedStartingOutdoors) {
          const anchor = crop.seedStartingOutdoors.sowAnchor === "Last" ? "last frost" : "first frost"
          const weeks = crop.seedStartingOutdoors.sowWeeksRelativeToFrost
          if (weeks) parts.push(`  - Direct sow: ${weeks[0]} to ${weeks[1]} weeks relative to ${anchor}`)
        }
        if (!crop.spacing && !crop.taxonomy && !crop.harvest)
          parts.push(`  - (incomplete crop data — run crop-data to populate)`)
        lines.push(parts.join("\n"))
      }
      lines.push(``)
    }
    return {
      title: "Planner",
      metadata: { gardenId: args.gardenId, seasonId: active.id, crops: crops.length, spaces: garden.spaces.length },
      output: lines.join("\n"),
    }
  },
})
