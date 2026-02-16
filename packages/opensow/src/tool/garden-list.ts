import z from "zod"
import { Tool } from "./tool"
import DESCRIPTION from "./garden-list.txt"
import { GardenStorage } from "../garden/storage"

export const GardenListTool = Tool.define("garden_list", {
  description: DESCRIPTION,
  parameters: z.object({}),
  async execute() {
    const gardens = await GardenStorage.list()
    if (gardens.length === 0)
      return {
        title: "Gardens",
        metadata: { count: 0 },
        output: "No gardens found. Use the garden_create tool to create one.",
      }
    const lines = gardens.map((g) => {
      const spaces = g.spaces.length === 0 ? "no spaces" : `${g.spaces.length} space(s)`
      return `- ${g.name} (id: ${g.id}, zone ${g.zone}, ${spaces})`
    })
    return {
      title: "Gardens",
      metadata: { count: gardens.length },
      output: lines.join("\n"),
    }
  },
})
