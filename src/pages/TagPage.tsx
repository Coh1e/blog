import { Link } from "react-router-dom"
import { Toolbar } from "@/components/Toolbar"
import { PageHead } from "@/components/PageHead"
import { ArchiveRow } from "@/components/ArchiveRow"
import {
  byDateDesc,
  getEntriesFor,
  tagHasMirror,
  type Lang,
  type Entry,
} from "@/lib/content"
import styles from "./TagPage.module.css"

interface Props {
  locale: "zh" | "en"
  tag: string
}

const COPY = {
  zh: {
    eyebrow: "tag /",
    subtitle: (n: number, t: string) => `${n} 条带 ${t} 标签的内容`,
    clearLabel: "清空 · 回到全部条目",
    railHeading: "其它标签",
  },
  en: {
    eyebrow: "tag /",
    subtitle: (n: number, t: string) => `${n} entries tagged ${t}`,
    clearLabel: "Clear · back to all entries",
    railHeading: "Other tags",
  },
}

const TAG_RAIL_LIMIT = 12

export function TagPage({ locale, tag }: Props) {
  const lang: Lang = locale === "en" ? "en" : "zh-CN"
  const copy = COPY[locale]
  const all = getEntriesFor(lang)
  const filtered = all
    .filter((e: Entry) => e.tags.includes(tag))
    .sort(byDateDesc)

  // Other-tag frequencies (excluding the active tag)
  const tagFreq = new Map<string, number>()
  for (const e of all) {
    for (const t of e.tags) {
      if (t === tag) continue
      tagFreq.set(t, (tagFreq.get(t) ?? 0) + 1)
    }
  }
  const sortedOthers = [...tagFreq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, TAG_RAIL_LIMIT)

  const allHref = locale === "en" ? "/en/all/" : "/all/"
  const tagHrefBase = locale === "en" ? "/en/tags" : "/tags"
  const title = `#${tag}`

  return (
    <>
      <PageHead title={title} description={copy.subtitle(filtered.length, tag)} lang={lang} pageSlug={`tags/${tag}`} />
      <Toolbar lang={lang} currentLocale={locale} pageSlug={`tags/${tag}`} mirrorExists={tagHasMirror(tag, lang)} />

      <div className={styles.row}>
        <main className={styles.main}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{copy.subtitle(filtered.length, tag)}</p>
          </header>

          <div className={styles.chipRow}>
            <span className={styles.chip}>
              <span className={styles.chipLabel}>{tag}</span>
              <Link to={allHref} className={styles.chipClose} aria-label="remove filter">
                ×
              </Link>
            </span>
            <Link to={allHref} className={styles.clearLink}>
              {copy.clearLabel}
            </Link>
          </div>

          <ul className={styles.list}>
            {filtered.map((e) => (
              <ArchiveRow key={e.slug} entry={e} showType />
            ))}
          </ul>
        </main>

        <aside className={styles.rail}>
          <h2 className={styles.railHeading}>{copy.railHeading}</h2>
          <div className={styles.tagWrap}>
            {sortedOthers.map(([t, n]) => (
              <Link key={t} to={`${tagHrefBase}/${t}/`} className={styles.tagItem}>
                <span className={styles.tagName}>{t}</span>
                <span className={styles.tagCount}>{n}</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </>
  )
}
