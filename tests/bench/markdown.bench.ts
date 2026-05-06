import { bench, describe } from "vitest"
import { extractHeadings } from "@/lib/markdown"

const SHORT_BODY = `# Title

## Section A

Hello world. This is a short paragraph.

### Subsection A1

More prose with a [link](https://example.com).

## Section B

Final paragraph.
`

// Build a ~20KB body with a realistic mix of headings, paragraphs, and a fence.
function makeLongBody(): string {
  const para =
    "这是一段中文 prose 与 English mixed paragraph that simulates an average article line. ".repeat(
      6,
    )
  const parts: string[] = ["# Title", ""]
  for (let i = 1; i <= 30; i++) {
    parts.push(`## Section ${i}`, "", para, "", `### Sub ${i}.1`, "", para, "")
    if (i % 7 === 0) {
      parts.push("```", "// fenced code block — extractHeadings must skip", "// ## fake heading", "```", "")
    }
  }
  return parts.join("\n")
}

const LONG_BODY = makeLongBody()

describe("extractHeadings", () => {
  bench("short body (~150 chars)", () => {
    extractHeadings(SHORT_BODY)
  })

  bench("long body (~20KB, 60 real headings, 4 fences)", () => {
    extractHeadings(LONG_BODY)
  })
})
