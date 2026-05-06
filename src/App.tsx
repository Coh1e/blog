import { Outlet, useLocation } from "react-router-dom"
import { ReaderExitBar } from "./components/ReaderExitBar"
import { BackToTop } from "./components/BackToTop"
import "./styles/tokens.css"
import "./styles/global.css"
import styles from "./App.module.css"

export function App() {
  const { pathname } = useLocation()
  const lang: "zh-CN" | "en" = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "zh-CN"
  return (
    <div className={styles.frame}>
      <ReaderExitBar />
      <Outlet />
      <BackToTop lang={lang} />
    </div>
  )
}

export default App
