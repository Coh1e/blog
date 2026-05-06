#!/usr/bin/env node
/**
 * Bundle size budget check.
 *
 * Reads dist/assets/*.js, sums sizes, and compares per-chunk + total against
 * bundle-budget.json. Exits 1 on any overrun so the build fails loudly.
 *
 * Maintain budgets manually: when a real growth is justified, bump the maxKB
 * in bundle-budget.json with a note in the commit message.
 */
import { readdirSync, statSync, readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, "..")
const distAssets = join(repoRoot, "dist", "assets")
const budgetPath = join(repoRoot, "bundle-budget.json")

let budget
try {
  budget = JSON.parse(readFileSync(budgetPath, "utf8"))
} catch (err) {
  console.error(`[bundle-size] cannot read ${budgetPath}: ${err.message}`)
  process.exit(1)
}

let files
try {
  files = readdirSync(distAssets).filter((f) => f.endsWith(".js"))
} catch (err) {
  console.error(`[bundle-size] cannot list ${distAssets}: ${err.message}`)
  console.error("[bundle-size] hint: run `npm run build` first")
  process.exit(1)
}

const overruns = []
const matchedFiles = new Set()
const perChunkActual = new Map() // prefix → KB

for (const rule of budget.chunks) {
  const matched = files.filter((f) => f.startsWith(rule.prefix))
  if (matched.length === 0) {
    overruns.push({
      kind: "missing",
      prefix: rule.prefix,
      msg: `no file matched prefix "${rule.prefix}" — was the chunk renamed or removed?`,
    })
    continue
  }
  let totalKB = 0
  for (const f of matched) {
    matchedFiles.add(f)
    totalKB += statSync(join(distAssets, f)).size / 1024
  }
  perChunkActual.set(rule.prefix, totalKB)
  if (totalKB > rule.maxKB) {
    overruns.push({
      kind: "over",
      prefix: rule.prefix,
      actualKB: totalKB,
      maxKB: rule.maxKB,
      msg: `${rule.prefix}* is ${totalKB.toFixed(1)} KB, budget ${rule.maxKB} KB (over by ${(
        totalKB - rule.maxKB
      ).toFixed(1)} KB)`,
    })
  }
}

const totalKB = files.reduce((acc, f) => acc + statSync(join(distAssets, f)).size / 1024, 0)
if (budget.totalMaxKB && totalKB > budget.totalMaxKB) {
  overruns.push({
    kind: "total-over",
    actualKB: totalKB,
    maxKB: budget.totalMaxKB,
    msg: `total JS is ${totalKB.toFixed(1)} KB, budget ${budget.totalMaxKB} KB (over by ${(
      totalKB - budget.totalMaxKB
    ).toFixed(1)} KB)`,
  })
}

console.log("[bundle-size] per-chunk actual vs. budget:")
for (const rule of budget.chunks) {
  const actual = perChunkActual.get(rule.prefix)
  const status = actual === undefined ? "MISSING" : actual > rule.maxKB ? "OVER" : "ok"
  const actualStr = actual === undefined ? "  -  " : `${actual.toFixed(1).padStart(6)} KB`
  console.log(
    `  ${status.padEnd(7)} ${rule.prefix.padEnd(16)} ${actualStr} / ${String(rule.maxKB).padStart(4)} KB`,
  )
}
console.log(
  `[bundle-size] total: ${totalKB.toFixed(1)} KB / ${budget.totalMaxKB ?? "∞"} KB (${files.length} files)`,
)

if (overruns.length > 0) {
  console.error(`\n[bundle-size] ${overruns.length} overrun(s):`)
  for (const o of overruns) console.error(`  - ${o.msg}`)
  process.exit(1)
}

console.log("[bundle-size] all chunks within budget ✓")
