#!/usr/bin/env bun

// import { Script } from "@opensow-ai/script"
import { $ } from "bun"

// if (!Script.preview) {
// await $`gh release edit v${Script.version} --draft=false`
// }

await $`bun install`

await $`gh release download --pattern "opensow-linux-*64.tar.gz" --pattern "opensow-darwin-*64.zip" -D dist`

await import(`../packages/opensow/script/publish-registries.ts`)
