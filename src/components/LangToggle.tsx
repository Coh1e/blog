import { Link } from "react-router-dom"
import styles from "./LangToggle.module.css"

interface Props {
  currentLocale: "zh" | "en"
  /** Page slug without locale prefix; used to compute mirror URL.
   *  e.g. for /posts/foo: pageSlug="posts/foo"; for / or /en/: "" */
  pageSlug?: string
  /** Whether the other language has a corresponding page.
   *  When false, the inactive locale link falls back to its homepage. */
  mirrorExists?: boolean
}

export function LangToggle({ currentLocale, pageSlug = "", mirrorExists = true }: Props) {
  const zhHref = currentLocale === "zh"
    ? (pageSlug ? `/${pageSlug}/` : "/")
    : (mirrorExists && pageSlug ? `/${pageSlug}/` : "/")
  const enHref = currentLocale === "en"
    ? (pageSlug ? `/en/${pageSlug}/` : "/en/")
    : (mirrorExists && pageSlug ? `/en/${pageSlug}/` : "/en/")
  const zhTitle = currentLocale === "en" && !mirrorExists ? "未翻译，回到中文首页" : undefined
  const enTitle = currentLocale === "zh" && !mirrorExists ? "Not translated, back to English home" : undefined
  return (
    <nav className={styles.toggle} aria-label="Language">
      <Link
        to={zhHref}
        className={currentLocale === "zh" ? styles.active : styles.inactive}
        aria-current={currentLocale === "zh" ? "true" : undefined}
        title={zhTitle}
      >
        中文
      </Link>
      <span className={styles.sep}>·</span>
      <Link
        to={enHref}
        className={currentLocale === "en" ? styles.active : styles.inactive}
        aria-current={currentLocale === "en" ? "true" : undefined}
        title={enTitle}
      >
        EN
      </Link>
    </nav>
  )
}
