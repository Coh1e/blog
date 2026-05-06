import { useEffect, useState, type MouseEvent } from "react"
import styles from "./ImageLightbox.module.css"

interface Props {
  src: string
  alt?: string
}

/**
 * Wraps a markdown image in a click-to-zoom button. Per Figma 186:188:
 *   hover → zoom-in cursor; click → fullscreen lightbox.
 * Mobile long-press is the native browser save sheet (no code).
 */
export function ImageLightbox({ src, alt = "" }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open])

  const onOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    // Only close when clicking the dim background, not the image itself.
    if (e.target === e.currentTarget) setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label={alt ? `open ${alt}` : "open image"}
      >
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </button>
      {open && (
        <div className={styles.overlay} onClick={onOverlayClick} role="dialog" aria-modal="true">
          <img src={src} alt={alt} className={styles.fullImage} />
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setOpen(false)}
            aria-label="close"
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}
