import z from "zod"
import { Tool } from "./tool"
import DESCRIPTION from "./crop-remove.txt"
import { CropStorage } from "../crop/storage"

export const CropRemoveTool = Tool.define("crop_remove", {
  description: DESCRIPTION,
  parameters: z.object({
    seasonId: z.string().describe("The UUID of the season"),
    cropId: z.string().describe("The UUID of the crop to remove"),
  }),
  async execute(params) {
    const info = await CropStorage.remove(params.seasonId, params.cropId)
    return {
      title: info.name,
      metadata: { id: info.id, seasonId: info.seasonId },
      output: `Removed crop "${info.name}" (id: ${info.id}) from season ${info.seasonId}.`,
    }
  },
})
