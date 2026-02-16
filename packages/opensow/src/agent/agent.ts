import { Config } from "../config/config"
import z from "zod"
import { Provider } from "../provider/provider"
import { generateObject, streamObject, type ModelMessage } from "ai"
import { SystemPrompt } from "../session/system"
import { Instance } from "../project/instance"
import { Truncate } from "../tool/truncation"
import { Auth } from "../auth"
import { ProviderTransform } from "../provider/transform"

import PROMPT_GENERATE from "./generate.txt"
import PROMPT_COMPACTION from "./prompt/compaction.txt"
import PROMPT_EXPLORE from "./prompt/explore.txt"
import PROMPT_SUMMARY from "./prompt/summary.txt"
import PROMPT_TITLE from "./prompt/title.txt"
import PROMPT_GARTENMEISTER from "./prompt/gartenmeister.txt"
import PROMPT_GARDEN_SETUP from "./prompt/garden-setup.txt"
import PROMPT_SEASON_MANAGEMENT from "./prompt/season-management.txt"
import PROMPT_CROP_DATA from "./prompt/crop-data.txt"
import PROMPT_GUIDED_PLANTING from "./prompt/guided-planting.txt"
import PROMPT_DIRECT_PLANTING from "./prompt/direct-planting.txt"
import PROMPT_SEASON_PLANNER from "./prompt/season-planner.txt"
import { PermissionNext } from "@/permission/next"
import { mergeDeep, pipe, sortBy, values } from "remeda"
import { Global } from "@/global"
import path from "path"
import { Plugin } from "@/plugin"

export namespace Agent {
  export const Info = z
    .object({
      name: z.string(),
      description: z.string().optional(),
      mode: z.enum(["subagent", "primary", "all"]),
      native: z.boolean().optional(),
      hidden: z.boolean().optional(),
      topP: z.number().optional(),
      temperature: z.number().optional(),
      color: z.string().optional(),
      permission: PermissionNext.Ruleset,
      model: z
        .object({
          modelID: z.string(),
          providerID: z.string(),
        })
        .optional(),
      prompt: z.string().optional(),
      options: z.record(z.string(), z.any()),
      steps: z.number().int().positive().optional(),
    })
    .meta({
      ref: "Agent",
    })
  export type Info = z.infer<typeof Info>

  const state = Instance.state(async () => {
    const cfg = await Config.get()

    const defaults = PermissionNext.fromConfig({
      "*": "allow",
      doom_loop: "ask",
      external_directory: {
        "*": "ask",
        [Truncate.DIR]: "allow",
        [Truncate.GLOB]: "allow",
      },
      question: "deny",
      research_enter: "deny",
      research_exit: "deny",
      // mirrors github.com/github/gitignore Node.gitignore pattern for .env files
      read: {
        "*": "allow",
        "*.env": "ask",
        "*.env.*": "ask",
        "*.env.example": "allow",
      },
    })
    const user = PermissionNext.fromConfig(cfg.permission ?? {})

    const result: Record<string, Info> = {
      gartenmeister: {
        name: "gartenmeister",
        description:
          "The Gartenmeister — master gardener and default agent. Full tool access for executing plans, making changes, and running commands.",
        options: {},
        prompt: PROMPT_GARTENMEISTER,
        permission: PermissionNext.merge(
          defaults,
          PermissionNext.fromConfig({
            question: "allow",
            research_enter: "allow",
            status: "allow",
          }),
          user,
        ),
        mode: "primary",
        native: true,
      },
      research: {
        name: "research",
        description: "Research mode. Allows read-only exploration and saving research findings to markdown files.",
        options: {},
        permission: PermissionNext.merge(
          defaults,
          PermissionNext.fromConfig({
            question: "allow",
            research_exit: "allow",
            external_directory: {
              [path.join(Global.Path.data, "research", "*")]: "allow",
            },
            edit: {
              "*": "deny",
              [path.join(".opensow", "research", "*.md")]: "allow",
              [path.relative(Instance.worktree, path.join(Global.Path.data, path.join("research", "*.md")))]: "allow",
            },
            write: {
              "*.md": "allow",
            },
          }),
          user,
        ),
        mode: "primary",
        native: true,
      },
      general: {
        name: "general",
        description: `General-purpose agent for researching complex questions and executing multi-step tasks. Use this agent to execute multiple units of work in parallel.`,
        permission: PermissionNext.merge(
          defaults,
          PermissionNext.fromConfig({
            todoread: "deny",
            todowrite: "deny",
          }),
          user,
        ),
        options: {},
        mode: "subagent",
        native: true,
      },
      explore: {
        name: "explore",
        permission: PermissionNext.merge(
          defaults,
          PermissionNext.fromConfig({
            "*": "deny",
            grep: "allow",
            glob: "allow",
            list: "allow",
            bash: "allow",
            webfetch: "allow",
            websearch: "allow",
            codesearch: "allow",
            read: "allow",
            external_directory: {
              [Truncate.DIR]: "allow",
              [Truncate.GLOB]: "allow",
            },
          }),
          user,
        ),
        description: `The scout — a fast, read-only explorer of the garden grounds. Use this when you need to quickly find plants by pattern (eg. "src/beds/**/*.tsx"), search beds for specific growth (eg. "root vegetables"), or answer questions about the garden layout (eg. "where are the perennials planted?"). When dispatching this scout, specify the desired thoroughness: "quick" for a glance over the fence, "medium" for a walk through the rows, or "very thorough" for a full survey of every bed and path.`,
        prompt: PROMPT_EXPLORE,
        options: {},
        mode: "subagent",
        native: true,
      },
      "garden-setup": {
        name: "garden-setup",
        description:
          "Garden setup specialist. Guides users through creating a garden with location, climate, and growing spaces.",
        options: {},
        prompt: PROMPT_GARDEN_SETUP,
        permission: PermissionNext.merge(
          defaults,
          PermissionNext.fromConfig({
            "*": "deny",
            garden_create: "allow",
            garden_space_add: "allow",
            garden_list: "allow",
          }),
          user,
        ),
        mode: "subagent",
        native: true,
      },
      "season-management": {
        name: "season-management",
        description:
          "Season management specialist. Guides users through starting seasons, migrating perennial plants, and choosing planting approaches.",
        options: {},
        prompt: PROMPT_SEASON_MANAGEMENT,
        permission: PermissionNext.merge(
          defaults,
          PermissionNext.fromConfig({
            "*": "deny",
            season_start: "allow",
            season_list: "allow",
            season_migrate: "allow",
            garden_list: "allow",
          }),
          user,
        ),
        mode: "subagent",
        native: true,
      },
      "crop-data": {
        name: "crop-data",
        description:
          "Crop data specialist. Populates detailed agronomic data for plants using horticultural knowledge and garden context.",
        options: {},
        prompt: PROMPT_CROP_DATA,
        permission: PermissionNext.merge(
          defaults,
          PermissionNext.fromConfig({
            "*": "deny",
            crop_create: "allow",
            crop_read: "allow",
            crop_list: "allow",
            crop_remove: "allow",
            garden_list: "allow",
          }),
          user,
        ),
        mode: "subagent",
        native: true,
      },
      "guided-planting": {
        name: "guided-planting",
        description:
          "Guided planting specialist. Runs the gardener type and engagement level quiz, generates curated plant recommendations based on zone, spaces, and preferences, and delegates to crop-data for selected plants.",
        options: {},
        prompt: PROMPT_GUIDED_PLANTING,
        permission: PermissionNext.merge(
          defaults,
          PermissionNext.fromConfig({
            "*": "deny",
            preference: "allow",
            recommend: "allow",
            garden_list: "allow",
            season_list: "allow",
            task: "allow",
          }),
          user,
        ),
        mode: "subagent",
        native: true,
      },
      "direct-planting": {
        name: "direct-planting",
        description:
          "Direct planting specialist. Collects plants from users who know what they want to grow, supports full-season or current-window modes, and delegates to crop-data for each plant.",
        options: {},
        prompt: PROMPT_DIRECT_PLANTING,
        permission: PermissionNext.merge(
          defaults,
          PermissionNext.fromConfig({
            "*": "deny",
            window: "allow",
            garden_list: "allow",
            season_list: "allow",
            crop_list: "allow",
            task: "allow",
          }),
          user,
        ),
        mode: "subagent",
        native: true,
      },
      "season-planner": {
        name: "season-planner",
        description:
          "Season planner specialist. Generates square foot gardening layouts, companion planting arrangements, succession planting schedules, and month-by-month timelines from collected crops and garden spaces.",
        options: {},
        prompt: PROMPT_SEASON_PLANNER,
        permission: PermissionNext.merge(
          defaults,
          PermissionNext.fromConfig({
            "*": "deny",
            planner: "allow",
            garden_list: "allow",
            season_list: "allow",
            crop_list: "allow",
            crop_read: "allow",
            task: "allow",
          }),
          user,
        ),
        mode: "subagent",
        native: true,
      },
      compaction: {
        name: "compaction",
        mode: "primary",
        native: true,
        hidden: true,
        prompt: PROMPT_COMPACTION,
        permission: PermissionNext.merge(
          defaults,
          PermissionNext.fromConfig({
            "*": "deny",
          }),
          user,
        ),
        options: {},
      },
      title: {
        name: "title",
        mode: "primary",
        options: {},
        native: true,
        hidden: true,
        temperature: 0.5,
        permission: PermissionNext.merge(
          defaults,
          PermissionNext.fromConfig({
            "*": "deny",
          }),
          user,
        ),
        prompt: PROMPT_TITLE,
      },
      summary: {
        name: "summary",
        mode: "primary",
        options: {},
        native: true,
        hidden: true,
        permission: PermissionNext.merge(
          defaults,
          PermissionNext.fromConfig({
            "*": "deny",
          }),
          user,
        ),
        prompt: PROMPT_SUMMARY,
      },
    }

    for (const [key, value] of Object.entries(cfg.agent ?? {})) {
      if (value.disable) {
        delete result[key]
        continue
      }
      let item = result[key]
      if (!item)
        item = result[key] = {
          name: key,
          mode: "all",
          permission: PermissionNext.merge(defaults, user),
          options: {},
          native: false,
        }
      if (value.model) item.model = Provider.parseModel(value.model)
      item.prompt = value.prompt ?? item.prompt
      item.description = value.description ?? item.description
      item.temperature = value.temperature ?? item.temperature
      item.topP = value.top_p ?? item.topP
      item.mode = value.mode ?? item.mode
      item.color = value.color ?? item.color
      item.hidden = value.hidden ?? item.hidden
      item.name = value.name ?? item.name
      item.steps = value.steps ?? item.steps
      item.options = mergeDeep(item.options, value.options ?? {})
      item.permission = PermissionNext.merge(item.permission, PermissionNext.fromConfig(value.permission ?? {}))
    }

    // Ensure Truncate.DIR is allowed unless explicitly configured
    for (const name in result) {
      const agent = result[name]
      const explicit = agent.permission.some((r) => {
        if (r.permission !== "external_directory") return false
        if (r.action !== "deny") return false
        return r.pattern === Truncate.DIR || r.pattern === Truncate.GLOB
      })
      if (explicit) continue

      result[name].permission = PermissionNext.merge(
        result[name].permission,
        PermissionNext.fromConfig({ external_directory: { [Truncate.DIR]: "allow", [Truncate.GLOB]: "allow" } }),
      )
    }

    return result
  })

  export async function get(agent: string) {
    return state().then((x) => x[agent])
  }

  export async function list() {
    const cfg = await Config.get()
    return pipe(
      await state(),
      values(),
      sortBy([(x) => (cfg.default_agent ? x.name === cfg.default_agent : x.name === "gartenmeister"), "desc"]),
    )
  }

  export async function defaultAgent() {
    const cfg = await Config.get()
    const agents = await state()

    if (cfg.default_agent) {
      const agent = agents[cfg.default_agent]
      if (!agent) throw new Error(`default agent "${cfg.default_agent}" not found`)
      if (agent.mode === "subagent") throw new Error(`default agent "${cfg.default_agent}" is a subagent`)
      if (agent.hidden === true) throw new Error(`default agent "${cfg.default_agent}" is hidden`)
      return agent.name
    }

    const primaryVisible = Object.values(agents).find((a) => a.mode !== "subagent" && a.hidden !== true)
    if (!primaryVisible) throw new Error("no primary visible agent found")
    return primaryVisible.name
  }

  export async function generate(input: { description: string; model?: { providerID: string; modelID: string } }) {
    const cfg = await Config.get()
    const defaultModel = input.model ?? (await Provider.defaultModel())
    const model = await Provider.getModel(defaultModel.providerID, defaultModel.modelID)
    const language = await Provider.getLanguage(model)

    const system = [PROMPT_GENERATE]
    await Plugin.trigger("experimental.chat.system.transform", { model }, { system })
    const existing = await list()

    const params = {
      experimental_telemetry: {
        isEnabled: cfg.experimental?.openTelemetry,
        metadata: {
          userId: cfg.username ?? "unknown",
        },
      },
      temperature: 0.3,
      messages: [
        ...system.map(
          (item): ModelMessage => ({
            role: "system",
            content: item,
          }),
        ),
        {
          role: "user",
          content: `Create an agent configuration based on this request: \"${input.description}\".\n\nIMPORTANT: The following identifiers already exist and must NOT be used: ${existing.map((i) => i.name).join(", ")}\n  Return ONLY the JSON object, no other text, do not wrap in backticks`,
        },
      ],
      model: language,
      schema: z.object({
        identifier: z.string(),
        whenToUse: z.string(),
        systemPrompt: z.string(),
      }),
    } satisfies Parameters<typeof generateObject>[0]

    if (defaultModel.providerID === "openai" && (await Auth.get(defaultModel.providerID))?.type === "oauth") {
      const result = streamObject({
        ...params,
        providerOptions: ProviderTransform.providerOptions(model, {
          instructions: SystemPrompt.instructions(),
          store: false,
        }),
        onError: () => {},
      })
      for await (const part of result.fullStream) {
        if (part.type === "error") throw part.error
      }
      return result.object
    }

    const result = await generateObject(params)
    return result.object
  }
}
