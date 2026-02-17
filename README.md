<p align="center">
  <a href="https://opensow.ai">
    <picture>
      <source srcset="packages/identity/mark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/identity/mark-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/identity/mark-light.svg" alt="OpenSow logo">
    </picture>
  </a>
</p>
<p align="center">The open source AI gardening agent.</p>
<p align="center">
  <a href="https://opensow.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/opensow-ai"><img alt="npm" src="https://img.shields.io/npm/v/opensow-ai?style=flat-square" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a>
</p>

---

OpenSow is a CLI gardening agent that helps you plan and manage your garden. Give it your location, available space, and what you want to grow — it turns that into clear plans, schedules, and checklists.

### Installation

```bash
curl -fsSL https://opensow.ai/install | bash

# Package managers
npm i -g opensow-ai@latest        # or bun/pnpm/yarn
brew install atasrophic/tap/opensow # macOS and Linux
nix run github:atasrophic/opensow  # Nix
```

### What It Does

- **Garden setup** — Walk through your location, USDA zone, frost dates, growing spaces (beds, containers, seed trays), light and watering conditions
- **Season management** — Start a new growing season, migrate perennials from the previous year, archive old seasons
- **Guided planting** — Take a quiz (Chef / Parent / Homesteader), set your engagement level, get curated plant recommendations tailored to your zone and spaces
- **Direct planting** — Tell it exactly what you want to grow, either for the full season or the current planting window
- **Crop data** — Detailed agronomic profiles for each plant: taxonomy, spacing, seed starting, transplanting, cultivation, harvest timing, and companion/antagonist info
- **Season planning** — Square foot gardening layouts, companion planting arrangements, succession planting schedules, and month-by-month timelines

### Agents

OpenSow is driven by specialized agents that you can switch between with the `Tab` key.

| Agent             | Role                                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **gartenmeister** | Default agent. The master gardener that orchestrates everything — routes to specialist subagents, executes plans, runs commands. |
| **research**      | Read-only exploration mode. Browse your garden data, save findings to markdown.                                                  |

Behind the scenes, the gartenmeister delegates to purpose-built subagents:

| Subagent              | Role                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------ |
| **garden-setup**      | Guides you through creating a garden with location, climate zone, and growing spaces |
| **season-management** | Starts seasons, migrates perennials, manages the season lifecycle                    |
| **crop-data**         | Populates detailed agronomic data for each plant                                     |
| **guided-planting**   | Runs the gardener type quiz and generates curated recommendations                    |
| **direct-planting**   | Collects plants from users who already know what they want to grow                   |
| **season-planner**    | Generates square foot layouts, companion planting, and month-by-month schedules      |
| **general**           | General-purpose agent for complex multi-step tasks                                   |
| **explore**           | Fast read-only scout for searching garden data                                       |

### Quick Start

```
opensow
```

The gartenmeister will greet you and walk you through setting up your first garden. From there you can start a season, add plants, and generate a plan.

### License

MIT
