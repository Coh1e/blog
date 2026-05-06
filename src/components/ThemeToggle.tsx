import { useEffect, useState } from "react"
import styles from "./IconButton.module.css"

interface Props {
  lang?: "zh-CN" | "en"
  /** When true, render only the icon (used in the article Top Bar). */
  iconOnly?: boolean
}

export function ThemeToggle({ lang = "zh-CN", iconOnly = false }: Props) {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const t = (document.documentElement.dataset.theme === "dark" ? "dark" : "light") as
      | "light"
      | "dark"
    setTheme(t)
  }, [])

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark"
    document.documentElement.dataset.theme = next
    localStorage.setItem("theme", next)
    setTheme(next)
  }

  const label = lang === "zh-CN" ? "深色" : "Dark"
  return (
    <button
      type="button"
      className={styles.button}
      onClick={toggle}
      aria-label={label}
      aria-pressed={theme === "dark"}
    >
      <span aria-hidden="true">☾</span>
      {!iconOnly && <span>{label}</span>}
    </button>
  )
}
