import styles from "./TableOfContents.module.css"
import type { Heading } from "@/lib/markdown"

interface Props {
  headings: Heading[]
  lang: "zh-CN" | "en"
}

export function TableOfContents({ headings, lang }: Props) {
  const h2s = headings.filter((h) => h.depth === 2)
  if (h2s.length === 0) return null
  return (
    <section className={styles.toc}>
      <h3 className={styles.heading}>{lang === "zh-CN" ? "目录" : "Contents"}</h3>
      <ul className={styles.list}>
        {h2s.map((h) => (
          <li key={h.slug}>
            <a href={`#${h.slug}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}
