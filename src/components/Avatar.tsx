import { Link } from "react-router-dom"
import styles from "./Avatar.module.css"

interface Props {
  lang?: "zh-CN" | "en"
  href?: string
  size?: "hero" | "compact"
}

const COPY = {
  "zh-CN": {
    tagline: "记录想法，写慢一点。",
    aboutLabel: "关于我 →",
    aboutHref: "/about/",
  },
  en: {
    tagline: "Notes that grow slowly.",
    aboutLabel: "About me →",
    aboutHref: "/en/about/",
  },
} as const

/** Bio popover shown on hover for non-hero Avatar instances. Per Figma 168:160:
 *  bilingual wordmark + tag line + bilingual bio + link to /about. */
function BioPopover() {
  return (
    <div className={styles.popover} role="tooltip" aria-hidden="true">
      <p className={styles.popoverWordmark}>
        <span className={styles.popoverZh}>未经授权</span>
        <span className={styles.popoverSep}> · </span>
        <span className={styles.popoverEn}>Unauthorized</span>
      </p>
      <p className={styles.popoverTags}>Writing · Reading · Tools</p>
      <p className={styles.popoverBioCn}>长一点的想法和短一点的笔记，慢慢长在这里。</p>
      <p className={styles.popoverBioEn}>Long thoughts and short notes growing here, slowly.</p>
      <p className={styles.popoverLink}>→ About me / 关于我</p>
    </div>
  )
}

export function Avatar({ lang = "zh-CN", href, size = "hero" }: Props) {
  const copy = COPY[lang]
  const linkHref = href ?? copy.aboutHref
  return (
    <section className={`${styles.avatar} ${styles[size]}`}>
      <Link to={linkHref} className={styles.imageLink} aria-label={copy.aboutLabel}>
        <img
          src="/avatar.jpg"
          alt=""
          className={styles.image}
          width={size === "hero" ? 240 : 64}
          height={size === "hero" ? 240 : 64}
        />
        {size !== "hero" && <BioPopover />}
      </Link>
      {size === "hero" && (
        <>
          <p className={styles.tagline}>{copy.tagline}</p>
          <Link to={linkHref} className={styles.aboutLink}>
            {copy.aboutLabel}
          </Link>
        </>
      )}
    </section>
  )
}
