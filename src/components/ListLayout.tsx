import type { ReactNode } from "react"
import { Toolbar } from "./Toolbar"
import { PageHead } from "./PageHead"
import styles from "./ListLayout.module.css"

interface Props {
  lang: "zh-CN" | "en"
  currentLocale: "zh" | "en"
  pageSlug?: string
  mirrorExists?: boolean
  title: string
  description?: string
  children: ReactNode
}

export function ListLayout({ lang, currentLocale, pageSlug, mirrorExists = true, title, description, children }: Props) {
  return (
    <>
      <PageHead title={title} description={description} lang={lang} pageSlug={pageSlug ?? ""} />
      <Toolbar lang={lang} currentLocale={currentLocale} pageSlug={pageSlug} mirrorExists={mirrorExists} />
      <div className={styles.row}>
        <main className={styles.column}>
          <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            {description && <p className={styles.description}>{description}</p>}
          </header>
          {children}
        </main>
      </div>
    </>
  )
}
