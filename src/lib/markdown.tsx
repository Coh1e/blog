import { Children, isValidElement, memo, useMemo } from "react"
import { Link } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { transformWikilinks } from "./wikilinks"
import { remarkCallouts } from "./remark-callouts"
import { Mermaid } from "@/components/Mermaid"
import { ImageLightbox } from "@/components/ImageLightbox"

interface MarkdownProps {
  body: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}\-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function reactNodeToText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(reactNodeToText).join("")
  if (typeof node === "object" && "props" in node) {
    return reactNodeToText((node as { props: { children?: ReactNode } }).props.children)
  }
  return ""
}

function MdLink({ href, children, ...rest }: ComponentPropsWithoutRef<"a">) {
  if (!href) return <a {...rest}>{children}</a>
  // Footnote refs / backrefs: keep on-page anchor behavior
  if (href.startsWith("#")) return <a href={href} {...rest}>{children}</a>
  const isInternal = href.startsWith("/") && !href.startsWith("//")
  if (isInternal) {
    return <Link to={href}>{children}</Link>
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  )
}

function MdH2({ children, ...rest }: ComponentPropsWithoutRef<"h2">) {
  const id = slugify(reactNodeToText(children))
  return (
    <h2 id={id} {...rest}>
      {children}
      <a href={`#${id}`} className="heading-anchor" aria-label="link to this section">#</a>
    </h2>
  )
}
function MdH3({ children, ...rest }: ComponentPropsWithoutRef<"h3">) {
  const id = slugify(reactNodeToText(children))
  return (
    <h3 id={id} {...rest}>
      {children}
      <a href={`#${id}`} className="heading-anchor" aria-label="link to this section">#</a>
    </h3>
  )
}

/** Click-to-zoom image with optional caption. Per Figma 186:188 the image
 *  surface is interactive: hover → zoom cursor, click → lightbox.
 *  When the markdown image has a title — `![alt](src "title")` — render as
 *  <figure> with <figcaption> containing the title. */
function MdImg({ src, alt, title }: ComponentPropsWithoutRef<"img">) {
  const lightbox = src ? <ImageLightbox src={src} alt={alt ?? ""} /> : null
  if (title && lightbox) {
    return (
      <figure className="md-figure">
        {lightbox}
        <figcaption>{title}</figcaption>
      </figure>
    )
  }
  return lightbox
}

/** Markdown image syntax produces <p><img></p>. Unwrap when the only child is
 *  an image so we don't emit invalid <p><figure></p> nesting. */
function MdParagraph({ children, ...rest }: ComponentPropsWithoutRef<"p">) {
  // children may be a single React element (the image) or a 1-length array
  const flat = Array.isArray(children) ? children : [children]
  if (
    flat.length === 1 &&
    typeof flat[0] === "object" &&
    flat[0] !== null &&
    "type" in (flat[0] as object) &&
    (flat[0] as { type?: unknown }).type === MdImg
  ) {
    return <>{flat[0]}</>
  }
  return <p {...rest}>{children}</p>
}

/** Detect ```mermaid fenced blocks and hand them to <Mermaid /> for client-side
 *  rendering. Other fenced blocks pass through as <pre>. */
function MdPre({ children, ...rest }: ComponentPropsWithoutRef<"pre">) {
  const flat = Children.toArray(children)
  const codeEl = flat.find((c) => isValidElement(c) && (c as React.ReactElement).type === "code")
  if (isValidElement(codeEl)) {
    const props = codeEl.props as { className?: string; children?: ReactNode }
    if (props.className === "language-mermaid") {
      const source = typeof props.children === "string"
        ? props.children
        : Array.isArray(props.children)
          ? props.children.join("")
          : String(props.children ?? "")
      return <Mermaid source={source.trim()} />
    }
  }
  return <pre {...rest}>{children}</pre>
}

// Memoized: SPA navigation between articles re-mounts ArticleLayout but the
// body string for the new entry is what actually changed. memo lets React skip
// re-rendering this subtree when the parent re-renders for unrelated reasons,
// and the inner useMemo skips the wikilink scan when the body hasn't changed.
export const Markdown = memo(function Markdown({ body }: MarkdownProps) {
  const transformed = useMemo(() => transformWikilinks(body), [body])
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath, remarkCallouts]}
      // rehype-raw lets remarkCallouts emit a small HTML node for the title
      // so the class survives the round-trip.
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      components={{
        a: MdLink,
        h2: MdH2,
        h3: MdH3,
        img: MdImg,
        p: MdParagraph,
        pre: MdPre,
      }}
    >
      {transformed}
    </ReactMarkdown>
  )
})

/** Extract h2/h3 from a markdown body for the table of contents.
 *  Slugs match the IDs generated by MdH2/MdH3 above.
 */
export type Heading = { depth: 2 | 3; slug: string; text: string }

export function extractHeadings(body: string): Heading[] {
  const headings: Heading[] = []
  const lines = body.split("\n")
  let inFence = false
  for (const line of lines) {
    if (/^```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const m = line.match(/^(##|###)\s+(.+?)\s*$/)
    if (!m) continue
    const depth = m[1].length as 2 | 3
    const text = m[2].replace(/`/g, "").trim()
    headings.push({ depth, slug: slugify(text), text })
  }
  return headings
}
