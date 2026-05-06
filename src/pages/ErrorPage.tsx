import { useRouteError } from "react-router-dom"
import styles from "./ErrorPage.module.css"

/**
 * Catches unhandled route-level errors (e.g. chunk load failures after a
 * deploy invalidates old hashed asset URLs). Shown by react-router via
 * `errorElement`; replaces the default dev-only error overlay.
 */
export function ErrorPage() {
  const err = useRouteError()
  const message =
    err instanceof Error
      ? err.message
      : typeof err === "object" && err !== null && "statusText" in err
        ? String((err as { statusText: unknown }).statusText)
        : String(err ?? "")
  const isCN = typeof navigator !== "undefined" && navigator.language?.startsWith("zh")
  const copy = isCN
    ? {
        title: "出错了",
        body: "页面资源加载失败。可能是网络中断，或站点刚刚更新使旧缓存失效。",
        retry: "刷新页面",
        home: "回到首页 →",
      }
    : {
        title: "Something went wrong",
        body: "Page resources failed to load. The network may have hiccuped, or a fresh deploy invalidated cached assets.",
        retry: "Reload",
        home: "Back to home →",
      }
  return (
    <main className={styles.root}>
      <h1 className={styles.title}>{copy.title}</h1>
      <p className={styles.body}>{copy.body}</p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.retry}
          onClick={() => {
            if (typeof window !== "undefined") window.location.reload()
          }}
        >
          {copy.retry}
        </button>
        <a href="/" className={styles.home}>
          {copy.home}
        </a>
      </div>
      {message && <pre className={styles.detail}>{message}</pre>}
    </main>
  )
}
