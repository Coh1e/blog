import { Link } from "react-router-dom"
import styles from "./Backlinks.module.css"

export interface Backlink {
  slug: string
  title: string
  context?: string
}

interface Props {
  backlinks: Backlink[]
  lang: "zh-CN" | "en"
}

export function Backlinks({ backlinks, lang }: Props) {
  const heading = lang === "zh-CN" ? "反向链接" : "Backlinks"
  return (
    <section className={styles.backlinks}>
      <h3 className={styles.heading}>{heading}</h3>
      {backlinks.length === 0 ? (
        <p className={styles.empty}>{lang === "zh-CN" ? "暂无" : "None yet"}</p>
      ) : (
        <ul className={styles.list}>
          {backlinks.map((b) => (
            <li key={b.slug} className={styles.item}>
              <Link to={`/${b.slug}/`} className={styles.title}>{b.title}</Link>
              {b.context && <p className={styles.context}>{b.context}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
