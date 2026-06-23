import type { Metadata } from "next";
import { Code, DocBar, FinalCta, DocFooter } from "../../_shared/parts";

export const metadata: Metadata = {
  title: "Claude Code Skills 是什麼？技能標準化企業建置｜Readie",
  description:
    "Claude Code Skills 教學與企業建置：用 SKILL.md 把可重複的工作流程封裝成按需載入的技能、提交進 repo 全隊共用，省 context 又不綁人。含 SKILL.md 範例、scope 與和 CLAUDE.md/subagents 的分工。",
  keywords: [
    "Claude Code Skills",
    "SKILL.md",
    "Claude Code 技能",
    "Claude Code custom command",
    "agentskills",
    ".claude/skills",
    "Readie",
  ],
  alternates: { canonical: "https://readie.ai/guides/claude-code/skills" },
  openGraph: {
    type: "article",
    locale: "zh_TW",
    url: "https://readie.ai/guides/claude-code/skills",
    siteName: "Readie AI 導入顧問",
    title: "Claude Code Skills 是什麼？技能標準化企業建置",
    description: "把可重複的工作流程封裝成按需載入的技能、提交進 repo 全隊共用。",
  },
};

const SKILL_FILE = `---
name: deploy
description: 把目前專案部署到 Vercel 正式環境，含建置檢查與環境變數確認。
---

# 部署流程
1. 先跑 \`pnpm build\` 確認可建置
2. 確認 .env 對應的變數已在 Vercel 設好
3. 執行 \`vercel deploy --prod\`
4. 回報上線 URL 與本次變更摘要`;

const LOCATIONS = `# 專案層（進 git，全隊共用）— 最適合企業
.claude/skills/deploy/SKILL.md
#   打 /deploy 觸發，或 Claude 判斷相關時自動載入

# 個人層（你所有專案）
~/.claude/skills/<name>/SKILL.md

# 舊的 custom command 仍可用——它已併入 skills：
#   .claude/commands/deploy.md 和 skills/deploy/SKILL.md 都產生 /deploy`;

export default function SkillsPage() {
  return (
    <>
      <DocBar subpage />

      <section className="doc-hero">
        <div className="wrap">
          <div className="lane">
            <p className="kicker">佈建系列 · 技能標準化</p>
            <h1>Skills：把重複流程變成可共用技能</h1>
            <p className="lede">
              Skills 讓你把「每次都要貼的同一套步驟」封裝成一個檔案，Claude
              需要時才載入。和 CLAUDE.md 最大的差別是<strong>按需載入、平常不佔 context</strong>——長篇的流程說明放這裡幾乎零成本。提交進
              repo，就是全隊共用的標準動作。
            </p>
            <div className="doc-meta">
              <span>遵循 agentskills.io 開放標準</span>
              <span>custom command 已併入 skills</span>
            </div>
            <div className="doc-toc">
              <a href="#what">① 什麼是 Skills</a>
              <a href="#anatomy">② 一個 skill 長怎樣</a>
              <a href="#share">③ 企業共享</a>
            </div>
          </div>
        </div>
      </section>

      {/* ① what */}
      <section className="light doc" id="what">
        <svg className="grain" aria-hidden="true">
          <filter id="gk">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#gk)" />
        </svg>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 01</span>
              什麼是 Skills，何時用
            </h2>
            <p>
              當你一直把同一份清單、同一套多步驟流程貼進對話，或 CLAUDE.md 裡某段已經從「事實」長成「程序」時，就把它變成
              skill。三者的分工：
            </p>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>機制</th>
                    <th>放什麼</th>
                    <th>載入時機</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CLAUDE.md</td>
                    <td>每次都要知道的事實、規範</td>
                    <td>每次 session 全載入</td>
                  </tr>
                  <tr>
                    <td>Skills</td>
                    <td>可重複的多步驟流程／清單</td>
                    <td>按需——用到才載入，省 context</td>
                  </tr>
                  <tr>
                    <td>Subagents</td>
                    <td>需要獨立 context 的專業角色</td>
                    <td>委派時在自己的 context 跑</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ② anatomy */}
      <section className="doc dark" id="anatomy" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 02</span>
              一個 skill 長什麼樣
            </h2>
            <p>
              一個 skill 就是一個 <code>SKILL.md</code>：frontmatter 寫 name 與 description，下面的內文就是這個技能的步驟。Claude
              靠 description 判斷何時自動用它，你也可以打 <code>/deploy</code> 直接叫它。
            </p>
            <Code lang="markdown" code={SKILL_FILE} />
            <p>
              比起塞進 CLAUDE.md，這段流程<strong>平常完全不佔 context</strong>，需要部署時才載入——這正是它省成本的關鍵。
            </p>
          </div>
        </div>
      </section>

      {/* ③ share */}
      <section className="light doc" id="share">
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 03</span>
              企業共享：提交進 repo
            </h2>
            <p>
              和 subagents 一樣，把 skill 放進專案 <code>.claude/skills/</code> 並提交 git，全隊拉下來就有同一套標準動作（部署、巡檢、報表、發版）。
            </p>
            <Code lang="bash" code={LOCATIONS} />
            <div className="callout">
              <span className="tag">三層知識一起標準化</span>
              <p>
                <a href="/guides/claude-code/setup">CLAUDE.md</a>（守則）、Skills（流程）、
                <a href="/guides/claude-code/agents">Subagents</a>（角色）三者都進 repo，才是完整、不綁人的團隊知識層。
              </p>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
      <DocFooter />
    </>
  );
}
