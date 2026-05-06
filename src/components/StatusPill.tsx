import styles from "./StatusPill.module.css"
import type { Status } from "@/lib/content"

const GLYPH: Record<Status, string> = {
  seedling: "○",
  growing: "◐",
  evergreen: "●",
  archived: "▣",
}

interface Props {
  status: Status
  /** When true, prepend the maturity glyph (○ ◐ ● ▣) before the label.
   *  Figma's Home Note row shows label only — leave this false. */
  showGlyph?: boolean
}

export function StatusPill({ status, showGlyph = false }: Props) {
  return (
    <span className={styles.pill}>
      {showGlyph && (
        <span className={styles.glyph} aria-hidden>{GLYPH[status]}</span>
      )}
      {status}
    </span>
  )
}
