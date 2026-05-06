import { Wordmark } from "./Wordmark"
import { LangToggle } from "./LangToggle"
import { ThemeToggle } from "./ThemeToggle"
import { ReaderToggle } from "./ReaderToggle"
import { SearchButton } from "./SearchButton"
import styles from "./Toolbar.module.css"

interface Props {
  lang: "zh-CN" | "en"
  currentLocale: "zh" | "en"
  /** Slug WITHOUT locale prefix; used to compute LangToggle mirror URL.
   *  Use "" for pages whose mirror is the locale homepage. */
  pageSlug?: string
  /** When false, LangToggle falls back the inactive lang to its home. */
  mirrorExists?: boolean
}

export function Toolbar({ lang, currentLocale, pageSlug = "", mirrorExists = true }: Props) {
  return (
    <header className={styles.toolbar}>
      <Wordmark href={currentLocale === "en" ? "/en/" : "/"} />
      <nav className={styles.utilities}>
        <SearchButton lang={lang} variant="button" />
        <ThemeToggle lang={lang} iconOnly />
        <ReaderToggle lang={lang} iconOnly />
        <span className={styles.vrule} aria-hidden="true" />
        <LangToggle currentLocale={currentLocale} pageSlug={pageSlug} mirrorExists={mirrorExists} />
      </nav>
    </header>
  )
}
