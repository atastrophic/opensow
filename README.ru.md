<p align="center">
  <a href="https://opensow.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenSow logo">
    </picture>
  </a>
</p>
<p align="center">Открытый AI-агент для программирования.</p>
<p align="center">
  <a href="https://opensow.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/opensow-ai"><img alt="npm" src="https://img.shields.io/npm/v/opensow-ai?style=flat-square" /></a>
  <a href="https://github.com/anomalyco/opensow/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/anomalyco/opensow/publish.yml?style=flat-square&branch=dev" /></a>
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

[![OpenSow Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://opensow.ai)

---

### Установка

```bash
# YOLO
curl -fsSL https://opensow.ai/install | bash

# Менеджеры пакетов
npm i -g opensow-ai@latest        # или bun/pnpm/yarn
scoop install opensow             # Windows
choco install opensow             # Windows
brew install anomalyco/tap/opensow # macOS и Linux (рекомендуем, всегда актуально)
brew install opensow              # macOS и Linux (официальная формула brew, обновляется реже)
paru -S opensow-bin               # Arch Linux
mise use -g opensow               # любая ОС
nix run nixpkgs#opensow           # или github:anomalyco/opensow для самой свежей ветки dev
```

> [!TIP]
> Перед установкой удалите версии старше 0.1.x.

### Десктопное приложение (BETA)

OpenSow также доступен как десктопное приложение. Скачайте его со [страницы релизов](https://github.com/anomalyco/opensow/releases) или с [opensow.ai/download](https://opensow.ai/download).

| Платформа             | Загрузка                              |
| --------------------- | ------------------------------------- |
| macOS (Apple Silicon) | `opensow-desktop-darwin-aarch64.dmg` |
| macOS (Intel)         | `opensow-desktop-darwin-x64.dmg`     |
| Windows               | `opensow-desktop-windows-x64.exe`    |
| Linux                 | `.deb`, `.rpm` или AppImage           |

```bash
# macOS (Homebrew)
brew install --cask opensow-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/opensow-desktop
```

#### Каталог установки

Скрипт установки выбирает путь установки в следующем порядке приоритета:

1. `$OPENCODE_INSTALL_DIR` - Пользовательский каталог установки
2. `$XDG_BIN_DIR` - Путь, совместимый со спецификацией XDG Base Directory
3. `$HOME/bin` - Стандартный каталог пользовательских бинарников (если существует или можно создать)
4. `$HOME/.opensow/bin` - Fallback по умолчанию

```bash
# Примеры
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://opensow.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://opensow.ai/install | bash
```

### Agents

В OpenSow есть два встроенных агента, между которыми можно переключаться клавишей `Tab`.

- **build** - По умолчанию, агент с полным доступом для разработки
- **plan** - Агент только для чтения для анализа и изучения кода
  - По умолчанию запрещает редактирование файлов
  - Запрашивает разрешение перед выполнением bash-команд
  - Идеален для изучения незнакомых кодовых баз или планирования изменений

Также включен сабагент **general** для сложных поисков и многошаговых задач.
Он используется внутренне и может быть вызван в сообщениях через `@general`.

Подробнее об [agents](https://opensow.ai/docs/agents).

### Документация

Больше информации о том, как настроить OpenSow: [**наши docs**](https://opensow.ai/docs).

### Вклад

Если вы хотите внести вклад в OpenSow, прочитайте [contributing docs](./CONTRIBUTING.md) перед тем, как отправлять pull request.

### Разработка на базе OpenSow

Если вы делаете проект, связанный с OpenSow, и используете "opensow" как часть имени (например, "opensow-dashboard" или "opensow-mobile"), добавьте примечание в README, чтобы уточнить, что проект не создан командой OpenSow и не аффилирован с нами.

### FAQ

#### Чем это отличается от Claude Code?

По возможностям это очень похоже на Claude Code. Вот ключевые отличия:

- 100% open source
- Не привязано к одному провайдеру. Мы рекомендуем модели из [OpenSow Zen](https://opensow.ai/zen); но OpenSow можно использовать с Claude, OpenAI, Google или даже локальными моделями. По мере развития моделей разрыв будет сокращаться, а цены падать, поэтому важна независимость от провайдера.
- Поддержка LSP из коробки
- Фокус на TUI. OpenSow построен пользователями neovim и создателями [terminal.shop](https://terminal.shop); мы будем раздвигать границы того, что возможно в терминале.
- Архитектура клиент/сервер. Например, это позволяет запускать OpenSow на вашем компьютере, а управлять им удаленно из мобильного приложения. Это значит, что TUI-фронтенд - лишь один из возможных клиентов.

---

**Присоединяйтесь к нашему сообществу** [Discord](https://discord.gg/opensow) | [X.com](https://x.com/opensow)
