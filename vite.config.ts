import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"

// SSR build externalizes react/etc, so manualChunks for them is invalid in
// that pass. We only chunk-split for the client build.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssgOptions: {
    entry: "src/main.tsx",
    formatting: "none",
    dirStyle: "nested",
    crittersOptions: false,
  },
  ssr: {
    noExternal: ["react-markdown"],
  },
  build: isSsrBuild
    ? undefined
    : {
        rollupOptions: {
          output: {
            // Pull heavy article-only deps out of the main app bundle so
            // home / list / map / tag pages don't pay for them on first paint.
            manualChunks: {
              react: ["react", "react-dom", "react-router-dom"],
              markdown: [
                "react-markdown",
                "remark-gfm",
                "remark-math",
                "rehype-katex",
                "rehype-raw",
              ],
              katex: ["katex"],
            },
          },
        },
      },
}))
