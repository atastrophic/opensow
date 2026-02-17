import z from "zod"
import { Tool } from "./tool"
import DESCRIPTION from "./garden-space-add.txt"
import { Garden } from "../garden/garden"
import { GardenStorage } from "../garden/storage"

export const GardenSpaceAddTool = Tool.define("garden_space_add", {
  description: DESCRIPTION,
  parameters: z.object({
    gardenId: z.string().describe("The UUID of the garden to add a space to"),
    name: z.string().describe("A friendly name for the space (e.g. 'Main Bed', 'Tomato Pot')"),
    type: z.enum(["in-ground", "raised-bed", "pot", "tray"]).describe("The type of growing space"),
    light: z.string().optional().describe("Sun exposure (e.g. 'full sun', 'partial shade'). Required for beds."),
    length: z.number().optional().describe("Length in feet. Required for in-ground and raised beds."),
    width: z.number().optional().describe("Width in feet. Required for in-ground and raised beds."),
    watering: z.string().optional().describe("Watering method (e.g. 'drip', 'hand', 'sprinkler'). Required for beds."),
    diameter: z.number().optional().describe("Pot diameter in inches. Required for pots."),
    depth: z.number().optional().describe("Pot depth in inches. Required for pots."),
    cells: z.number().optional().describe("Number of cells (32, 48, 64, 72, or 128). Required for trays."),
  }),
  async execute(params) {
    const id = crypto.randomUUID()
    const space = (() => {
      if (params.type === "in-ground" || params.type === "raised-bed")
        return Garden.Space.parse({
          id,
          name: params.name,
          type: params.type,
          light: params.light,
          length: params.length,
          width: params.width,
          watering: params.watering,
        })
      if (params.type === "pot")
        return Garden.Space.parse({
          id,
          name: params.name,
          type: "pot",
          diameter: params.diameter!,
          depth: params.depth!,
          gallons: Garden.estimateGallons(params.diameter!, params.depth!),
        })
      return Garden.Space.parse({
        id,
        name: params.name,
        type: "tray",
        cells: params.cells!,
        cellSize: Garden.estimateCellSize(params.cells!),
      })
    })()

    const info = await GardenStorage.update(params.gardenId, (draft) => {
      draft.spaces.push(space)
    })

    return {
      title: space.name,
      metadata: { gardenId: params.gardenId, spaceId: id },
      output: `Added ${params.type} "${space.name}" (id: ${id}) to garden "${info.name}".`,
    }
  },
})
