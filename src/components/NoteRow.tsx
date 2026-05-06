import { Link } from "react-router-dom"
import { StatusPill } from "./StatusPill"
import styles from "./NoteRow.module.css"
import type { Status } from "@/lib/content"

interface Props {
  title: string
  href: string
  status?: Status
  summary?: string
}

export function NoteRow({ title, href, status, summary }: Props) {
  return (
    <li className={styles.row}>
      <Link to={href} className={styles.title}>{title}</Link>
      {status && <StatusPill status={status} />}
      {summary && <span className={styles.summary}>{summary}</span>}
    </li>
  )
}
