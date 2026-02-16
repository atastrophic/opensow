import { TextAttributes } from "@opentui/core"
import { For } from "solid-js"
import { useTheme } from "@tui/context/theme"

const LOGO = [
  `   ___  _ __   ___ _ __  ___  _____      __`,
  `  / _ \\| '_ \\ / _ \\ '_ \\/ __|/ _ \\ \\ /\\ / /`,
  ` | (_) | |_) |  __/ | | \\__ \\ (_) \\ V  V / `,
  `  \\___/| .__/ \\___|_| |_|___/\\___/ \\_/\\_/  `,
  `       |_|                                 `,
]

export function Logo() {
  const { theme } = useTheme()

  return (
    <box>
      <For each={LOGO}>
        {(line) => (
          <text fg={theme.text} attributes={TextAttributes.BOLD} selectable={false}>
            {line}
          </text>
        )}
      </For>
    </box>
  )
}
