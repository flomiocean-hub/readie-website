import type { Metadata } from "next";
import { Code, DocBar, FinalCta, DocFooter } from "../../_shared/parts";

export const metadata: Metadata = {
  title: "建一支 AI Agent 團隊：Claude Code subagents 企業建置｜Readie",
  description:
    "企業版 Claude Code AI 團隊建置：用 subagents 把專業角色檔案化、提交進 repo 全隊共用，per-agent 工具最小權限與模型成本控制，含可直接抄的六角色團隊模板，以及實驗性 Agent Teams 的取捨。",
  keywords: [
    "Claude Code subagents",
    "Claude Code agent team",
    "Claude Code AI 團隊",
    ".claude/agents",
    "Claude Code 多代理",
    "AI agent 企業",
    "Readie",
  ],
  alternates: { canonical: "https://readie.ai/guides/claude-code/agents" },
  openGraph: {
    type: "article",
    locale: "zh_TW",
    url: "https://readie.ai/guides/claude-code/agents",
    siteName: "Readie AI 導入顧問",
    title: "建一支 AI Agent 團隊：Claude Code subagents 企業建置",
    description: "把專業角色檔案化、提交進 repo 全隊共用，工具最小權限、模型控成本。",
  },
};

const AGENT_FILE = `---
name: reviewer
description: 寫完功能後找他過一遍。專找正確性 bug、多租戶/RLS 隔離漏洞、安全問題與容錯缺口。只審查、不寫實作碼。
tools: Read, Grep, Glob, Bash
model: sonnet
---

你是除錯與程式碼審查員。檢視這次的 diff，專找：
- correctness bug 與沒處理的邊界情況
- RLS / 多租戶隔離漏洞、權限繞過
- 輸入驗證與容錯缺口

只挑錯與給建議，不要直接改實作碼。回報時每一項附上 file:line。`;

const COMMIT = `# 團隊定義放在專案內、提交進 git → 全隊拉下來就有同一套 AI team
mkdir -p .claude/agents
#   每個角色一個 .md（見上方範例），放進 .claude/agents/
git add .claude/agents && git commit -m "新增團隊 AI agents"

# 互動式建立 / 編輯 / 挑工具（最簡單）
/agents`;

const TEAMS_EXP = `// ~/.claude/settings.json — Agent Teams 是實驗功能，預設關閉
{
  "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" }
}`;

const TEAMS_USE = `# 開啟後，用自然語言請主代理開隊友（適合平行研究/審查）
請開三個隊友平行審查 PR #142：一個看安全、一個看效能、一個看測試覆蓋，
各自審完互相挑戰彼此的發現，最後彙整給我。`;

export default function AgentsPage() {
  return (
    <>
      <DocBar subpage />

      <section className="doc-hero">
        <div className="wrap">
          <div className="lane">
            <p className="kicker">佈建系列 · 05 AI Agent 團隊</p>
            <h1>建一支 AI Agent 團隊</h1>
            <p className="lede">
              讓 Claude Code 從「一個全能助理」變成「一支分工的 AI 團隊」：架構師出計畫、後端寫碼、審查員挑錯、驗證員跑起來。企業版的關鍵是
              <strong>把團隊檔案化、提交進 repo</strong>，全公司用同一套——角色、權限、成本都統一。
            </p>
            <div className="doc-meta">
              <span>主力：subagents（穩定、可進 git）</span>
              <span>進階：Agent Teams（實驗）</span>
            </div>
            <div className="doc-toc">
              <a href="#which">① 選對機制</a>
              <a href="#anatomy">② 一個 agent 長怎樣</a>
              <a href="#share">③ 提交進 repo</a>
              <a href="#template">④ 團隊模板</a>
              <a href="#teams">⑤ Agent Teams（實驗）</a>
            </div>
          </div>
        </div>
      </section>

      {/* ① which */}
      <section className="light doc" id="which">
        <svg className="grain" aria-hidden="true">
          <filter id="ga">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#ga)" />
        </svg>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 01</span>
              先選對機制：subagents vs Agent Teams
            </h2>
            <p>
              Claude Code 有兩種多代理做法。企業要的是<strong>檔案化、可共享、可控成本</strong>的那種——subagents。
            </p>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Subagents（建議）</th>
                    <th>Agent Teams</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>狀態</td>
                    <td>✅ 穩定正式功能</td>
                    <td>⚠️ 實驗，預設關閉</td>
                  </tr>
                  <tr>
                    <td>定義方式</td>
                    <td>.claude/agents/*.md（可進 git）</td>
                    <td>執行時口語生成，存 session</td>
                  </tr>
                  <tr>
                    <td>協作</td>
                    <td>各自做、結果回報主代理</td>
                    <td>隊友互相對話、共用任務清單</td>
                  </tr>
                  <tr>
                    <td>成本</td>
                    <td>低（摘要回來）</td>
                    <td>高（每隊友獨立 context）</td>
                  </tr>
                  <tr>
                    <td>企業共享</td>
                    <td>✅ 提交 repo / managed 強制</td>
                    <td>❌ 一 session 一團、不可跨 session</td>
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
              一個 agent 長什麼樣
            </h2>
            <p>
              一個 subagent 就是一個 Markdown 檔：YAML frontmatter 設定，下面的內文就是它的系統提示。Claude 靠
              <code>description</code> 自動判斷何時把任務交給它。
            </p>
            <Code lang="markdown" code={AGENT_FILE} />
            <ul className="bullets">
              <li>
                <strong>name / description</strong>（必填）：description 寫清楚「何時該找它」，自動委派才準。
              </li>
              <li>
                <strong>tools</strong>：限制可用工具＝最小權限。審查員只給 <code>Read, Grep, Glob, Bash</code>，碰不到
                Write/Edit，從根本上不會亂改碼。
              </li>
              <li>
                <strong>model</strong>：<code>opus</code> / <code>sonnet</code> / <code>haiku</code> /{" "}
                <code>inherit</code>——把便宜的雜務丟 haiku、難的架構交 opus，直接控成本。
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ③ share */}
      <section className="light doc" id="share">
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 03</span>
              把團隊提交進 repo（企業共享的關鍵）
            </h2>
            <p>
              個人把 agent 放 <code>~/.claude/agents/</code> 只有自己有。企業要的是<strong>全隊一致</strong>：放進專案的
              <code>.claude/agents/</code> 並提交 git，誰拉下 repo 都有同一支團隊，還能一起改進。
            </p>
            <Code lang="bash" code={COMMIT} />
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>放哪裡</th>
                    <th>範圍</th>
                    <th>企業用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>managed 設定目錄/agents/</td>
                    <td>組織強制</td>
                    <td>管理員統一佈署，優先序最高</td>
                  </tr>
                  <tr>
                    <td>.claude/agents/（專案）</td>
                    <td>整個 repo</td>
                    <td>✅ 進 git，全隊共用、共同改進</td>
                  </tr>
                  <tr>
                    <td>~/.claude/agents/（使用者）</td>
                    <td>你所有專案</td>
                    <td>個人慣用角色</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ④ template */}
      <section className="doc dark" id="template" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 04</span>
              一套可直接抄的團隊模板
            </h2>
            <p>
              這是一套實戰用的開發團隊分工：每個角色一個 <code>.claude/agents/*.md</code>，模型與工具依職責配置——危險的事交給只讀的角色，貴的模型只用在最需要的地方。
            </p>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>角色</th>
                    <th>模型</th>
                    <th>工具</th>
                    <th>職責</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>architect</td>
                    <td>opus</td>
                    <td>Read, Grep, Glob, Bash</td>
                    <td>拆需求、出可執行計畫，不寫碼</td>
                  </tr>
                  <tr>
                    <td>backend-builder</td>
                    <td>sonnet</td>
                    <td>Read, Write, Edit, Bash</td>
                    <td>把計畫變成可跑的程式碼</td>
                  </tr>
                  <tr>
                    <td>db-dev</td>
                    <td>sonnet</td>
                    <td>Read, Write, Edit, Bash</td>
                    <td>schema、RLS、查詢優化</td>
                  </tr>
                  <tr>
                    <td>integration</td>
                    <td>sonnet</td>
                    <td>Read, Write, Edit, Bash</td>
                    <td>webhook、第三方 API、自動化串接</td>
                  </tr>
                  <tr>
                    <td>reviewer</td>
                    <td>sonnet</td>
                    <td>Read, Grep, Glob, Bash</td>
                    <td>挑 bug、安全與隔離漏洞，只審不改</td>
                  </tr>
                  <tr>
                    <td>verifier</td>
                    <td>sonnet</td>
                    <td>Read, Grep, Glob, Bash</td>
                    <td>實際跑起來、驗證行為符合預期</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="callout">
              <span className="tag">設計原則</span>
              <p>
                <strong>寫的角色給寫的工具、查的角色只給讀</strong>（reviewer/verifier 不給 Write/Edit，杜絕亂改）；
                <strong>模型按難度配</strong>（架構用 opus、雜務用 haiku）。這就是「權限最小化＋成本最佳化」的團隊。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ⑤ agent teams */}
      <section className="light doc" id="teams">
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 05</span>
              進階：Agent Teams（實驗功能）
            </h2>
            <p>
              當任務適合<strong>平行探索＋互相挑戰</strong>（多角度審查、競爭假設除錯）時，可開實驗性的 Agent
              Teams：隊友各自獨立、彼此對話、共用任務清單。預設關閉，要先開環境變數。
            </p>
            <Code lang="json" code={TEAMS_EXP} />
            <Code lang="bash" code={TEAMS_USE} />
            <ul className="bullets">
              <li>
                <strong>成本明顯較高</strong>：每個隊友是獨立 Claude 實例，token 隨人數線性增加。建議 3–5 人。
              </li>
              <li>
                <strong>已知限制</strong>：一 session 只能一團、不可跨 session、不支援 resume 還原隊友、隊友不能再開隊友。
              </li>
              <li>
                <strong>定位</strong>：適合研究／審查的一次性平行作業；日常標準分工仍用上面的 subagents。
              </li>
            </ul>
            <div className="callout">
              <span className="tag">接回佈建</span>
              <p>
                團隊定義跟 <a href="/guides/claude-code/setup">核心佈建</a>的 <code>CLAUDE.md</code> 與{" "}
                <a href="/guides/claude-code/mcp">MCP</a> 一起標準化：守則、工具、團隊三者都進 repo，才是真正不綁人的 AI 戰力。
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
