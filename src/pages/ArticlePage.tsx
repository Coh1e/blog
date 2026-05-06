import { useMemo } from "react"
import { ArticleLayout } from "@/components/ArticleLayout"
import { PrevNext } from "@/components/PrevNext"
import { SeriesNav } from "@/components/SeriesNav"
import { Comments } from "@/components/Comments"
import { Markdown, extractHeadings } from "@/lib/markdown"
import { getBacklinks } from "@/lib/backlinks"
import { getNeighbors, getSeriesPeers, hasMirror, type Entry } from "@/lib/content"

interface Props {
  entry: Entry
}

export function ArticlePage({ entry }: Props) {
  const lang = entry.lang
  const locale: "zh" | "en" = entry.lang === "en" ? "en" : "zh"
  const pageSlug = entry.slug.replace(/^en\//, "")

  const headings = useMemo(() => extractHeadings(entry.body), [entry.body])
  const backlinks = getBacklinks(entry.slug)
  const { prev, next } = getNeighbors(entry)
  const seriesPeers = getSeriesPeers(entry)
  const mirrorExists = hasMirror(entry)
  const charsPerMin = lang === "zh-CN" ? 400 : 1100
  const readingTime = Math.max(1, Math.round(entry.body.length / charsPerMin))

  return (
    <ArticleLayout
      lang={lang}
      currentLocale={locale}
      pageSlug={pageSlug}
      mirrorExists={mirrorExists}
      title={entry.title}
      description={entry.summary}
      date={entry.date}
      updated={entry.updated}
      status={entry.status}
      audio={entry.audio}
      tags={entry.tags}
      readingTime={readingTime}
      headings={headings}
      backlinks={backlinks}
    >
      {entry.series && seriesPeers.length > 1 && (
        <SeriesNav
          series={entry.series}
          peers={seriesPeers}
          currentSlug={entry.slug}
          lang={lang}
        />
      )}
      <Markdown body={entry.body} />
      <PrevNext prev={prev} next={next} lang={lang} />
      {entry.comments !== false && <Comments pageId={entry.slug} lang={lang} />}
    </ArticleLayout>
  )
}
