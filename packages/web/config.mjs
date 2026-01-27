const stage = process.env.SST_STAGE || "dev"

export default {
  url: stage === "production" ? "https://opensow.ai" : `https://${stage}.opensow.ai`,
  console: stage === "production" ? "https://opensow.ai/auth" : `https://${stage}.opensow.ai/auth`,
  email: "contact@anoma.ly",
  socialCard: "https://social-cards.sst.dev",
  github: "https://github.com/anomalyco/opensow",
  discord: "https://opensow.ai/discord",
  headerLinks: [
    { name: "Home", url: "/" },
    { name: "Docs", url: "/docs/" },
  ],
}
