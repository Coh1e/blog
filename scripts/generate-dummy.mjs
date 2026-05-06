/**
 * Generate ~1200 dummy markdown entries to stress-test the framework:
 *   - 500 CN-only (no EN mirror)
 *   - 500 EN-only (no CN mirror)
 *   - 100 bilingual pairs (200 files)
 *
 * Each entry has cross-links to other entries in the SAME language, building
 * a real knowledge graph. Tags, statuses, dates, and series are sampled.
 *
 * All generated files are written under content/_gen/ subdirs, so they're
 * easy to nuke (`rm -rf content/_gen-* content/en/_gen-*`).
 *
 * Run: `node scripts/generate-dummy.mjs`
 */
import { writeFile, mkdir, rm, readdir, unlink } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

async function wipeDummies() {
  const folders = [
    "posts","notes","pages",
    "en/posts","en/notes","en/pages",
  ].map((p) => path.join(CONTENT, p))
  let wiped = 0
  for (const dir of folders) {
    let entries
    try { entries = await readdir(dir) } catch { continue }
    for (const e of entries) {
      if (e.startsWith("dummy-") && e.endsWith(".md")) {
        await unlink(path.join(dir, e))
        wiped++
      }
    }
  }
  if (wiped) console.log(`[gen] wiped ${wiped} previously-generated dummy-*.md files`)
}

const here = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(here, "..")
const CONTENT = path.join(ROOT, "content")

// ───── config ──────────────────────────────────────────────────────────
const CN_ONLY = 500
const EN_ONLY = 500
const BILINGUAL = 100
const SEED = 42

// ───── deterministic RNG ──────────────────────────────────────────────
let _rng = SEED
function rand() {
  _rng = (_rng * 1664525 + 1013904223) >>> 0
  return _rng / 0x100000000
}
function pick(arr) { return arr[Math.floor(rand() * arr.length)] }
function pickN(arr, n) {
  const c = [...arr], out = []
  for (let i = 0; i < n && c.length; i++) out.push(c.splice(Math.floor(rand() * c.length), 1)[0])
  return out
}
function chance(p) { return rand() < p }
function range(a, b) { return Math.floor(rand() * (b - a + 1)) + a }

// ───── vocabularies ───────────────────────────────────────────────────
const CN_TOPICS = [
  "写作","阅读","笔记","工具","设计","排版","编程","学习","时间","空间","记忆",
  "失败","成功","习惯","纪律","工作","诚实","复杂","简单","本质","社交","孤独",
  "命名","文件","档案","目录","图书","字体","色彩","对比","节奏","草稿","改稿",
  "终稿","发布","分享","评论","反馈","误读","翻译","原文","字幕","听力","母语",
  "外语","口语","书面语","正式","非正式","邮件","私信","群聊","广播","声音",
  "图片","视频","动图","静态","动态","界面","交互","动效","加载","缓存","刷新",
  "保存","撤销","重做","拷贝","粘贴","哲学","历史","文化","数学","物理","音乐",
  "诗","小说","散文","戏剧","电影","游戏","旅行","城市","乡村","山","河",
  "海","天空","早晨","深夜","季节","早春","盛夏","秋意","冬日","选择",
  "拒绝","等待","遗忘","想念","重读","抄写","誊抄","印刷","油墨","纸张",
  "皮肤","触感","重量","厚度","冷暖","声调","平仄","押韵","对仗","隐喻",
  "省略","沉默","空白","边界","结构","逻辑","直觉","共鸣","误解","距离"
]
const CN_VERBS = ["关于","重读","重写","拒绝","选择","为什么","如何","几种","三个","五个","两种","对比","反对","支持","重新理解"]
const CN_TITLE_TEMPLATES = [
  (t) => `关于${t}的笔记`,
  (t,t2) => `${t}与${t2}`,
  (t) => `重读${t}`,
  (t) => `为什么${t}重要`,
  (t) => `${t}不是${pick(CN_TOPICS)}`,
  (t) => `${t}的代价`,
  (t) => `${t}的成本`,
  (t,t2) => `从${t}到${t2}`,
  (t) => `${t}的几个细节`,
  (t) => `${range(2,7)}种关于${t}的想法`,
  (t) => `${t}：一份草稿`,
  (t) => `${t}还是${pick(CN_TOPICS)}`,
  (t) => `重新理解${t}`,
  (t) => `${t}里面藏着什么`,
  (t) => `${t}的反面`,
  (t) => `${t}与日常`,
  (t) => `早晨的${t}`,
  (t) => `深夜的${t}`,
  (t) => `${t}的边界`,
  (t) => `没有${t}的世界`,
  (t) => `${pick(CN_VERBS)}${t}`,
]

const EN_TOPICS = [
  "writing","reading","notes","tools","design","typography","programming","learning",
  "time","space","memory","failure","success","habit","discipline","work","honesty",
  "complexity","simplicity","essence","social","solitude","naming","files","archives",
  "indexes","books","fonts","color","contrast","rhythm","drafts","revisions","finals",
  "publishing","sharing","feedback","misreading","translation","originals","captions",
  "listening","mother-tongue","second-languages","speech","writing-style","formality",
  "email","messaging","groups","broadcast","sound","images","video","animation",
  "static","dynamic","interface","interaction","loading","caches","refreshing",
  "saving","undo","redo","copying","pasting","philosophy","history","culture",
  "mathematics","physics","music","poetry","fiction","essay","theatre","cinema",
  "games","travel","cities","countryside","mountains","rivers","seas","sky",
  "morning","midnight","seasons","early-spring","summer","autumn","winter",
  "choice","refusal","waiting","forgetting","longing","rereading","copying-out",
  "transcription","print","ink","paper","skin","touch","weight","thickness",
  "warmth","tone","meter","rhyme","parallelism","metaphor","ellipsis","silence",
  "blank","boundary","structure","logic","intuition","resonance","misunderstanding","distance",
]
const EN_VERBS = ["on","rereading","rewriting","refusing","choosing","why","how","kinds-of","three","five","two","comparing","against","for","rethinking"]
const EN_TITLE_TEMPLATES = [
  (t) => `Notes on ${t}`,
  (t,t2) => `${t} and ${t2}`,
  (t) => `Rereading ${t}`,
  (t) => `Why ${t} matters`,
  (t) => `${t} is not ${pick(EN_TOPICS)}`,
  (t) => `The cost of ${t}`,
  (t) => `On the cost of ${t}`,
  (t,t2) => `From ${t} to ${t2}`,
  (t) => `${t}: a few details`,
  (t) => `${range(2,7)} ideas about ${t}`,
  (t) => `${t}: a draft`,
  (t) => `${t} or ${pick(EN_TOPICS)}`,
  (t) => `Rethinking ${t}`,
  (t) => `What's inside ${t}`,
  (t) => `The other side of ${t}`,
  (t) => `${t} and the everyday`,
  (t) => `Morning ${t}`,
  (t) => `Late-night ${t}`,
  (t) => `The edges of ${t}`,
  (t) => `A world without ${t}`,
  (t) => `On ${t}`,
]

const TAG_POOL_CN = [
  "writing","meta","reading","tools","design","programming","work","tech",
  "knowledge","markdown","tools","web","infrastructure","learning","workflow",
  "排版","写作","阅读","笔记","工具","设计","哲学","历史","文化","音乐","旅行",
  "城市","乡村","食物","天气","季节","记忆","对话","实验","失败","习惯",
]
const TAG_POOL_EN = [
  "writing","meta","reading","tools","design","programming","work","tech",
  "knowledge","markdown","web","infrastructure","learning","workflow","books",
  "music","film","travel","cities","countryside","food","weather","seasons",
  "memory","conversations","experiments","failure","habits","systems",
]

const STATUSES = ["seedling","growing","evergreen","archived"]
const STATUS_WEIGHTS = [0.25, 0.4, 0.3, 0.05] // less likely to archive

const TYPES = [
  { type: "post",    weight: 0.40 },
  { type: "note",    weight: 0.57 },
  { type: "page",    weight: 0.03 },
]

// Series definitions — some entries belong to series of length 3-7.
const CN_SERIES = ["论笔记的结构","重读的练习","写作的礼仪","边界与省略","工具的脾气","时间的几何","早晨的事","深夜的事"]
const EN_SERIES = ["On the shape of notes","The rereading practice","Etiquette of writing","Boundaries and ellipsis","The tempers of tools","Geometries of time","Morning things","Late-night things"]

// ───── slug + title generation ────────────────────────────────────────
function slugifyEn(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60)
}
function genSlugEn(idx) {
  // English-style slug. We use English vocab even for CN entries to keep URLs clean.
  // Prefix every generated slug with "dummy-" so they're trivially separated
  // from hand-written entries (and `rm content/posts/dummy-*.md` cleans them up).
  const a = pick(EN_TOPICS), b = pick(EN_VERBS), c = pick(EN_TOPICS)
  const variants = [
    `${b}-${a}`,
    `${a}-${b}`,
    `${a}-and-${c}`,
    `notes-on-${a}`,
    `the-cost-of-${a}`,
    `from-${a}-to-${c}`,
    `rereading-${a}`,
    `${range(2, 9)}-${a}-${pick(["ideas","sketches","fragments","notes"])}`,
  ]
  return slugifyEn(`dummy-${pick(variants)}-${idx}`)
}

function pickType() {
  const r = rand()
  let acc = 0
  for (const t of TYPES) { acc += t.weight; if (r < acc) return t.type }
  return "note"
}
function pickStatus() {
  const r = rand()
  let acc = 0
  for (let i = 0; i < STATUSES.length; i++) {
    acc += STATUS_WEIGHTS[i]
    if (r < acc) return STATUSES[i]
  }
  return "growing"
}
function pickDate() {
  // Spread dates across 2022-01-01 .. 2026-05-05
  const start = new Date("2022-01-01").getTime()
  const end = new Date("2026-05-05").getTime()
  const t = start + rand() * (end - start)
  const d = new Date(t)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

// ───── body generation ────────────────────────────────────────────────
const CN_OPENERS = [
  "关于这个，我有一些零散的想法。",
  "这是一段还没想清楚的笔记。",
  "我反复回到这个主题。",
  "下面是我现在的理解，可能会变。",
  "想了很久，写下来。",
  "这是一个让我每过几个月就回看一次的问题。",
  "前几天和朋友讨论这个，记下来。",
]
const CN_FILLERS = [
  "我以前以为这是一个简单的问题，后来发现它不是。",
  "Paul Graham 在某篇文章里说过类似的话——大意是当我们觉得一件事简单时，我们其实在偷懒。",
  "中文和英文在这件事上的处理方式不太一样。",
  "工具决定了一部分输出的质量，剩下的部分由耐心决定。",
  "三个人讨论同一件事的速度，是一个人独自想的十倍。",
  "我把它放下，等了一周再看。判断变得清晰了。",
  "重读旧笔记时常会发现：我以为是新想法的，五年前就写过了。",
  "省略的部分有时候比说出来的部分更重要。",
  "结构先于内容。",
  "复杂性可以被压缩，但不能被消除。",
]
const EN_OPENERS = [
  "I have a few scattered thoughts about this.",
  "This is a note I haven't fully thought through.",
  "I keep coming back to this topic.",
  "Below is my current understanding — likely to change.",
  "Thinking about this for a while, writing it down.",
  "A problem I revisit every few months.",
  "Discussed this with a friend recently. Capturing it.",
]
const EN_FILLERS = [
  "I used to think this was a simple question, then I found out it isn't.",
  "Paul Graham said something similar — when we think something is simple, we're being lazy.",
  "Chinese and English handle this differently.",
  "Tools determine a portion of output quality; the rest is patience.",
  "Three people thinking together is ten times faster than one person alone.",
  "I put it down for a week. The judgment became clearer.",
  "Rereading old notes: I often find that what I thought was new, I'd already written five years ago.",
  "What you leave out can matter more than what you say.",
  "Structure precedes content.",
  "Complexity can be compressed, not eliminated.",
]
const CN_CALLOUTS = [
  ["note","值得记一笔"],
  ["tip","一个实用的小技巧"],
  ["warning","注意这里的边界"],
  ["abstract","核心要点"],
  ["quote","写得真好"],
  ["question","我还没想明白"],
]
const EN_CALLOUTS = [
  ["note","Worth jotting down"],
  ["tip","A small practical tip"],
  ["warning","Mind the edge case here"],
  ["abstract","Core takeaway"],
  ["quote","Lovely line"],
  ["question","Still puzzling over this"],
]

function makeBody(lang, slug, otherSlugs) {
  const isCn = lang === "zh-CN"
  const openers = isCn ? CN_OPENERS : EN_OPENERS
  const fillers = isCn ? CN_FILLERS : EN_FILLERS
  const callouts = isCn ? CN_CALLOUTS : EN_CALLOUTS

  const sectionCount = range(1, 4)
  const sections = []
  sections.push(pick(openers))
  sections.push("")
  // 0-2 wikilinks in opening section
  const links = pickN(otherSlugs, range(2, 5))

  for (let i = 0; i < sectionCount; i++) {
    if (i > 0) {
      sections.push("")
      sections.push(`## ${isCn ? pick(["背景","理由","反例","边界","延伸"]) : pick(["Background","Why","Counter","Edges","Further"])}`)
      sections.push("")
    }
    // 1-3 fillers
    const fillerCount = range(1, 3)
    for (let j = 0; j < fillerCount; j++) {
      sections.push(pick(fillers))
    }
    // sometimes inject a wikilink line
    if (links.length && chance(0.6)) {
      const target = links.shift()
      sections.push("")
      sections.push(isCn
        ? `这一点和 [[${target}]] 那一篇相关。`
        : `This connects to [[${target}]].`)
    }
  }

  // sometimes a callout
  if (chance(0.35)) {
    const [type, body] = pick(callouts)
    sections.push("")
    sections.push(`> [!${type}]`)
    sections.push(`> ${body}`)
  }

  // sometimes a list
  if (chance(0.25)) {
    sections.push("")
    sections.push(isCn ? "几个要点：" : "Several points:")
    sections.push("")
    const n = range(2, 4)
    for (let i = 0; i < n; i++) {
      sections.push(`- ${pick(fillers)}`)
    }
  }

  // sometimes a footnote
  if (chance(0.15)) {
    const fnId = `fn${range(1, 99)}`
    sections.push("")
    sections.push(isCn
      ? `更深的讨论参见脚注[^${fnId}]。`
      : `See the footnote for more[^${fnId}].`)
    sections.push("")
    sections.push(`[^${fnId}]: ${pick(fillers)}`)
  }

  // dump the rest of the wikilinks at the end if any
  if (links.length) {
    sections.push("")
    sections.push(isCn ? "## 相关" : "## Related")
    sections.push("")
    for (const t of links) sections.push(`- [[${t}]]`)
  }

  return sections.join("\n")
}

function makeFrontmatter({ title, date, type, lang, tags, status, summary, series }) {
  const lines = ["---", `title: ${escapeYaml(title)}`, `date: ${date}`, `type: ${type}`, `lang: ${lang}`]
  if (tags?.length) lines.push(`tags: [${tags.map(escapeYamlInline).join(", ")}]`)
  if (status && type === "note") lines.push(`status: ${status}`)
  if (summary) lines.push(`summary: ${escapeYaml(summary)}`)
  if (series) lines.push(`series: ${escapeYaml(series)}`)
  lines.push("---", "")
  return lines.join("\n")
}
function escapeYaml(s) {
  if (typeof s !== "string") return JSON.stringify(s)
  if (/[:#\n]/.test(s) || s.includes('"') || s.startsWith(" ") || s.endsWith(" ")) {
    return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
  }
  return s
}
function escapeYamlInline(s) {
  if (/[\s,\[\]]/.test(s)) return `"${s.replace(/"/g, '\\"')}"`
  return s
}

// ───── plan + emit ────────────────────────────────────────────────────
async function main() {
  // Wipe ONLY previously-generated dummy-* files (preserves hand-written content).
  await wipeDummies()

  // Plan all entries first so we can generate cross-links
  const cnEntries = []  // { slug, type, ... }
  const enEntries = []
  const usedSlugs = new Set()

  function plan(idx, lang) {
    let slug
    let attempts = 0
    do {
      slug = genSlugEn(idx + attempts * 10000)
      attempts++
    } while (usedSlugs.has(slug) && attempts < 50)
    usedSlugs.add(slug)
    const type = pickType()
    const folder = type === "post" ? "posts"
                 : type === "note" ? "notes"
                 : "pages"
    return {
      lang,
      type,
      folder,
      bareSlug: `${folder}/${slug}`,        // used in wikilink resolution (CN form)
      fullSlug: lang === "en" ? `en/${folder}/${slug}` : `${folder}/${slug}`,
    }
  }

  let idx = 0
  for (let i = 0; i < CN_ONLY; i++) cnEntries.push(plan(idx++, "zh-CN"))
  for (let i = 0; i < EN_ONLY; i++) enEntries.push(plan(idx++, "en"))
  for (let i = 0; i < BILINGUAL; i++) {
    const cn = plan(idx++, "zh-CN")
    // EN mirror reuses the SAME bare slug, just with en/ prefix
    const en = {
      lang: "en", type: cn.type, folder: cn.folder,
      bareSlug: cn.bareSlug,
      fullSlug: `en/${cn.bareSlug}`,
    }
    cnEntries.push(cn)
    enEntries.push(en)
  }

  // Series assignment: pick ~20 series, assign 3-7 consecutive entries to each
  function assignSeries(entries, seriesNames) {
    const out = entries.map(() => null)
    let i = 0
    for (const s of seriesNames) {
      const len = range(3, 7)
      for (let j = 0; j < len && i < out.length; j++, i++) {
        if (entries[i].type === "post" || entries[i].type === "note") out[i] = s
      }
      // skip a chunk between series
      i += range(8, 30)
      if (i >= out.length) break
    }
    return out
  }
  const cnSeriesAssign = assignSeries(cnEntries, CN_SERIES)
  const enSeriesAssign = assignSeries(enEntries, EN_SERIES)

  // For each entry, generate content
  async function emit(entries, seriesAssign, langOpts) {
    const { langCode, titleTemplates, tagPool, topics, summaryFiller } = langOpts
    const allBareSlugs = entries.map((e) => e.bareSlug)
    let written = 0
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i]
      const t1 = pick(topics)
      const t2 = pick(topics)
      const tmpl = pick(titleTemplates)
      const title = tmpl(t1, t2)
      const date = pickDate()
      const tags = pickN(tagPool, range(1, 4))
      const status = e.type === "note" ? pickStatus() : undefined
      const summary = pick(summaryFiller).slice(0, 60)
      const series = seriesAssign[i] || undefined

      // wikilinks should target same-lang entries
      const otherSlugs = []
      const mySlug = e.fullSlug
      for (let k = 0; k < 8 && otherSlugs.length < 6; k++) {
        const t = pick(entries).fullSlug
        if (t !== mySlug && !otherSlugs.includes(t)) otherSlugs.push(t)
      }

      const fm = makeFrontmatter({ title, date, type: e.type, lang: langCode, tags, status, summary, series })
      const body = makeBody(langCode, mySlug, otherSlugs)
      const filePath = e.lang === "en"
        ? path.join(CONTENT, "en", e.folder, path.basename(e.bareSlug) + ".md")
        : path.join(CONTENT, e.folder, path.basename(e.bareSlug) + ".md")
      await mkdir(path.dirname(filePath), { recursive: true })
      await writeFile(filePath, fm + body, "utf8")
      written++
    }
    return written
  }

  const cnSummaryFiller = ["关于这个的零散想法","一篇还没想清楚的笔记","重新理解一个旧主题","几个要点","回到这个问题"]
  const enSummaryFiller = ["scattered thoughts on this","an unfinished thought","rethinking an old theme","several points","returning to this question"]

  const cnCount = await emit(cnEntries, cnSeriesAssign, {
    langCode: "zh-CN",
    titleTemplates: CN_TITLE_TEMPLATES,
    tagPool: TAG_POOL_CN,
    topics: CN_TOPICS,
    summaryFiller: cnSummaryFiller,
  })
  console.log(`[gen] wrote ${cnCount} CN entries`)

  const enCount = await emit(enEntries, enSeriesAssign, {
    langCode: "en",
    titleTemplates: EN_TITLE_TEMPLATES,
    tagPool: TAG_POOL_EN,
    topics: EN_TOPICS,
    summaryFiller: enSummaryFiller,
  })
  console.log(`[gen] wrote ${enCount} EN entries`)
  console.log(`[gen] total ${cnCount + enCount} files`)
  console.log(`[gen] CN-only ≈ ${CN_ONLY}; EN-only ≈ ${EN_ONLY}; bilingual pairs = ${BILINGUAL}`)
}

main().catch((err) => { console.error(err); process.exit(1) })
