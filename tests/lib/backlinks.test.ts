import { describe, it, expect, vi, beforeEach } from "vitest"

const mockEntries = [
  {
    slug: "posts/a",
    title: "Post A",
    lang: "zh-CN",
    type: "post",
    tags: [],
    body: "Linking to [[posts/b]] in this paragraph.\n\nAnother paragraph.",
  },
  {
    slug: "posts/b",
    title: "Post B",
    lang: "zh-CN",
    type: "post",
    tags: [],
    body: "B references [[posts/c]] later.",
  },
  {
    slug: "posts/c",
    title: "Post C",
    lang: "zh-CN",
    type: "post",
    tags: [],
    body: "C is a leaf with [[posts/missing]] (broken).",
  },
]

vi.mock("@/lib/content", () => ({
  readAllEntries: vi.fn(() => mockEntries),
}))

beforeEach(() => {
  vi.resetModules()
})

describe("getBacklinks", () => {
  it("returns the entries that link TO the target slug", async () => {
    const { getBacklinks } = await import("@/lib/backlinks")
    const intoB = getBacklinks("posts/b")
    expect(intoB).toHaveLength(1)
    expect(intoB[0].slug).toBe("posts/a")
    expect(intoB[0].title).toBe("Post A")
  })

  it("attaches a context excerpt from the linking paragraph", async () => {
    const { getBacklinks } = await import("@/lib/backlinks")
    const intoB = getBacklinks("posts/b")
    expect(intoB[0].context).toBeDefined()
    expect(intoB[0].context).toContain("Linking to b")
  })

  it("returns an empty array for a slug with no inbound links", async () => {
    const { getBacklinks } = await import("@/lib/backlinks")
    expect(getBacklinks("posts/a")).toEqual([])
  })

  it("ignores wikilinks pointing to slugs that don't exist", async () => {
    const { getBacklinks } = await import("@/lib/backlinks")
    expect(getBacklinks("posts/missing")).toEqual([])
  })

  it("caches the inverse map across calls (calls readAllEntries once)", async () => {
    const { readAllEntries } = await import("@/lib/content")
    const { getBacklinks } = await import("@/lib/backlinks")
    const spy = readAllEntries as unknown as { mock: { calls: unknown[] } }
    const beforeCalls = spy.mock.calls.length
    getBacklinks("posts/a")
    getBacklinks("posts/b")
    getBacklinks("posts/c")
    // compute() runs at most once across these calls
    expect(spy.mock.calls.length - beforeCalls).toBeLessThanOrEqual(1)
  })
})
