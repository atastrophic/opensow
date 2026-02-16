import z from "zod"
import { Tool } from "./tool"
import DESCRIPTION from "./crop-list.txt"
import { CropStorage } from "../crop/storage"

export const CropListTool = Tool.define("crop_list", {
  description: DESCRIPTION,
  parameters: z.object({
    seasonId: z.string().describe("The UUID of the season to list crops for"),
  }),
  async execute(params) {
    const crops = await CropStorage.list(params.seasonId)
    if (crops.length === 0)
      return {
        title: "No crops",
        metadata: {},
        output: `No crops found in season ${params.seasonId}.`,
      }
    const summary = crops.map((c) => `- ${c.name} (id: ${c.id})`).join("\n")
    return {
      title: `${crops.length} crop(s)`,
      metadata: { count: crops.length },
      output: `Crops in season ${params.seasonId}:\n${summary}`,
    }
  },
})
