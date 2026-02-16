import z from "zod"
import { Tool } from "./tool"
import DESCRIPTION from "./season-start.txt"
import { Season } from "../season/season"
import { SeasonStorage } from "../season/storage"

export const SeasonStartTool = Tool.define("season_start", {
  description: DESCRIPTION,
  parameters: z.object({
    gardenId: z.string().describe("The UUID of the garden to start a season for"),
    year: z.number().int().positive().describe("The calendar year for the growing season"),
  }),
  async execute(params) {
    const info = Season.Info.parse({
      id: crypto.randomUUID(),
      gardenId: params.gardenId,
      year: params.year,
      status: "active",
      plants: [],
    })
    await SeasonStorage.create(info)
    return {
      title: `Season ${info.year}`,
      metadata: { id: info.id, gardenId: info.gardenId },
      output: `Started season ${info.year} (id: ${info.id}) for garden ${info.gardenId}.`,
    }
  },
})
