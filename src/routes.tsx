import type { RouteRecord } from "vite-react-ssg"
import { App } from "./App"
import { HomePage } from "./pages/HomePage"
import { ArticlePage } from "./pages/ArticlePage"
import { ArchivePage } from "./pages/ArchivePage"
import { MapPage } from "./pages/MapPage"
import { TagPage } from "./pages/TagPage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { ErrorPage } from "./pages/ErrorPage"
import { PagePage } from "./pages/PagePage"
import { readAllEntries } from "./lib/content"

const allEntries = readAllEntries()

const articleRoutes: RouteRecord[] = allEntries.map((entry) => ({
  path: entry.slug,
  Component: () => <ArticlePage entry={entry} />,
}))

function uniqueTagsFor(lang: "zh-CN" | "en"): string[] {
  const set = new Set<string>()
  for (const e of allEntries) {
    if (e.lang !== lang) continue
    for (const t of e.tags) set.add(t)
  }
  return [...set]
}

const tagRoutes: RouteRecord[] = [
  ...uniqueTagsFor("zh-CN").map((tag) => ({
    path: `tags/${tag}`,
    Component: () => <TagPage locale="zh" tag={tag} />,
  })),
  ...uniqueTagsFor("en").map((tag) => ({
    path: `en/tags/${tag}`,
    Component: () => <TagPage locale="en" tag={tag} />,
  })),
]

const listRoutes: RouteRecord[] = [
  { path: "all", Component: () => <ArchivePage locale="zh" /> },
  { path: "map", Component: () => <MapPage locale="zh" /> },
  { path: "en/all", Component: () => <ArchivePage locale="en" /> },
  { path: "en/map", Component: () => <MapPage locale="en" /> },
  { path: "about", Component: () => <PagePage pageName="about" locale="zh" /> },
  { path: "now", Component: () => <PagePage pageName="now" locale="zh" /> },
  { path: "en/about", Component: () => <PagePage pageName="about" locale="en" /> },
  { path: "en/now", Component: () => <PagePage pageName="now" locale="en" /> },
]

export const routes: RouteRecord[] = [
  {
    path: "/",
    Component: App,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: () => <HomePage locale="zh" /> },
      { path: "en", Component: () => <HomePage locale="en" /> },
      ...listRoutes,
      ...tagRoutes,
      ...articleRoutes,
      // Static export emits dist/404/index.html. Static hosts (Cloudflare Pages,
      // Vercel) serve it for unknown URLs.
      { path: "404", Component: () => <NotFoundPage /> },
      // SPA-side fallback for client navigation to nonexistent routes.
      { path: "*", Component: () => <NotFoundPage /> },
    ],
  },
]
