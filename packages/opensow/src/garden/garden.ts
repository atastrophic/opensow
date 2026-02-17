import z from "zod"
import { BusEvent } from "../bus/bus-event"

export namespace Garden {
  const TRAY_CELLS = [32, 48, 64, 72, 128] as const

  // Standard 1020 tray is ~11" x 21.5" ≈ 236.5 sq inches
  const TRAY_AREA = 236.5
  const TRAY_DEPTHS: Record<number, number> = {
    32: 2.5,
    48: 2.25,
    64: 1.5,
    72: 1.5,
    128: 1.25,
  }

  export function estimateCellSize(cells: number) {
    const depth = TRAY_DEPTHS[cells] ?? 1.5
    return Math.round((TRAY_AREA / cells) * depth * 100) / 100
  }

  export function estimateGallons(diameter: number, depth: number) {
    const radius = diameter / 2
    const volume = Math.PI * radius * radius * depth
    return Math.round((volume / 231) * 100) / 100
  }

  const InGround = z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: z.literal("in-ground"),
    light: z.string(),
    length: z.number(),
    width: z.number(),
    watering: z.string(),
  })

  const RaisedBed = z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: z.literal("raised-bed"),
    light: z.string(),
    length: z.number(),
    width: z.number(),
    watering: z.string(),
  })

  const Pot = z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: z.literal("pot"),
    diameter: z.number(),
    depth: z.number(),
    gallons: z.number(),
  })

  const Tray = z.object({
    id: z.string().uuid(),
    name: z.string(),
    type: z.literal("tray"),
    cells: z
      .number()
      .refine((n): n is 32 | 48 | 64 | 72 | 128 => TRAY_CELLS.includes(n as (typeof TRAY_CELLS)[number]), {
        message: "cells must be one of 32, 48, 64, 72, 128",
      }),
    cellSize: z.number(),
  })

  export const Space = z.discriminatedUnion("type", [InGround, RaisedBed, Pot, Tray])
  export type Space = z.infer<typeof Space>

  export const Info = z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      zipcode: z.string(),
      zone: z.string(),
      firstFrost: z.string(),
      lastFrost: z.string(),
      spaces: Space.array().default([]),
    })
    .meta({ ref: "Garden" })
  export type Info = z.infer<typeof Info>

  export const Event = {
    Created: BusEvent.define(
      "garden.created",
      z.object({
        info: Info,
      }),
    ),
    Updated: BusEvent.define(
      "garden.updated",
      z.object({
        info: Info,
      }),
    ),
    Deleted: BusEvent.define(
      "garden.deleted",
      z.object({
        info: Info,
      }),
    ),
  }
}
