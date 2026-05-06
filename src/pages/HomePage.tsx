import { HomeLayout } from "@/components/HomeLayout"
import { RecentEssayRow } from "@/components/RecentEssayRow"
import { NoteRow } from "@/components/NoteRow"
import { ReaderHomeHero } from "@/components/ReaderHomeHero"
import { useReaderMode } from "@/lib/useReaderMode"
import {
  getCounts,
  getRecent,
  getEntriesFor,
  byStatusThenDate,
  entryHref,
  type Lang,
} from "@/lib/content"
import styles from "./HomePage.module.css"

interface Props {
  locale: "zh" | "en"
}

const COPY = {
  zh: {
    htmlLang: "zh-CN" as Lang,
    intro: [
      "互联网上一个安静的角落。文字和笔记在这里慢慢生长。",
      "车库门开着写——这里大部分东西都没写完，这就是它的全部意义。",
    ],
    recentEssays: "最近的文章",
    recentNotes: "最近的笔记",
    indexLabel: "索引",
    indexLink: { href: "/map/", label: "→ 内容地图" },
    indexCountFormat: (n: number) => `  ·  全部 ${n} 条`,
    footerLinks: [
      { label: "RSS", href: "/feed.xml" },
    ],
    footerCopyright: "© 2026",
  },
  en: {
    htmlLang: "en" as Lang,
    intro: [
      "A quiet corner of the internet for essays and notes.",
      "Working with the garage door up — most things here are unfinished, and that's the point.",
    ],
    recentEssays: "Recent Essays",
    recentNotes: "Recent Notes",
    indexLabel: "Index",
    indexLink: { href: "/en/map/", label: "→ Content map" },
    indexCountFormat: (n: number) => `  ·  all ${n} entries`,
    footerLinks: [
      { label: "RSS", href: "/en/feed.xml" },
    ],
    footerCopyright: "© 2026",
  },
}

export function HomePage({ locale }: Props) {
  const lang: Lang = locale === "en" ? "en" : "zh-CN"
  const copy = COPY[locale]
  const counts = getCounts(lang)
  const essays = getRecent(lang, "post", 4)
  const notes = getEntriesFor(lang, { type: "note" })
    .sort(byStatusThenDate)
    .slice(0, 3)
  const totalEntries = counts.notes + counts.essays
  const isReader = useReaderMode()

  return (
    <HomeLayout lang={lang} currentLocale={locale}>
      {isReader && <ReaderHomeHero lang={lang} locale={locale} />}
      <div className={styles.intro}>
        {copy.intro.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <section className={styles.section}>
        <h2 className={styles.heading}>{copy.recentEssays}</h2>
        <ul className={styles.list}>
          {essays.map((e) => (
            <RecentEssayRow
              key={e.slug}
              date={e.date}
              title={e.title}
              href={entryHref(e)}
              summary={e.summary}
            />
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>{copy.recentNotes}</h2>
        <ul className={styles.list}>
          {notes.map((n) => (
            <NoteRow
              key={n.slug}
              title={n.title}
              href={entryHref(n)}
              status={n.status}
              summary={n.summary}
            />
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>{copy.indexLabel}</h2>
        <p className={styles.indexLink}>
          <a href={copy.indexLink.href}>{copy.indexLink.label}</a>
          <span className={styles.indexCount}>{copy.indexCountFormat(totalEntries)}</span>
        </p>
      </section>

      <footer className={styles.footer}>
        {copy.footerLinks.map((link) => (
          <a key={link.href} href={link.href} className={styles.footerLink}>
            {link.label}
          </a>
        ))}
        {"  ·  "}
        {copy.footerCopyright}
      </footer>
    </HomeLayout>
  )
}
