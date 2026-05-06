import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, cleanup } from "@testing-library/react"

// Default mock state — each test resets fields as needed
const giscusState = {
  repo: "" as string,
  repoId: "",
  category: "Comments",
  categoryId: "",
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  themeBase: "noborder" as string,
  themeUrlLight: "" as string,
  themeUrlDark: "" as string,
  lang: "auto",
  loading: "lazy",
}

vi.mock("@/lib/site-config", () => ({
  get siteConfig() {
    return { giscus: giscusState }
  },
  isGiscusEnabled: () => Boolean(giscusState.repo && giscusState.repoId && giscusState.categoryId),
}))

beforeEach(() => {
  // Reset to disabled
  giscusState.repo = ""
  giscusState.repoId = ""
  giscusState.categoryId = ""
  giscusState.mapping = "pathname"
  giscusState.themeBase = "noborder"
  giscusState.themeUrlLight = ""
  giscusState.themeUrlDark = ""
  giscusState.lang = "auto"
  cleanup()
})

describe("<Comments />", () => {
  it("renders nothing when giscus is not configured", async () => {
    const { Comments } = await import("@/components/Comments")
    const { container } = render(<Comments pageId="posts/foo" lang="zh-CN" />)
    expect(container).toBeEmptyDOMElement()
  })

  it("renders heading + privacy note + giscus mount when enabled", async () => {
    giscusState.repo = "user/repo"
    giscusState.repoId = "R_abc"
    giscusState.categoryId = "DIC_xyz"
    const { Comments } = await import("@/components/Comments")
    const { container, getByRole, getByText } = render(
      <Comments pageId="posts/foo" lang="zh-CN" />,
    )
    expect(getByRole("heading", { level: 2, name: "评论" })).toBeInTheDocument()
    expect(getByText("评论审核后显示。不收邮箱，不存 IP。")).toBeInTheDocument()
    // After useEffect runs, the giscus script tag is appended into the mount div
    const script = container.querySelector("script[src='https://giscus.app/client.js']")
    expect(script).not.toBeNull()
    expect(script?.getAttribute("data-repo")).toBe("user/repo")
    expect(script?.getAttribute("data-repo-id")).toBe("R_abc")
    expect(script?.getAttribute("data-category-id")).toBe("DIC_xyz")
  })

  it("renders the English heading + privacy note when lang is 'en'", async () => {
    giscusState.repo = "user/repo"
    giscusState.repoId = "R_abc"
    giscusState.categoryId = "DIC_xyz"
    const { Comments } = await import("@/components/Comments")
    const { getByRole, getByText } = render(<Comments pageId="en/posts/foo" lang="en" />)
    expect(getByRole("heading", { level: 2, name: "Comments" })).toBeInTheDocument()
    expect(getByText("Comments are moderated. No email, no IP collection.")).toBeInTheDocument()
  })

  it("resolves data-lang to zh-CN when lang='zh-CN' and config lang is 'auto'", async () => {
    giscusState.repo = "user/repo"
    giscusState.repoId = "R_abc"
    giscusState.categoryId = "DIC_xyz"
    giscusState.lang = "auto"
    const { Comments } = await import("@/components/Comments")
    const { container } = render(<Comments pageId="posts/foo" lang="zh-CN" />)
    const script = container.querySelector("script[src='https://giscus.app/client.js']")
    expect(script?.getAttribute("data-lang")).toBe("zh-CN")
  })

  it("resolves data-lang to en when lang='en' and config lang is 'auto'", async () => {
    giscusState.repo = "user/repo"
    giscusState.repoId = "R_abc"
    giscusState.categoryId = "DIC_xyz"
    giscusState.lang = "auto"
    const { Comments } = await import("@/components/Comments")
    const { container } = render(<Comments pageId="en/posts/foo" lang="en" />)
    const script = container.querySelector("script[src='https://giscus.app/client.js']")
    expect(script?.getAttribute("data-lang")).toBe("en")
  })

  it("sets data-term to the pageId when mapping is 'specific'", async () => {
    giscusState.repo = "user/repo"
    giscusState.repoId = "R_abc"
    giscusState.categoryId = "DIC_xyz"
    giscusState.mapping = "specific"
    const { Comments } = await import("@/components/Comments")
    const { container } = render(<Comments pageId="posts/foo" lang="zh-CN" />)
    const script = container.querySelector("script[src='https://giscus.app/client.js']")
    expect(script?.getAttribute("data-term")).toBe("posts/foo")
  })

  it("does NOT set data-term when mapping is not 'specific'", async () => {
    giscusState.repo = "user/repo"
    giscusState.repoId = "R_abc"
    giscusState.categoryId = "DIC_xyz"
    giscusState.mapping = "pathname"
    const { Comments } = await import("@/components/Comments")
    const { container } = render(<Comments pageId="posts/foo" lang="zh-CN" />)
    const script = container.querySelector("script[src='https://giscus.app/client.js']")
    expect(script?.hasAttribute("data-term")).toBe(false)
  })

  it("noborder + light maps to data-theme='noborder_light'", async () => {
    giscusState.repo = "user/repo"
    giscusState.repoId = "R_abc"
    giscusState.categoryId = "DIC_xyz"
    giscusState.themeBase = "noborder"
    delete document.documentElement.dataset.theme // ensure no inherited state
    const { Comments } = await import("@/components/Comments")
    const { container } = render(<Comments pageId="posts/foo" lang="zh-CN" />)
    const script = container.querySelector("script[src='https://giscus.app/client.js']")
    expect(script?.getAttribute("data-theme")).toBe("noborder_light")
  })

  it("noborder + dark maps to data-theme='noborder_dark'", async () => {
    giscusState.repo = "user/repo"
    giscusState.repoId = "R_abc"
    giscusState.categoryId = "DIC_xyz"
    giscusState.themeBase = "noborder"
    document.documentElement.dataset.theme = "dark"
    try {
      const { Comments } = await import("@/components/Comments")
      const { container } = render(<Comments pageId="posts/foo" lang="zh-CN" />)
      const script = container.querySelector("script[src='https://giscus.app/client.js']")
      expect(script?.getAttribute("data-theme")).toBe("noborder_dark")
    } finally {
      delete document.documentElement.dataset.theme
    }
  })

  it("default + dark maps to data-theme='dark' (giscus boxed style)", async () => {
    giscusState.repo = "user/repo"
    giscusState.repoId = "R_abc"
    giscusState.categoryId = "DIC_xyz"
    giscusState.themeBase = "default"
    document.documentElement.dataset.theme = "dark"
    try {
      const { Comments } = await import("@/components/Comments")
      const { container } = render(<Comments pageId="posts/foo" lang="zh-CN" />)
      const script = container.querySelector("script[src='https://giscus.app/client.js']")
      expect(script?.getAttribute("data-theme")).toBe("dark")
    } finally {
      delete document.documentElement.dataset.theme
    }
  })

  it("custom + light uses themeUrlLight", async () => {
    giscusState.repo = "user/repo"
    giscusState.repoId = "R_abc"
    giscusState.categoryId = "DIC_xyz"
    giscusState.themeBase = "custom"
    giscusState.themeUrlLight = "https://example.com/giscus-light.css"
    giscusState.themeUrlDark = "https://example.com/giscus-dark.css"
    delete document.documentElement.dataset.theme
    const { Comments } = await import("@/components/Comments")
    const { container } = render(<Comments pageId="posts/foo" lang="zh-CN" />)
    const script = container.querySelector("script[src='https://giscus.app/client.js']")
    expect(script?.getAttribute("data-theme")).toBe("https://example.com/giscus-light.css")
  })

  it("custom + dark uses themeUrlDark", async () => {
    giscusState.repo = "user/repo"
    giscusState.repoId = "R_abc"
    giscusState.categoryId = "DIC_xyz"
    giscusState.themeBase = "custom"
    giscusState.themeUrlLight = "https://example.com/giscus-light.css"
    giscusState.themeUrlDark = "https://example.com/giscus-dark.css"
    document.documentElement.dataset.theme = "dark"
    try {
      const { Comments } = await import("@/components/Comments")
      const { container } = render(<Comments pageId="posts/foo" lang="zh-CN" />)
      const script = container.querySelector("script[src='https://giscus.app/client.js']")
      expect(script?.getAttribute("data-theme")).toBe("https://example.com/giscus-dark.css")
    } finally {
      delete document.documentElement.dataset.theme
    }
  })

  it("custom themeBase swaps the URL on data-theme mutation (light → dark)", async () => {
    giscusState.repo = "user/repo"
    giscusState.repoId = "R_abc"
    giscusState.categoryId = "DIC_xyz"
    giscusState.themeBase = "custom"
    giscusState.themeUrlLight = "https://example.com/giscus-light.css"
    giscusState.themeUrlDark = "https://example.com/giscus-dark.css"
    delete document.documentElement.dataset.theme
    const { Comments } = await import("@/components/Comments")
    const { container } = render(<Comments pageId="posts/foo" lang="zh-CN" />)

    const iframe = document.createElement("iframe")
    iframe.className = "giscus-frame"
    const postMessage = vi.fn()
    Object.defineProperty(iframe, "contentWindow", {
      value: { postMessage },
      configurable: true,
    })
    const mount = container.querySelector("div") as HTMLElement
    mount.appendChild(iframe)

    document.documentElement.dataset.theme = "dark"
    try {
      await new Promise((r) => setTimeout(r, 0))
      expect(postMessage).toHaveBeenCalledTimes(1)
      expect(postMessage.mock.calls[0][0]).toEqual({
        giscus: { setConfig: { theme: "https://example.com/giscus-dark.css" } },
      })
    } finally {
      delete document.documentElement.dataset.theme
    }
  })

  it("custom with empty URL falls back to noborder of matching mode", async () => {
    giscusState.repo = "user/repo"
    giscusState.repoId = "R_abc"
    giscusState.categoryId = "DIC_xyz"
    giscusState.themeBase = "custom"
    giscusState.themeUrlLight = "" // intentionally not configured
    giscusState.themeUrlDark = "https://example.com/giscus-dark.css"
    delete document.documentElement.dataset.theme
    const { Comments } = await import("@/components/Comments")
    const { container } = render(<Comments pageId="posts/foo" lang="zh-CN" />)
    const script = container.querySelector("script[src='https://giscus.app/client.js']")
    expect(script?.getAttribute("data-theme")).toBe("noborder_light")
  })

  it("posts theme update to giscus iframe when html[data-theme] mutates", async () => {
    giscusState.repo = "user/repo"
    giscusState.repoId = "R_abc"
    giscusState.categoryId = "DIC_xyz"
    document.documentElement.dataset.theme = "light"
    try {
      const { Comments } = await import("@/components/Comments")
      const { container } = render(<Comments pageId="posts/foo" lang="zh-CN" />)

      // Stand in for the iframe that giscus would normally inject after its
      // client.js loads. We never reach the network in tests, so we fabricate
      // it with the same selector + a postMessage spy.
      const iframe = document.createElement("iframe")
      iframe.className = "giscus-frame"
      const postMessage = vi.fn()
      Object.defineProperty(iframe, "contentWindow", {
        value: { postMessage },
        configurable: true,
      })
      const mount = container.querySelector("div") as HTMLElement
      mount.appendChild(iframe)

      // Toggle theme — observer should fire and postMessage with the new theme.
      document.documentElement.dataset.theme = "dark"
      // MutationObserver is asynchronous; wait a microtask + macrotask.
      await new Promise((r) => setTimeout(r, 0))

      expect(postMessage).toHaveBeenCalledTimes(1)
      const [payload, origin] = postMessage.mock.calls[0]
      // Default test setup uses themeBase="noborder", so the message carries
      // the noborder_dark variant. The custom-URL path is tested separately.
      expect(payload).toEqual({ giscus: { setConfig: { theme: "noborder_dark" } } })
      expect(origin).toBe("https://giscus.app")
    } finally {
      delete document.documentElement.dataset.theme
    }
  })
})
