import { Link } from "react-router-dom"
import { formatDate, formatDateShort } from "@/lib/content"
import { getBacklinks } from "@/lib/backlinks"
import { useReaderMode } from "@/lib/useReaderMode"
import type { Entry } from "@/lib/content"
import styles from "./ArchiveRow.module.css"

interface Props {
  entry: Entry
  /** Include the entry type as the first token in the meta line. */
  showType?: boolean
  /** "long" → YYYY/MM/DD; "short" → M/D (same year) or YYYY/M/D. */
  dateFormat?: "long" | "short"
  /** Append "↗ N" to the meta line when N > 0. */
  showBacklinkCount?: boolean
}

export function ArchiveRow({
  entry,
  showType = true,
  dateFormat = "long",
  showBacklinkCount = false,
}: Props) {
  const isReader = useReaderMode()
  // Reader mode prefers full dates (Figma 209:472 shows YYYY/MM/DD even on Map).
  const effectiveFormat = isReader ? "long" : dateFormat
  const dateStr = effectiveFormat === "short" ? formatDateShort(entry.date) : formatDate(entry.date)

  const tokens: string[] = []
  if (showType) tokens.push(entry.type)
  for (const t of entry.tags) tokens.push(t)
  if (entry.status) tokens.push(entry.status)
  if (showBacklinkCount) {
    const n = getBacklinks(entry.slug).length
    if (n > 0) tokens.push(`↗ ${n}`)
  }

  return (
    <li className={styles.row}>
      <div className={styles.line1}>
        <Link to={`/${entry.slug}/`} className={styles.title}>
          {entry.title}
        </Link>
        <span className={styles.date}>{dateStr}</span>
      </div>
      {tokens.length > 0 && !isReader && (
        <p className={styles.meta}>{tokens.join(" · ")}</p>
      )}
    </li>
  )
}
