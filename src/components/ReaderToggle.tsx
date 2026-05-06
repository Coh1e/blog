import { useEffect, useState } from "react"
import styles from "./IconButton.module.css"

interface Props {
  lang?: "zh-CN" | "en"
  /** When true, render only the icon (used in the article Top Bar). */
  iconOnly?: boolean
}

export function ReaderToggle({ lang = "zh-CN", iconOnly = false }: Props) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(document.documentElement.classList.contains("reader-mode"))
  }, [])

  const toggle = () => {
    const next = !document.documentElement.classList.contains("reader-mode")
    document.documentElement.classList.toggle("reader-mode", next)
    if (next) localStorage.setItem("reader", "1")
    else localStorage.removeItem("reader")
    setActive(next)
  }

  const label = lang === "zh-CN" ? "阅读" : "Read"
  return (
    <button
      type="button"
      className={styles.button}
      onClick={toggle}
      aria-label={label}
      aria-pressed={active}
    >
      <span aria-hidden="true">⛶</span>
      {!iconOnly && <span>{label}</span>}
    </button>
  )
}
