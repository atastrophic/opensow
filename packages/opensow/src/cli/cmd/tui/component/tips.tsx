import { createMemo, createSignal, For } from "solid-js"
import { DEFAULT_THEMES, useTheme } from "@tui/context/theme"

const themeCount = Object.keys(DEFAULT_THEMES).length
const themeTip = `Use {highlight}/theme{/highlight} or {highlight}Ctrl+X T{/highlight} to switch between ${themeCount} built-in themes`

type TipPart = { text: string; highlight: boolean }

function parse(tip: string): TipPart[] {
  const parts: TipPart[] = []
  const regex = /\{highlight\}(.*?)\{\/highlight\}/g
  const found = Array.from(tip.matchAll(regex))
  const state = found.reduce(
    (acc, match) => {
      const start = match.index ?? 0
      if (start > acc.index) {
        acc.parts.push({ text: tip.slice(acc.index, start), highlight: false })
      }
      acc.parts.push({ text: match[1], highlight: true })
      acc.index = start + match[0].length
      return acc
    },
    { parts, index: 0 },
  )

  if (state.index < tip.length) {
    parts.push({ text: tip.slice(state.index), highlight: false })
  }

  return parts
}

export function Tips() {
  const theme = useTheme().theme
  const parts = parse(TIPS[Math.floor(Math.random() * TIPS.length)])

  return (
    <box flexDirection="row" maxWidth="100%">
      <text flexShrink={0} style={{ fg: theme.warning }}>
        ● Tip{" "}
      </text>
      <text flexShrink={1}>
        <For each={parts}>
          {(part) => <span style={{ fg: part.highlight ? theme.text : theme.textMuted }}>{part.text}</span>}
        </For>
      </text>
    </box>
  )
}

const TIPS = [
  "Type {highlight}@{/highlight} followed by a filename to fuzzy search and attach seeds to your plot",
  "Start a message with {highlight}!{/highlight} to work the soil directly (e.g., {highlight}!ls -la{/highlight})",
  "Press {highlight}Tab{/highlight} to cycle between Gartenmeister and Research gardeners",
  "Use {highlight}/undo{/highlight} to uproot the last planting and restore the bed",
  "Use {highlight}/redo{/highlight} to replant previously uprooted growth",
  "Run {highlight}/share{/highlight} to share your garden tour at opensow.ai",
  "Drag and drop images into the terminal to add them as garden references",
  "Press {highlight}Ctrl+V{/highlight} to paste images from your clipboard into the prompt",
  "Press {highlight}Ctrl+X E{/highlight} or {highlight}/editor{/highlight} to draft garden plans in your external editor",
  "Run {highlight}/init{/highlight} to survey the plot and auto-generate garden rules",
  "Run {highlight}/models{/highlight} or {highlight}Ctrl+X M{/highlight} to see and switch between available AI models",
  themeTip,
  "Press {highlight}Ctrl+X N{/highlight} or {highlight}/new{/highlight} to break ground on a fresh garden session",
  "Use {highlight}/sessions{/highlight} or {highlight}Ctrl+X L{/highlight} to revisit previous garden sessions",
  "Run {highlight}/compact{/highlight} to compost long sessions near context limits",
  "Press {highlight}Ctrl+X X{/highlight} or {highlight}/export{/highlight} to press your garden journal to Markdown",
  "Press {highlight}Ctrl+X Y{/highlight} to clip the gardener's last note to your clipboard",
  "Press {highlight}Ctrl+P{/highlight} to see all available tools and commands",
  "Run {highlight}/connect{/highlight} to add API keys for 75+ supported LLM providers",
  "The leader key is {highlight}Ctrl+X{/highlight}; combine with other keys for quick actions",
  "Press {highlight}F2{/highlight} to quickly switch between recently used models",
  "Press {highlight}Ctrl+X B{/highlight} to show/hide the tool shed panel",
  "Use {highlight}PageUp{/highlight}/{highlight}PageDown{/highlight} to walk through the garden journal",
  "Press {highlight}Ctrl+G{/highlight} or {highlight}Home{/highlight} to return to the garden gate",
  "Press {highlight}Ctrl+Alt+G{/highlight} or {highlight}End{/highlight} to jump to the freshest growth",
  "Press {highlight}Shift+Enter{/highlight} or {highlight}Ctrl+J{/highlight} to add newlines in your prompt",
  "Press {highlight}Ctrl+C{/highlight} when typing to clear the input field",
  "Press {highlight}Escape{/highlight} to halt the gardener mid-task",
  "Switch to {highlight}Research{/highlight} mode to survey the grounds without disturbing the soil",
  "Use {highlight}@agent-name{/highlight} in prompts to summon specialized gardeners",
  "Press {highlight}Ctrl+X Right/Left{/highlight} to wander between parent and child garden plots",
  "Create {highlight}opensow.json{/highlight} in the plot root for plot-specific settings",
  "Place settings in {highlight}~/.config/opensow/opensow.json{/highlight} for global garden config",
  "Add {highlight}$schema{/highlight} to your config for autocomplete in your editor",
  "Configure {highlight}model{/highlight} in config to set your default model",
  "Override any keybind in config via the {highlight}keybinds{/highlight} section",
  "Set any keybind to {highlight}none{/highlight} to disable it completely",
  "Configure local or remote MCP servers in the {highlight}mcp{/highlight} config section",
  "OpenSow auto-handles OAuth for remote MCP servers requiring auth",
  "Add {highlight}.md{/highlight} files to {highlight}.opensow/command/{/highlight} to define reusable garden recipes",
  "Use {highlight}$ARGUMENTS{/highlight}, {highlight}$1{/highlight}, {highlight}$2{/highlight} in custom commands for dynamic input",
  "Use backticks in commands to inject shell output (e.g., {highlight}`git status`{/highlight})",
  "Add {highlight}.md{/highlight} files to {highlight}.opensow/agent/{/highlight} for specialized gardener personas",
  "Configure per-gardener permissions for {highlight}edit{/highlight}, {highlight}bash{/highlight}, and {highlight}webfetch{/highlight} tools",
  'Use patterns like {highlight}"git *": "allow"{/highlight} for granular tool permissions',
  'Set {highlight}"rm -rf *": "deny"{/highlight} to prevent scorched-earth commands',
  'Configure {highlight}"git push": "ask"{/highlight} to require approval before sharing harvests',
  "OpenSow auto-formats files using prettier, gofmt, ruff, and more",
  'Set {highlight}"formatter": false{/highlight} in config to disable all auto-formatting',
  "Define custom formatter commands with file extensions in config",
  "OpenSow uses LSP servers for intelligent garden analysis",
  "Create {highlight}.ts{/highlight} files in {highlight}.opensow/tool/{/highlight} to forge new garden tools",
  "Tool definitions can invoke scripts written in Python, Go, etc",
  "Add {highlight}.ts{/highlight} files to {highlight}.opensow/plugin/{/highlight} for event hooks",
  "Use plugins to send OS notifications when garden sessions complete",
  "Create a plugin to prevent OpenSow from reading sensitive files",
  "Use {highlight}opensow run{/highlight} for non-interactive tending",
  "Use {highlight}opensow --continue{/highlight} to resume the last garden session",
  "Use {highlight}opensow run -f file.ts{/highlight} to attach seed packets via CLI",
  "Use {highlight}--format json{/highlight} for machine-readable output in scripts",
  "Run {highlight}opensow serve{/highlight} for headless API access to the garden",
  "Use {highlight}opensow run --attach{/highlight} to connect to a running garden server",
  "Run {highlight}opensow upgrade{/highlight} to sharpen your tools to the latest version",
  "Run {highlight}opensow auth list{/highlight} to see all configured providers",
  "Run {highlight}opensow agent create{/highlight} for guided gardener cultivation",
  "Use {highlight}/opensow{/highlight} in GitHub issues/PRs to trigger AI actions",
  "Run {highlight}opensow github install{/highlight} to set up the GitHub workflow",
  "Comment {highlight}/opensow fix this{/highlight} on issues to auto-create PRs",
  "Comment {highlight}/oc{/highlight} on PR code lines for targeted reviews",
  'Use {highlight}"theme": "system"{/highlight} to match your terminal\'s colors',
  "Create JSON theme files in {highlight}.opensow/themes/{/highlight} directory",
  "Themes support dark/light variants for both seasons",
  "Reference ANSI colors 0-255 in custom themes",
  "Use {highlight}{env:VAR_NAME}{/highlight} syntax to reference environment variables in config",
  "Use {highlight}{file:path}{/highlight} to include file contents in config values",
  "Use {highlight}instructions{/highlight} in config to load additional garden rules",
  "Set gardener {highlight}temperature{/highlight} from 0.0 (precise pruning) to 1.0 (wild growth)",
  "Configure {highlight}maxSteps{/highlight} to limit how many rows a gardener tends per request",
  'Set {highlight}"tools": {"bash": false}{/highlight} to lock away specific tools',
  'Set {highlight}"mcp_*": false{/highlight} to disable all tools from an MCP server',
  "Override global tool settings per gardener configuration",
  'Set {highlight}"share": "auto"{/highlight} to automatically share all garden sessions',
  'Set {highlight}"share": "disabled"{/highlight} to keep your garden private',
  "Run {highlight}/unshare{/highlight} to close the garden gate on a shared session",
  "Permission {highlight}doom_loop{/highlight} prevents infinite watering cycles",
  "Permission {highlight}external_directory{/highlight} protects plots outside the garden fence",
  "Run {highlight}opensow debug config{/highlight} to troubleshoot configuration",
  "Use {highlight}--print-logs{/highlight} flag to see detailed logs in stderr",
  "Press {highlight}Ctrl+X G{/highlight} or {highlight}/timeline{/highlight} to jump to specific entries in the journal",
  "Press {highlight}Ctrl+X H{/highlight} to toggle visibility of tending details",
  "Press {highlight}Ctrl+X S{/highlight} or {highlight}/status{/highlight} to see garden status info",
  "Enable {highlight}tui.scroll_acceleration{/highlight} for smooth macOS-style scrolling",
  "Toggle username display in chat via command palette ({highlight}Ctrl+P{/highlight})",
  "Run {highlight}docker run -it --rm ghcr.io/atasrophic/opensow{/highlight} for containerized gardening",
  "Use {highlight}/connect{/highlight} with OpenSow Zen for curated, tested models",
  "Commit your plot's {highlight}AGENTS.md{/highlight} file to Git for team sharing",
  "Use {highlight}/review{/highlight} to inspect uncommitted plantings, branches, or PRs",
  "Run {highlight}/help{/highlight} or {highlight}Ctrl+X H{/highlight} to show the help dialog",
  "Use {highlight}/details{/highlight} to toggle tending details visibility",
  "Use {highlight}/rename{/highlight} to rename the current garden session",
  "Press {highlight}Ctrl+Z{/highlight} to step away from the garden and return to your shell",
]
