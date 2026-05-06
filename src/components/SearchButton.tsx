import { useState } from "react"
import { Search } from "./Search"
import styles from "./SearchButton.module.css"

interface Props {
  lang?: "zh-CN" | "en"
  variant?: "input" | "button"
}

export function SearchButton({ lang = "zh-CN", variant = "input" }: Props) {
  const placeholder = lang === "zh-CN" ? "搜索" : "Search"
  const [open, setOpen] = useState(false)

  const onClick = () => setOpen(true)

  const trigger = variant === "input" ? (
    <button type="button" className={styles.input} onClick={onClick} aria-label={placeholder}>
      <span className={styles.icon} aria-hidden="true">⌕</span>
      <span className={styles.placeholder}>{placeholder}</span>
    </button>
  ) : (
    <button type="button" className={styles.button} onClick={onClick} aria-label={placeholder}>
      <span className={styles.icon} aria-hidden="true">⌕</span>
      <span>{placeholder}</span>
    </button>
  )

  return (
    <>
      {trigger}
      <Search open={open} onClose={() => setOpen(false)} lang={lang} />
    </>
  )
}
