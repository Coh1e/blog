import { useEffect, useState } from "react"
import styles from "./BackToTop.module.css"

interface Props {
  lang: "zh-CN" | "en"
}

/**
 * Floating button that scrolls to top. Appears once the page has scrolled
 * more than one viewport height. Mirrors Figma component "Back to Top"
 * (node 222:342) — 40×40 rounded square at fixed bottom-right, 24px margin.
 */
export function BackToTop({ lang }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let ticking = false
    const update = () => {
      ticking = false
      setVisible(window.scrollY > window.innerHeight)
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", update)
    }
  }, [])

  const label = lang === "zh-CN" ? "回到顶部" : "Back to top"
  return (
    <button
      type="button"
      className={`${styles.btn} ${visible ? styles.visible : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={label}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <span aria-hidden>↑</span>
    </button>
  )
}
