import { describe, it, expect } from "vitest"
import {
  byDateDesc,
  byStatusThenDate,
  formatDate,
  formatDateShort,
  entryHref,
  type Entry,
} from "@/lib/content"

function mkEntry(partial: Partial<Entry>): Entry {
  return {
    slug: "posts/test",
    lang: "zh-CN",
    type: "post",
    title: "Test",
    tags: [],
    body: "",
    filePath: "",
    ...partial,
  }
}

describe("entryHref", () => {
  it("prefixes the slug with /", () => {
    expect(entryHref(mkEntry({ slug: "posts/foo" }))).toBe("/posts/foo")
    expect(entryHref(mkEntry({ slug: "en/posts/foo" }))).toBe("/en/posts/foo")
  })
})

describe("formatDate", () => {
  it("formats a Date as YYYY/MM/DD with zero-padding", () => {
    expect(formatDate(new Date("2026-01-05T00:00:00Z"))).toBe("2026/01/05")
  })

  it("returns empty string for undefined", () => {
    expect(formatDate(undefined)).toBe("")
  })
})

describe("formatDateShort", () => {
  it("uses M/D when the year matches `now`", () => {
    const now = new Date("2026-05-06T00:00:00Z")
    expect(formatDateShort(new Date("2026-03-09T00:00:00Z"), now)).toBe("3/9")
  })

  it("uses YYYY/M/D when the year differs from `now`", () => {
    const now = new Date("2026-05-06T00:00:00Z")
    expect(formatDateShort(new Date("2024-12-01T00:00:00Z"), now)).toBe("2024/12/1")
  })

  it("returns empty string for undefined", () => {
    expect(formatDateShort(undefined)).toBe("")
  })
})

describe("byDateDesc", () => {
  it("sorts newer first", () => {
    const a = mkEntry({ slug: "a", date: new Date("2026-01-01") })
    const b = mkEntry({ slug: "b", date: new Date("2026-02-01") })
    const sorted = [a, b].sort(byDateDesc)
    expect(sorted.map((e) => e.slug)).toEqual(["b", "a"])
  })

  it("treats missing date as oldest (sinks to bottom)", () => {
    const a = mkEntry({ slug: "a", date: new Date("2026-01-01") })
    const b = mkEntry({ slug: "b" }) // no date
    const sorted = [b, a].sort(byDateDesc)
    expect(sorted.map((e) => e.slug)).toEqual(["a", "b"])
  })
})

describe("byStatusThenDate", () => {
  it("sorts by status order (evergreen → growing → seedling → archived) then date desc", () => {
    const a = mkEntry({ slug: "old-evergreen", status: "evergreen", date: new Date("2024-01-01") })
    const b = mkEntry({ slug: "new-seedling", status: "seedling", date: new Date("2026-04-01") })
    const c = mkEntry({ slug: "new-growing", status: "growing", date: new Date("2026-04-15") })
    const sorted = [b, a, c].sort(byStatusThenDate)
    expect(sorted.map((e) => e.slug)).toEqual(["old-evergreen", "new-growing", "new-seedling"])
  })

  it("uses growing as default when status is unset", () => {
    const a = mkEntry({ slug: "no-status", date: new Date("2026-04-15") })
    const b = mkEntry({ slug: "growing", status: "growing", date: new Date("2026-04-01") })
    const sorted = [b, a].sort(byStatusThenDate)
    // Same effective status, newer first
    expect(sorted[0].slug).toBe("no-status")
  })
})
