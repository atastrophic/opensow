#!/usr/bin/env bun

import path from "path"
import fs from "fs/promises"
import { $ } from "bun"
import { fileURLToPath } from "url"

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

process.chdir(dir)

const arch = process.arch === "arm64" ? "arm64" : "x64"
const platform = process.platform === "darwin" ? "darwin" : "linux"
const target = `opensow-${platform}-${arch}`
const binary = path.join(dir, "dist", target, "bin", "opensow")
const dest = path.join(process.env.HOME!, ".local", "bin", "opensow")

console.log("Building opensow...")
await $`bun run build --single`

const exists = await Bun.file(binary).exists()
if (!exists) {
  console.error(`Binary not found: ${binary}`)
  process.exit(1)
}

await fs.mkdir(path.dirname(dest), { recursive: true })
await fs.rm(dest, { force: true })
await fs.symlink(binary, dest)

console.log(`Linked ${target} -> ${dest}`)

const version = await $`${dest} --version`.text()
console.log(`Installed: opensow v${version.trim()}`)
