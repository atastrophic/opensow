import z from "zod"
import { Tool } from "./tool"
import DESCRIPTION from "./crop-create.txt"
import { Crop } from "../crop/crop"
import { CropStorage } from "../crop/storage"

export const CropCreateTool = Tool.define("crop_create", {
  description: DESCRIPTION,
  parameters: z.object({
    seasonId: z.string().describe("The UUID of the season this crop belongs to"),
    name: z.string().describe("Human-readable name for the crop (e.g. 'Roma Tomato')"),
    taxonomy: Crop.Taxonomy.nullable().describe("Taxonomy and growth habit data").default(null),
    spacing: Crop.Spacing.nullable().describe("Spacing and dimension data in inches").default(null),
    seedStartingIndoors: Crop.SeedStartingIndoors.nullable().describe("Indoor seed starting data").default(null),
    seedStartingOutdoors: Crop.SeedStartingOutdoors.nullable().describe("Direct sow outdoors data").default(null),
    pottingUp: Crop.PottingUp.nullable().describe("Potting up / transition data").default(null),
    transplanting: Crop.Transplanting.nullable().describe("Transplanting outdoors data").default(null),
    cultivation: Crop.Cultivation.nullable().describe("Cultivation and maintenance data").default(null),
    harvest: Crop.Harvest.nullable().describe("Harvest and seed saving data").default(null),
  }),
  async execute(params) {
    const info = Crop.Info.parse({
      id: crypto.randomUUID(),
      seasonId: params.seasonId,
      name: params.name,
      taxonomy: params.taxonomy,
      spacing: params.spacing,
      seedStartingIndoors: params.seedStartingIndoors,
      seedStartingOutdoors: params.seedStartingOutdoors,
      pottingUp: params.pottingUp,
      transplanting: params.transplanting,
      cultivation: params.cultivation,
      harvest: params.harvest,
    })
    await CropStorage.create(info)
    return {
      title: info.name,
      metadata: { id: info.id, seasonId: info.seasonId },
      output: `Created crop "${info.name}" (id: ${info.id}) in season ${info.seasonId}.`,
    }
  },
})
