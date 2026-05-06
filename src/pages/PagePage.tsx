import { ArticleLayout } from "@/components/ArticleLayout"
import { Markdown, extractHeadings } from "@/lib/markdown"
import { formatDate, getEntry, type Lang } from "@/lib/content"

interface Props {
  pageName: "about" | "now"
  locale: "zh" | "en"
}

export function PagePage({ pageName, locale }: Props) {
  const slug = locale === "en" ? `en/pages/${pageName}` : `pages/${pageName}`
  const entry = getEntry(slug)
  if (!entry) return null
  const lang: Lang = entry.lang
  const headings = extractHeadings(entry.body)

  // Now wants a "更新于 X · 每月修剪一次" meta; About has no meta line.
  let metaOverride: React.ReactNode | null = null
  if (pageName === "now" && entry.updated) {
    const updatedLabel = lang === "zh-CN" ? "更新于" : "Updated"
    const cadence = lang === "zh-CN" ? "每月修剪一次" : "trimmed monthly"
    metaOverride = `${updatedLabel} ${formatDate(entry.updated)}  ·  ${cadence}`
  }

  return (
    <ArticleLayout
      lang={lang}
      currentLocale={locale}
      pageSlug={pageName}
      title={entry.title}
      description={entry.summary}
      headings={headings}
      hideRail
      breadcrumb="pages"
      metaOverride={metaOverride}
    >
      <Markdown body={entry.body} />
    </ArticleLayout>
  )
}
