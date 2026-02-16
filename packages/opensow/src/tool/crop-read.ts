import z from "zod"
import { Tool } from "./tool"
import DESCRIPTION from "./crop-read.txt"
import { CropStorage } from "../crop/storage"

export const CropReadTool = Tool.define("crop_read", {
  description: DESCRIPTION,
  parameters: z.object({
    seasonId: z.string().describe("The UUID of the season"),
    cropId: z.string().describe("The UUID of the crop to read"),
  }),
  async execute(params) {
    const info = await CropStorage.read(params.seasonId, params.cropId)
    if (!info)
      return {
        title: "Not found",
        metadata: {},
        output: `Crop ${params.cropId} not found in season ${params.seasonId}.`,
      }
    return {
      title: info.name,
      metadata: { id: info.id, seasonId: info.seasonId },
      output: JSON.stringify(info, null, 2),
    }
  },
})
