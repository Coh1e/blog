import { Link } from "react-router-dom"
import type { Entry } from "@/lib/content"
import { entryHref } from "@/lib/content"
import styles from "./PrevNext.module.css"

interface Props {
  prev?: Entry
  next?: Entry
  lang: "zh-CN" | "en"
}

const COPY = {
  "zh-CN": { prev: "前一篇", next: "后一篇" },
  en: { prev: "Previous", next: "Next" },
}

export function PrevNext({ prev, next, lang }: Props) {
  if (!prev && !next) return null
  const copy = COPY[lang]
  return (
    <nav className={styles.nav} aria-label={lang === "zh-CN" ? "文章导航" : "Article navigation"}>
      <div className={styles.cell}>
        {prev && (
          <Link to={entryHref(prev) + "/"} className={styles.link}>
            <span className={styles.label}>← {copy.prev}</span>
            <span className={styles.title}>{prev.title}</span>
          </Link>
        )}
      </div>
      <div className={`${styles.cell} ${styles.right}`}>
        {next && (
          <Link to={entryHref(next) + "/"} className={styles.link}>
            <span className={styles.label}>{copy.next} →</span>
            <span className={styles.title}>{next.title}</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
