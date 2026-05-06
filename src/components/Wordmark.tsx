import { Link } from "react-router-dom"
import styles from "./Wordmark.module.css"

export function Wordmark({ href = "/" }: { href?: string }) {
  return (
    <h1 className={styles.wordmark}>
      <Link to={href} className={styles.link}>
        <span className={styles.zh}>未经授权</span>
        <span className={styles.sep}> · </span>
        <span className={styles.en}>Unauthorized</span>
      </Link>
    </h1>
  )
}
