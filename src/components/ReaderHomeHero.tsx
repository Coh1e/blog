import { Link } from "react-router-dom"
import styles from "./ReaderHomeHero.module.css"

interface Props {
  lang: "zh-CN" | "en"
  locale: "zh" | "en"
}

const COPY = {
  "zh-CN": { tagline: "记录想法，写慢一点。", aboutHref: "/about/", aboutLabel: "关于我 →" },
  en:      { tagline: "Notes that grow slowly.", aboutHref: "/en/about/", aboutLabel: "About me →" },
} as const

/**
 * Reader-mode hero shown above HomePage's intro per Figma 209:391 / 209:425:
 *   Avatar 64 + Wordmark 24 + tagline (no sidebar, no LangToggle, no toggles).
 */
export function ReaderHomeHero({ lang }: Props) {
  const c = COPY[lang]
  return (
    <header className={styles.hero}>
      <Link to={c.aboutHref} aria-label={c.aboutLabel} className={styles.imageLink}>
        <img src="/avatar.jpg" alt="" width={64} height={64} className={styles.image} />
      </Link>
      <h1 className={styles.wordmark}>
        <span className={styles.zh}>未经授权</span>
        <span className={styles.sep}> · </span>
        <span className={styles.en}>Unauthorized</span>
      </h1>
      <p className={styles.tagline}>{c.tagline}</p>
    </header>
  )
}
