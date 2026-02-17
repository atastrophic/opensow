<p align="center">
  <a href="https://opensow.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenSow logo">
    </picture>
  </a>
</p>
<p align="center">The open source AI coding agent.</p>
<p align="center">
  <a href="https://opensow.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/opensow-ai"><img alt="npm" src="https://img.shields.io/npm/v/opensow-ai?style=flat-square" /></a>
  <a href="https://github.com/atasrophic/opensow/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/atasrophic/opensow/publish.yml?style=flat-square&branch=dev" /></a>
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

### Installation

```bash
# YOLO
curl -fsSL https://opensow.ai/install | bash

# Package managers
npm i -g opensow-ai@latest        # or bun/pnpm/yarn
scoop install opensow             # Windows
choco install opensow             # Windows
brew install atasrophic/tap/opensow # macOS and Linux (recommended, always up to date)
brew install opensow              # macOS and Linux (official brew formula, updated less)
paru -S opensow-bin               # Arch Linux
mise use -g opensow               # Any OS
nix run nixpkgs#opensow           # or github:atasrophic/opensow for latest dev branch
```

> [!TIP]
> Remove versions older than 0.1.x before installing.

#### Installation Directory

The install script respects the following priority order for the installation path:

1. `$OPENCODE_INSTALL_DIR` - Custom installation directory
2. `$XDG_BIN_DIR` - XDG Base Directory Specification compliant path
3. `$HOME/bin` - Standard user binary directory (if exists or can be created)
4. `$HOME/.opensow/bin` - Default fallback

```bash
# Examples
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://opensow.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://opensow.ai/install | bash
```

### Agents

OpenSow includes two built-in agents you can switch between with the `Tab` key.

- **gartenmeister** - Default, full access agent for development work
- **plan** - Read-only agent for analysis and code exploration
  - Denies file edits by default
  - Asks permission before running bash commands
  - Ideal for exploring unfamiliar files or planning changes

Also, included is a **general** subagent for complex searches and multistep tasks.
This is used internally and can be invoked using `@general` in messages.

Learn more about [agents](https://opensow.ai/docs/agents).

### Documentation

For more info on how to configure OpenSow [**head over to our docs**](https://opensow.ai/docs).

### Contributing

If you're interested in contributing to OpenSow, please read our [contributing docs](./CONTRIBUTING.md) before submitting a pull request.

### Building on OpenSow

If you are working on a project that's related to OpenSow and is using "opensow" as a part of its name; for example, "opensow-dashboard" or "opensow-mobile", please add a note to your README to clarify that it is not built by the OpenSow team and is not affiliated with us in any way.

### FAQ

#### How is this different from Claude Code?

It's very similar to Claude Code in terms of capability. Here are the key differences:

- 100% open source
- Not coupled to any provider. Although we recommend the models we provide through [OpenSow Zen](https://opensow.ai/zen); OpenSow can be used with Claude, OpenAI, Google or even local models. As models evolve the gaps between them will close and pricing will drop so being provider-agnostic is important.
- Out of the box LSP support
- A focus on TUI. OpenSow is built by neovim users and the creators of [terminal.shop](https://terminal.shop); we are going to push the limits of what's possible in the terminal.
- A client/server architecture. This for example can allow OpenSow to run on your computer, while you can drive it remotely from a mobile app. Meaning that the TUI frontend is just one of the possible clients.

---

**Join our community** [Discord](https://discord.gg/opensow) | [X.com](https://x.com/opensow)
