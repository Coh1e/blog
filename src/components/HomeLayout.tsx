import type { ReactNode } from "react"
import { Wordmark } from "./Wordmark"
import { LangToggle } from "./LangToggle"
import { ThemeToggle } from "./ThemeToggle"
import { ReaderToggle } from "./ReaderToggle"
import { SearchButton } from "./SearchButton"
import { Avatar } from "./Avatar"
import { PageHead } from "./PageHead"
import { socialLinks } from "@/lib/site-config"
import styles from "./HomeLayout.module.css"

interface Props {
  lang: "zh-CN" | "en"
  currentLocale: "zh" | "en"
  children: ReactNode
}

const RAIL_COPY = {
  "zh-CN": {
    elsewhere: "别处",
    subscribe: "订阅",
    subscribeNote: "订阅更新",
    rssHref: "/feed.xml",
  },
  en: {
    elsewhere: "Elsewhere",
    subscribe: "Subscribe",
    subscribeNote: "Subscribe to updates",
    rssHref: "/en/feed.xml",
  },
} as const

export function HomeLayout({ lang, currentLocale, children }: Props) {
  const homeDescription =
    lang === "zh-CN"
      ? "一个中英双语的写作站点。长一点的文章，短一点的笔记。"
      : "A bilingual personal writing site. Long-form essays, short notes."
  const rail = RAIL_COPY[lang]
  const visibleSocial = socialLinks.filter((l) => l.href)

  return (
    <>
      <PageHead title="" description={homeDescription} lang={lang} pageSlug="" />
      <div className={styles.page}>
        <aside className={styles.sidebar}>
          <Wordmark href={currentLocale === "en" ? "/en/" : "/"} />
          <SearchButton lang={lang} variant="input" />
          <div className={styles.utilities}>
            <ThemeToggle lang={lang} />
            <ReaderToggle lang={lang} />
          </div>
          <LangToggle currentLocale={currentLocale} />
          <Avatar lang={lang} size="hero" />
        </aside>
        <main className={styles.main}>
          {children}
        </main>
        {(visibleSocial.length > 0 || rail.rssHref) && (
          <aside className={styles.rightRail}>
            {visibleSocial.length > 0 && (
              <section className={styles.railSection}>
                <h2 className={styles.railHeading}>{rail.elsewhere}</h2>
                <ul className={styles.railList}>
                  {visibleSocial.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className={styles.railLink}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {rail.rssHref && (
              <section className={styles.railSection}>
                <h2 className={styles.railHeading}>{rail.subscribe}</h2>
                <a href={rail.rssHref} className={styles.railLink}>RSS</a>
                <p className={styles.railNote}>{rail.subscribeNote}</p>
              </section>
            )}
          </aside>
        )}
      </div>
    </>
  )
}
