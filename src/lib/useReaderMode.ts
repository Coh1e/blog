import { useEffect, useState } from "react"

/**
 * Tracks the `html.reader-mode` class. Returns false during SSR and during the
 * brief gap between hydration and the first useEffect tick.
 *
 * Listens via MutationObserver so the value updates when ReaderToggle or
 * ReaderExitBar flips the class.
 */
export function useReaderMode(): boolean {
  const [isReader, setIsReader] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    const update = () => setIsReader(html.classList.contains("reader-mode"))
    update()
    const obs = new MutationObserver(update)
    obs.observe(html, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])

  return isReader
}
