import { ListLayout } from "@/components/ListLayout"
import { ArchiveRow } from "@/components/ArchiveRow"
import { byDateDesc, getEntriesFor, type Lang } from "@/lib/content"
import styles from "./ArchivePage.module.css"

interface Props {
  locale: "zh" | "en"
}

export function ArchivePage({ locale }: Props) {
  const lang: Lang = locale === "en" ? "en" : "zh-CN"
  const title = lang === "zh-CN" ? "归档" : "Archive"
  const entries = getEntriesFor(lang).sort(byDateDesc)
  const description =
    lang === "zh-CN"
      ? `全部 ${entries.length} 条 · 按时序 · 不带筛选`
      : `All ${entries.length} entries · chronological · no filter`

  return (
    <ListLayout
      lang={lang}
      currentLocale={locale}
      pageSlug="all"
      title={title}
      description={description}
    >
      <ul className={styles.list}>
        {entries.map((e) => (
          <ArchiveRow key={e.slug} entry={e} showType />
        ))}
      </ul>
    </ListLayout>
  )
}
