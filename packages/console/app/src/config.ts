/**
 * Application-wide constants and configuration
 */
export const config = {
  // Base URL
  baseUrl: "https://opensow.ai",

  // GitHub
  github: {
    repoUrl: "https://github.com/anomalyco/opensow",
    starsFormatted: {
      compact: "80K",
      full: "80,000",
    },
  },

  // Social links
  social: {
    twitter: "https://x.com/opensow",
    discord: "https://discord.gg/opensow",
  },

  // Static stats (used on landing page)
  stats: {
    contributors: "600",
    commits: "7,500",
    monthlyUsers: "1.5M",
  },
} as const
