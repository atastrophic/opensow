import z from "zod"
import { BusEvent } from "../bus/bus-event"

export namespace Crop {
  export const Taxonomy = z
    .object({
      commonName: z.string(),
      scientificName: z.string(),
      family: z.string(),
      bestCulinaryUse: z.string(),
      growthHabit: z.string(),
      productionStyle: z.string(),
      sunExposure: z.string(),
      sunHours: z.number().positive(),
      idealLocation: z.string(),
      companions: z.string().array(),
      antagonists: z.string().array(),
      usdaHardinessZoneMin: z.number().int().min(1).max(13),
      usdaHardinessZoneMax: z.number().int().min(1).max(13),
    })
    .refine((v) => v.usdaHardinessZoneMin <= v.usdaHardinessZoneMax, {
      message: "usdaHardinessZoneMin must be <= usdaHardinessZoneMax",
    })
  export type Taxonomy = z.infer<typeof Taxonomy>

  export const Spacing = z.object({
    rowSpacing: z.number().positive(),
    plantSpacing: z.number().positive(),
    expectedSpread: z.number().positive(),
    expectedHeight: z.number().positive(),
  })
  export type Spacing = z.infer<typeof Spacing>

  const Anchor = z.enum(["First", "Last"])

  export const SeedStartingIndoors = z.object({
    sowAnchor: Anchor,
    sowWeeksRelativeToFrost: z.tuple([z.number().int(), z.number().int()]).nullable(),
    soilMix: z.string(),
    soilTempMin: z.number().positive(),
    soilTempMax: z.number().positive(),
    stratification: z.string(),
    seedingDepth: z.number().positive(),
    lightForGermination: z.string(),
    daysToGermination: z.tuple([z.number().int().positive(), z.number().int().positive()]),
  })
  export type SeedStartingIndoors = z.infer<typeof SeedStartingIndoors>

  export const SeedStartingOutdoors = z.object({
    sowAnchor: Anchor,
    sowWeeksRelativeToFrost: z.tuple([z.number().int(), z.number().int()]).nullable(),
    soilTempMin: z.number().positive(),
    soilTempMax: z.number().positive(),
    sowSeedingDepth: z.number().positive(),
  })
  export type SeedStartingOutdoors = z.infer<typeof SeedStartingOutdoors>

  export const PottingUp = z.object({
    pottingUpCue: z.string(),
    nutrientNeeds: z.string(),
  })
  export type PottingUp = z.infer<typeof PottingUp>

  export const Transplanting = z.object({
    transplantTiming: z.string(),
    plantingDepth: z.string(),
    soilTemp: z.number().positive(),
    hardeningNote: z.boolean(),
  })
  export type Transplanting = z.infer<typeof Transplanting>

  export const Cultivation = z.object({
    wateringNeeds: z.string(),
    fertilizerVegetative: z.string(),
    fertilizerFloweringFruiting: z.string(),
    fertilizerFrequency: z.string(),
  })
  export type Cultivation = z.infer<typeof Cultivation>

  export const Harvest = z.object({
    daysToMaturity: z.tuple([z.number().int().positive(), z.number().int().positive()]),
    harvestIndicator: z.string(),
    seedSavingMethod: z.string(),
    seedHarvestCue: z.string(),
  })
  export type Harvest = z.infer<typeof Harvest>

  export const Info = z
    .object({
      id: z.string().uuid(),
      seasonId: z.string().uuid(),
      name: z.string(),
      taxonomy: Taxonomy.nullable().default(null),
      spacing: Spacing.nullable().default(null),
      seedStartingIndoors: SeedStartingIndoors.nullable().default(null),
      seedStartingOutdoors: SeedStartingOutdoors.nullable().default(null),
      pottingUp: PottingUp.nullable().default(null),
      transplanting: Transplanting.nullable().default(null),
      cultivation: Cultivation.nullable().default(null),
      harvest: Harvest.nullable().default(null),
    })
    .meta({ ref: "Crop" })
  export type Info = z.infer<typeof Info>

  export const Event = {
    Created: BusEvent.define(
      "crop.created",
      z.object({
        info: Info,
      }),
    ),
    Removed: BusEvent.define(
      "crop.removed",
      z.object({
        info: Info,
      }),
    ),
  }
}
