import { Link } from "react-router-dom"
import styles from "./TagPill.module.css"

export function TagPill({ tag, lang }: { tag: string; lang: "zh-CN" | "en" }) {
  const href = lang === "en" ? `/en/tags/${tag}/` : `/tags/${tag}/`
  return (
    <Link to={href} className={styles.pill}>
      #{tag}
    </Link>
  )
}
