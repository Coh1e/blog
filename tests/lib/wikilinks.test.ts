import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock readAllEntries before importing wikilinks (which calls it transitively)
vi.mock("@/lib/content", () => ({
  readAllEntries: vi.fn(() => [
    { slug: "posts/foo", title: "Foo Post", lang: "zh-CN", type: "post", tags: [], body: "" },
    { slug: "en/posts/foo", title: "Foo (EN)", lang: "en", type: "post", tags: [], body: "" },
    { slug: "notes/bar", title: "Bar Note", lang: "zh-CN", type: "note", tags: [], body: "" },
  ]),
}))

beforeEach(async () => {
  // wikilinks caches a titleMap module-level; reset by re-importing fresh
  vi.resetModules()
})

describe("transformWikilinks", () => {
  it("rewrites a bare wikilink to a markdown link with the entry title", async () => {
    const { transformWikilinks } = await import("@/lib/wikilinks")
    expect(transformWikilinks("see [[posts/foo]] for context")).toBe(
      "see [Foo Post](/posts/foo/) for context",
    )
  })

  it("uses custom display text when provided", async () => {
    const { transformWikilinks } = await import("@/lib/wikilinks")
    expect(transformWikilinks("[[posts/foo|see this]]")).toBe("[see this](/posts/foo/)")
  })

  it("rewrites EN-prefixed slugs", async () => {
    const { transformWikilinks } = await import("@/lib/wikilinks")
    expect(transformWikilinks("[[en/posts/foo]]")).toBe("[Foo (EN)](/en/posts/foo/)")
  })

  it("leaves unresolved wikilinks intact", async () => {
    const { transformWikilinks } = await import("@/lib/wikilinks")
    expect(transformWikilinks("[[posts/missing]]")).toBe("[[posts/missing]]")
  })

  it("preserves wikilinks inside fenced code blocks", async () => {
    const { transformWikilinks } = await import("@/lib/wikilinks")
    const body = ["normal [[posts/foo]]", "```", "[[posts/foo]]", "```"].join("\n")
    const out = transformWikilinks(body)
    expect(out).toContain("[Foo Post](/posts/foo/)")
    // The fenced version stays literal
    expect(out).toContain("```\n[[posts/foo]]\n```")
  })

  it("preserves wikilinks inside inline backticks", async () => {
    const { transformWikilinks } = await import("@/lib/wikilinks")
    expect(transformWikilinks("inline `[[posts/foo]]` example")).toBe(
      "inline `[[posts/foo]]` example",
    )
  })
})

describe("extractWikilinkTargets", () => {
  it("returns the raw target slugs from prose, skipping code", async () => {
    const { extractWikilinkTargets } = await import("@/lib/wikilinks")
    const body = [
      "see [[posts/foo]] and [[notes/bar|alias]]",
      "```",
      "[[posts/ignored-in-fence]]",
      "```",
      "inline `[[posts/ignored-in-tick]]`",
    ].join("\n")
    expect(extractWikilinkTargets(body)).toEqual(["posts/foo", "notes/bar"])
  })
})
