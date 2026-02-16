import z from "zod"
import { Tool } from "./tool"
import DESCRIPTION from "./preference.txt"
import { Season } from "../season/season"
import { SeasonStorage } from "../season/storage"

export const PreferenceTool = Tool.define("preference", {
  description: DESCRIPTION,
  parameters: z.object({
    gardenId: z.string().describe("The garden ID"),
    gardenerType: Season.GardenerType.describe("The gardener type: chef, parent, or homesteader"),
    engagement: Season.Engagement.describe("The engagement level: low, standard, or high"),
  }),
  async execute(args) {
    const active = await SeasonStorage.active(args.gardenId)
    if (!active)
      return {
        title: "Preference",
        metadata: {},
        output: "No active season found for this garden. Start a season first.",
      }
    const info = await SeasonStorage.update(args.gardenId, active.id, (draft) => {
      draft.gardenerType = args.gardenerType
      draft.engagement = args.engagement
    })
    return {
      title: "Preference",
      metadata: { seasonId: info.id },
      output: `Saved preferences on season ${info.year}: gardener type "${args.gardenerType}", engagement "${args.engagement}".`,
    }
  },
})
