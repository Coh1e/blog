import { bench, describe, vi } from "vitest"

// Build a fake corpus of 140 entries with realistic wikilink density.
function makeFakeEntries(n: number) {
  const entries: Array<{
    slug: string
    title: string
    lang: "zh-CN" | "en"
    type: "post"
    tags: string[]
    body: string
  }> = []
  for (let i = 0; i < n; i++) {
    const slug = `posts/p${i}`
    const links = [
      `[[posts/p${(i + 1) % n}]]`,
      `[[posts/p${(i + 7) % n}|alias]]`,
      `[[posts/p${(i + 31) % n}]]`,
    ].join(" and ")
    const para = "Lorem ipsum dolor sit amet ".repeat(20)
    const body = `${para}\n\n${links}\n\n${para}\n\n\`\`\`\n[[posts/ignored]]\n\`\`\``
    entries.push({
      slug,
      title: `Post ${i}`,
      lang: "zh-CN",
      type: "post",
      tags: [],
      body,
    })
  }
  return entries
}

const ENTRIES = makeFakeEntries(140)

vi.mock("@/lib/content", () => ({
  readAllEntries: () => ENTRIES,
}))

describe("backlinks compute (140 entries × ~3 wikilinks each)", () => {
  bench("getBacklinks first call (cold compute)", async () => {
    // Re-import to bust the module-level cache for each iteration
    vi.resetModules()
    const { getBacklinks } = await import("@/lib/backlinks")
    getBacklinks("posts/p0")
  })

  bench("getBacklinks subsequent call (cached)", async () => {
    const { getBacklinks } = await import("@/lib/backlinks")
    getBacklinks("posts/p42")
  })
})
