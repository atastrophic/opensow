import z from "zod"
import { Tool } from "./tool"
import DESCRIPTION from "./season-migrate.txt"
import { SeasonStorage } from "../season/storage"

export const SeasonMigrateTool = Tool.define("season_migrate", {
  description: DESCRIPTION,
  parameters: z.object({
    gardenId: z.string().describe("The UUID of the garden"),
    plantIds: z.array(z.string()).describe("Plant reference IDs from the archived season to migrate"),
  }),
  async execute(params) {
    const migrated = await SeasonStorage.migrate(params.gardenId, params.plantIds)
    if (migrated.length === 0)
      return {
        title: "Migration",
        metadata: { count: 0 },
        output:
          "No perennial plants were migrated. Check that the selected IDs correspond to perennial plants in the archived season.",
      }
    const lines = migrated.map((p) => `- ${p.name} (new id: ${p.id})`)
    return {
      title: "Migration",
      metadata: { count: migrated.length },
      output: `Migrated ${migrated.length} perennial(s) to the active season:\n${lines.join("\n")}`,
    }
  },
})
