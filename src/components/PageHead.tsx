import { Head } from "vite-react-ssg"

interface Props {
  title: string
  description?: string
  lang: "zh-CN" | "en"
  /** Slug without locale prefix; pass "" for the home page. */
  pageSlug: string
}

const SITE_NAME_BY_LANG = {
  "zh-CN": "未经授权 · Unauthorized",
  en: "Unauthorized · 未经授权",
}

export function PageHead({ title, description, lang, pageSlug }: Props) {
  const isHome = pageSlug === ""
  const siteName = SITE_NAME_BY_LANG[lang]
  const fullTitle = isHome ? siteName : `${title} — ${siteName}`
  const zhPath = isHome ? "/" : `/${pageSlug}/`
  const enPath = isHome ? "/en/" : `/en/${pageSlug}/`

  return (
    <Head htmlAttributes={{ lang }}>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="alternate" hrefLang="zh-CN" href={zhPath} />
      <link rel="alternate" hrefLang="en" href={enPath} />
      <link rel="alternate" hrefLang="x-default" href={zhPath} />
    </Head>
  )
}
