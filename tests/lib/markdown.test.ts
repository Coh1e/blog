import { describe, it, expect } from "vitest"
import { extractHeadings } from "@/lib/markdown"

describe("extractHeadings", () => {
  it("extracts h2 and h3 with correct depth and slug", () => {
    const body = [
      "# top-level (ignored)",
      "## Section One",
      "some prose",
      "### Sub Two",
      "## Section Three",
      "### Sub Four",
    ].join("\n")
    const out = extractHeadings(body)
    expect(out).toEqual([
      { depth: 2, slug: "section-one", text: "Section One" },
      { depth: 3, slug: "sub-two", text: "Sub Two" },
      { depth: 2, slug: "section-three", text: "Section Three" },
      { depth: 3, slug: "sub-four", text: "Sub Four" },
    ])
  })

  it("strips punctuation from slug (current slugify behavior)", () => {
    // Documented behavior: slugify removes anything outside Letter/Number/-,
    // so dots/parens collapse the surrounding tokens together.
    const body = "## Subsection 1.1"
    expect(extractHeadings(body)).toEqual([
      { depth: 2, slug: "subsection-11", text: "Subsection 1.1" },
    ])
  })

  it("ignores headings inside fenced code blocks", () => {
    const body = [
      "## Real Heading",
      "```",
      "## fake heading inside fence",
      "```",
      "## Another Real",
    ].join("\n")
    const out = extractHeadings(body)
    expect(out.map((h) => h.text)).toEqual(["Real Heading", "Another Real"])
  })

  it("strips inline backticks from heading text before slugifying", () => {
    const body = "## `code` in heading"
    const out = extractHeadings(body)
    expect(out).toEqual([{ depth: 2, slug: "code-in-heading", text: "code in heading" }])
  })

  it("handles CJK characters in slugs (preserves letters via \\p{L})", () => {
    const body = "## 你好 world"
    const out = extractHeadings(body)
    expect(out[0].slug).toBe("你好-world")
    expect(out[0].text).toBe("你好 world")
  })

  it("returns empty array on body with no h2/h3", () => {
    expect(extractHeadings("just prose with `# fake` and ## inline")).toEqual([])
  })

  it("trims trailing whitespace from heading text", () => {
    const body = "## Trailing   "
    expect(extractHeadings(body)).toEqual([
      { depth: 2, slug: "trailing", text: "Trailing" },
    ])
  })
})
