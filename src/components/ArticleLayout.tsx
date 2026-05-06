import { useState, type ReactNode } from "react"
import { Toolbar } from "./Toolbar"
import { TableOfContents } from "./TableOfContents"
import { Backlinks, type Backlink } from "./Backlinks"
import { TagPill } from "./TagPill"
import { PageHead } from "./PageHead"
import { AudioPlayer } from "./AudioPlayer"
import { formatDate, type Status } from "@/lib/content"
import type { Heading } from "@/lib/markdown"
import styles from "./ArticleLayout.module.css"

interface Props {
  lang: "zh-CN" | "en"
  currentLocale: "zh" | "en"
  /** Slug WITHOUT locale prefix; used to compute LangToggle mirror URL. */
  pageSlug: string
  /** Whether the other-language mirror of this entry exists. */
  mirrorExists?: boolean
  title: string
  description?: string
  date?: Date
  updated?: Date
  status?: Status
  audio?: string
  tags?: string[]
  readingTime?: number
  headings: Heading[]
  backlinks?: Backlink[]
  /** When true, hide the right rail (TOC + Backlinks). About / Now use this. */
  hideRail?: boolean
  /** Override the auto-generated meta line (date · reading time …). */
  metaOverride?: ReactNode
  /** Override the auto-derived breadcrumb (default: parent segments of pageSlug). */
  breadcrumb?: string
  children: ReactNode
}

function daysBetween(a: Date, b: Date): number {
  const ms = Math.abs(a.getTime() - b.getTime())
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

export function ArticleLayout({
  lang,
  currentLocale,
  pageSlug,
  mirrorExists = true,
  title,
  description,
  date,
  updated,
  status,
  audio,
  tags = [],
  readingTime,
  headings,
  backlinks = [],
  hideRail = false,
  metaOverride,
  breadcrumb: breadcrumbProp,
  children,
}: Props) {
  const [audioOpen, setAudioOpen] = useState(false)
  const breadcrumb = breadcrumbProp ?? pageSlug.split("/").slice(0, -1).join(" / ")
  const minLabel = lang === "zh-CN" ? "分钟阅读" : "min read"
  const listenLabel = lang === "zh-CN" ? "配读" : "Listen"
  const tendedLabel = lang === "zh-CN" ? "最近修剪" : "Last tended"
  const dayUnit = lang === "zh-CN" ? "天前" : "days ago"

  const showLastTended = status === "evergreen" && date && updated && updated > date
  const tendedDays = showLastTended ? daysBetween(updated as Date, new Date()) : null

  return (
    <>
      <PageHead title={title} description={description} lang={lang} pageSlug={pageSlug} />
      <Toolbar lang={lang} currentLocale={currentLocale} pageSlug={pageSlug} mirrorExists={mirrorExists} />

      <div className={`${styles.row} ${hideRail ? styles.rowNoRail : ""}`}>
        <article className={styles.article}>
          {breadcrumb && <p className={styles.breadcrumb}>{breadcrumb} /</p>}
          <h1 className={styles.title}>{title}</h1>
          {metaOverride !== undefined ? (
            metaOverride && <p className={styles.meta}>{metaOverride}</p>
          ) : (
            <p className={styles.meta}>
              {formatDate(date)}
              {readingTime ? ` · ${readingTime} ${minLabel}` : null}
              {audio && (
                <>
                  {" · "}
                  <button
                    type="button"
                    className={styles.audioEntry}
                    onClick={() => setAudioOpen((v) => !v)}
                    aria-expanded={audioOpen}
                  >
                    ▶ {listenLabel}
                  </button>
                </>
              )}
              {tendedDays !== null && (
                <span className={styles.tended}>
                  {" · "}
                  {tendedLabel} {tendedDays} {dayUnit}
                </span>
              )}
              {status === "evergreen" && (
                <span className={styles.statusGlyph} aria-label="evergreen">
                  {" · ●"}
                </span>
              )}
            </p>
          )}
          {tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map((t) => (
                <TagPill key={t} tag={t} lang={lang} />
              ))}
            </div>
          )}
          {audio && audioOpen && (
            <AudioPlayer src={audio} lang={lang} onClose={() => setAudioOpen(false)} />
          )}
          <div className={styles.body}>{children}</div>
        </article>

        {!hideRail && (
          <aside className={styles.rail}>
            <TableOfContents headings={headings} lang={lang} />
            <Backlinks backlinks={backlinks} lang={lang} />
          </aside>
        )}
      </div>
    </>
  )
}
