/**
 * Remark plugin: Obsidian-flavored callouts.
 *
 *   > [!note]
 *   > body
 *
 *   > [!warning] Custom title
 *   > body
 *
 * Transforms qualifying blockquotes into <aside class="callout callout-<type>"> with
 * a <p class="callout-title"> prepended. Body markdown (links, formatting,
 * code, lists, nested anything) flows through normally.
 */
import { visit } from "unist-util-visit"
import type { Root, Blockquote, Paragraph, Text, Html } from "mdast"

const TYPE_LABELS: Record<string, string> = {
  note: "Note",
  info: "Info",
  tip: "Tip",
  warning: "Warning",
  caution: "Caution",
  important: "Important",
  abstract: "Abstract",
  quote: "Quote",
  example: "Example",
  question: "Question",
}
const ALIASES: Record<string, string> = {
  hint: "tip",
  attention: "warning",
  danger: "caution",
  summary: "abstract",
  tldr: "abstract",
  help: "question",
}
const HEAD = /^\[!([\w-]+)\][-+]?[ \t]*(.*)/

export function remarkCallouts() {
  return (tree: Root) => {
    visit(tree, "blockquote", (node: Blockquote) => {
      const first = node.children[0]
      if (!first || first.type !== "paragraph") return
      const firstText = (first as Paragraph).children[0]
      if (!firstText || firstText.type !== "text") return
      const text = firstText as Text

      // Match the marker line. Only consume up to the first newline.
      const lines = text.value.split("\n")
      const head = lines[0]
      const m = head.match(HEAD)
      if (!m) return

      const rawType = m[1].toLowerCase()
      const type = ALIASES[rawType] ?? rawType
      const customTitle = (m[2] ?? "").trim()
      const title = customTitle || TYPE_LABELS[type] || rawType

      // Strip the marker line from the first text node.
      const remainingText = lines.slice(1).join("\n")
      if (remainingText.trim()) {
        text.value = remainingText
      } else {
        // Whole first paragraph was just the marker — drop it (and the paragraph if now empty).
        ;(first as Paragraph).children.shift()
        if ((first as Paragraph).children.length === 0) node.children.shift()
      }

      // Prepend the title node as raw HTML so the class makes it through.
      const titleNode: Html = {
        type: "html",
        value: `<p class="callout-title">${escapeHtml(title)}</p>`,
      }
      node.children.unshift(titleNode)

      // Re-tag the blockquote as <aside class="callout callout-<type>">.
      ;(node as Blockquote & { data?: { hName?: string; hProperties?: Record<string, unknown> } }).data = {
        hName: "aside",
        hProperties: {
          className: ["callout", `callout-${type}`],
          role: "note",
        },
      }
    })
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
