import { Link } from "react-router-dom"
import styles from "./RecentEssayRow.module.css"
import { formatDate } from "@/lib/content"

interface Props {
  date?: Date
  title: string
  href: string
  summary?: string
}

export function RecentEssayRow({ date, title, href, summary }: Props) {
  return (
    <li className={styles.row}>
      <span className={styles.date}>{formatDate(date)}</span>
      <span className={styles.body}>
        <Link to={href} className={styles.title}>{title}</Link>
        {summary && <span className={styles.summary}>{summary}</span>}
      </span>
    </li>
  )
}
