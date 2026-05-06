import { Link } from "react-router-dom"
import { entryHref, type Entry } from "@/lib/content"
import styles from "./SeriesNav.module.css"

interface Props {
  series: string
  peers: Entry[]
  currentSlug: string
  lang: "zh-CN" | "en"
}

const COPY = {
  "zh-CN": { label: "系列", part: (n: number, total: number) => `第 ${n} / ${total} 篇` },
  en: { label: "Series", part: (n: number, total: number) => `Part ${n} of ${total}` },
}

export function SeriesNav({ series, peers, currentSlug, lang }: Props) {
  if (peers.length < 2) return null
  const copy = COPY[lang]
  const currentIdx = peers.findIndex((p) => p.slug === currentSlug)
  return (
    <aside className={styles.nav} aria-label={copy.label}>
      <p className={styles.label}>
        <span className={styles.kicker}>{copy.label}</span>
        <span className={styles.title}>{series}</span>
        <span className={styles.position}>
          {copy.part(currentIdx + 1, peers.length)}
        </span>
      </p>
      <ol className={styles.list}>
        {peers.map((peer, i) => {
          const isCurrent = peer.slug === currentSlug
          return (
            <li key={peer.slug} className={isCurrent ? styles.current : undefined}>
              <span className={styles.num}>{i + 1}.</span>{" "}
              {isCurrent ? (
                <span>{peer.title}</span>
              ) : (
                <Link to={entryHref(peer) + "/"}>{peer.title}</Link>
              )}
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
