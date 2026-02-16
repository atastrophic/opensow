import z from "zod"
import { BusEvent } from "../bus/bus-event"

export namespace Season {
  export const Status = z.enum(["active", "archived"])
  export const GardenerType = z.enum(["chef", "parent", "homesteader"])
  export const Engagement = z.enum(["low", "standard", "high"])

  export const Plant = z.object({
    id: z.string().uuid(),
    name: z.string(),
    perennial: z.boolean(),
  })
  export type Plant = z.infer<typeof Plant>

  export const Info = z
    .object({
      id: z.string().uuid(),
      gardenId: z.string().uuid(),
      year: z.number().int().positive(),
      status: Status.default("active"),
      plants: Plant.array().default([]),
      gardenerType: GardenerType.optional(),
      engagement: Engagement.optional(),
    })
    .meta({ ref: "Season" })
  export type Info = z.infer<typeof Info>

  export const Event = {
    Created: BusEvent.define(
      "season.created",
      z.object({
        info: Info,
      }),
    ),
    Updated: BusEvent.define(
      "season.updated",
      z.object({
        info: Info,
      }),
    ),
    Archived: BusEvent.define(
      "season.archived",
      z.object({
        info: Info,
      }),
    ),
  }
}
