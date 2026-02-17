<p align="center">
  <a href="https://opensow.ai">
    <picture>
      <source srcset="packages/identity/mark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/identity/mark-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/identity/mark-light.svg" alt="Logo OpenSow">
    </picture>
  </a>
</p>
<p align="center">L’agente di coding AI open source.</p>
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

### Installazione

```bash
# YOLO
curl -fsSL https://opensow.ai/install | bash

# Package manager
npm i -g opensow-ai@latest        # oppure bun/pnpm/yarn
scoop install opensow             # Windows
choco install opensow             # Windows
brew install atasrophic/tap/opensow # macOS e Linux (consigliato, sempre aggiornato)
brew install opensow              # macOS e Linux (formula brew ufficiale, aggiornata meno spesso)
paru -S opensow-bin               # Arch Linux
mise use -g opensow               # Qualsiasi OS
nix run nixpkgs#opensow           # oppure github:atasrophic/opensow per l’ultima branch di sviluppo
```

> [!TIP]
> Rimuovi le versioni precedenti alla 0.1.x prima di installare.

#### Directory di installazione

Lo script di installazione rispetta il seguente ordine di priorità per il percorso di installazione:

1. `$OPENCODE_INSTALL_DIR` – Directory di installazione personalizzata
2. `$XDG_BIN_DIR` – Percorso conforme alla XDG Base Directory Specification
3. `$HOME/bin` – Directory binaria standard dell’utente (se esiste o può essere creata)
4. `$HOME/.opensow/bin` – Fallback predefinito

```bash
# Esempi
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://opensow.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://opensow.ai/install | bash
```

### Agenti

OpenSow include due agenti integrati tra cui puoi passare usando il tasto `Tab`.

- **gartenmeister** – Predefinito, agente con accesso completo per il lavoro di sviluppo
- **plan** – Agente in sola lettura per analisi ed esplorazione del codice
  - Nega le modifiche ai file per impostazione predefinita
  - Chiede il permesso prima di eseguire comandi bash
  - Ideale per esplorare codebase sconosciute o pianificare modifiche

È inoltre incluso un sotto-agente **general** per ricerche complesse e attività multi-step.
Viene utilizzato internamente e può essere invocato usando `@general` nei messaggi.

Scopri di più sugli [agenti](https://opensow.ai/docs/agents).

### Documentazione

Per maggiori informazioni su come configurare OpenSow, [**consulta la nostra documentazione**](https://opensow.ai/docs).

### Contribuire

Se sei interessato a contribuire a OpenSow, leggi la nostra [guida alla contribuzione](./CONTRIBUTING.md) prima di inviare una pull request.

### Costruire su OpenSow

Se stai lavorando a un progetto correlato a OpenSow e che utilizza “opensow” come parte del nome (ad esempio “opensow-dashboard” o “opensow-mobile”), aggiungi una nota nel tuo README per chiarire che non è sviluppato dal team OpenSow e che non è affiliato in alcun modo con noi.

### FAQ

#### In cosa è diverso da Claude Code?

È molto simile a Claude Code in termini di funzionalità. Ecco le principali differenze:

- 100% open source
- Non è legato a nessun provider. Anche se consigliamo i modelli forniti tramite [OpenSow Zen](https://opensow.ai/zen), OpenSow può essere utilizzato con Claude, OpenAI, Google o persino modelli locali. Con l’evoluzione dei modelli, le differenze tra di essi si ridurranno e i prezzi scenderanno, quindi essere indipendenti dal provider è importante.
- Supporto LSP pronto all’uso
- Forte attenzione alla TUI. OpenSow è sviluppato da utenti neovim e dai creatori di [terminal.shop](https://terminal.shop); spingeremo al limite ciò che è possibile fare nel terminale.
- Architettura client/server. Questo, ad esempio, permette a OpenSow di girare sul tuo computer mentre lo controlli da remoto tramite un’app mobile. La frontend TUI è quindi solo uno dei possibili client.

---

**Unisciti alla nostra community** [Discord](https://discord.gg/opensow) | [X.com](https://x.com/opensow)
