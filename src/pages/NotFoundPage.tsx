import { useLocation, Link } from "react-router-dom"
import { Toolbar } from "@/components/Toolbar"
import { PageHead } from "@/components/PageHead"
import type { Lang } from "@/lib/content"
import styles from "./NotFoundPage.module.css"

interface Props {
  locale?: "zh" | "en"
}

const COPY = {
  zh: {
    bigNumber: "404",
    subhead: "页面没找到",
    body: "你想找的页面可能已经被修剪、改了 slug，或者从来没存在过。园里所有还活着的内容都在内容地图里。",
    links: [
      { label: "回首页", href: "/" },
      { label: "内容地图", href: "/map/" },
      { label: "全部条目", href: "/all/" },
    ],
  },
  en: {
    bigNumber: "404",
    subhead: "Page not found",
    body: "The page you're looking for may have been pruned, renamed, or never existed. Everything still in the garden is on the content map.",
    links: [
      { label: "Home", href: "/en/" },
      { label: "Content map", href: "/en/map/" },
      { label: "All entries", href: "/en/all/" },
    ],
  },
}

export function NotFoundPage({ locale: localeProp }: Props) {
  const { pathname } = useLocation()
  const locale: "zh" | "en" = localeProp ?? (pathname.startsWith("/en") ? "en" : "zh")
  const lang: Lang = locale === "en" ? "en" : "zh-CN"
  const copy = COPY[locale]

  return (
    <>
      <PageHead title={copy.bigNumber} description={copy.subhead} lang={lang} pageSlug="" />
      <Toolbar lang={lang} currentLocale={locale} pageSlug="" mirrorExists={false} />
      <div className={styles.row}>
        <div className={styles.hero}>
          <p className={styles.bigNumber}>{copy.bigNumber}</p>
          <h1 className={styles.subhead}>{copy.subhead}</h1>
          <p className={styles.body}>{copy.body}</p>
          <p className={styles.links}>
            {copy.links.map((link, i) => (
              <span key={link.href}>
                {i > 0 && <span className={styles.sep} aria-hidden> · </span>}
                <Link to={link.href} className={styles.link}>→ {link.label}</Link>
              </span>
            ))}
          </p>
        </div>
      </div>
    </>
  )
}
