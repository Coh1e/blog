import { useLocation } from "react-router-dom"
import styles from "./ReaderExitBar.module.css"

/**
 * Visible only when html.reader-mode is on (CSS-toggled via :global selector).
 * Replaces the regular Toolbar in reader mode per Figma 209:344 / 209:392 / 209:460:
 *   ← exit reader            未经授权 · Unauthorized            (spacer)
 */
export function ReaderExitBar() {
  const { pathname } = useLocation()
  const isEn = pathname.startsWith("/en")
  const exitLabel = isEn ? "← Exit reader" : "← 退出阅读"

  const exit = () => {
    document.documentElement.classList.remove("reader-mode")
    try {
      localStorage.removeItem("reader")
    } catch {}
  }

  return (
    <header className={styles.exitBar}>
      <button type="button" className={styles.exitLink} onClick={exit}>
        {exitLabel}
      </button>
      <p className={styles.wordmark}>
        <span className={styles.zh}>未经授权</span>
        <span className={styles.sep}> · </span>
        <span className={styles.en}>Unauthorized</span>
      </p>
      <span className={styles.spacer} aria-hidden="true" />
    </header>
  )
}
