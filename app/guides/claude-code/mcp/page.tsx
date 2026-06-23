import type { Metadata } from "next";
import { Code, DocBar, FinalCta, DocFooter } from "../../_shared/parts";

export const metadata: Metadata = {
  title: "MCP 工具標準化：讓 Claude 真的能做事（企業版）｜Readie",
  description:
    "企業版 MCP 佈建：MCP 的三種 scope 怎麼選、金鑰治理（別寫死指令裡）、最小權限，以及 Firecrawl／Filesystem／Playwright／Google Workspace 等常用工具的正確安裝法。針對團隊環境。",
  keywords: [
    "Claude Code MCP",
    "claude mcp add",
    "MCP scope project",
    ".mcp.json",
    "Firecrawl MCP",
    "Playwright MCP",
    "Readie",
  ],
  alternates: { canonical: "https://readie.ai/guides/claude-code/mcp" },
  openGraph: {
    type: "article",
    locale: "zh_TW",
    url: "https://readie.ai/guides/claude-code/mcp",
    siteName: "Readie AI 導入顧問",
    title: "MCP 工具標準化：讓 Claude 真的能做事（企業版）",
    description: "scope 怎麼選、金鑰別寫死、最小權限，以及常用工具的正確安裝法。",
  },
};

const SCOPE = `# 三種 scope（決定誰看得到這個 MCP）：
claude mcp add --scope local   ...   # 只有你、只有這個專案（預設）
claude mcp add --scope project ...   # 寫進 <repo>/.mcp.json，跟著 git，全隊共用 ← 企業用這個
claude mcp add --scope user    ...   # 你的所有專案

# 管理
claude mcp list
claude mcp remove <name>`;

const SECRETS = `# ✗ 別這樣：金鑰寫死在指令裡，會進 shell history 與設定檔
claude mcp add firecrawl -- npx -y firecrawl-mcp --api-key sk-xxxx

# ✓ 用環境變數帶入，金鑰不落地
claude mcp add --scope project firecrawl \\
  -e FIRECRAWL_API_KEY=$FIRECRAWL_API_KEY -- npx -y firecrawl-mcp
#  $FIRECRAWL_API_KEY 由機器層環境 / secrets 提供，repo 裡看不到明碼`;

const TOOLS = `# 1) Firecrawl — 爬網、把文章餵給 Claude（免費額度 500 次/月）
claude mcp add --scope project firecrawl \\
  -e FIRECRAWL_API_KEY=$FIRECRAWL_API_KEY -- npx -y firecrawl-mcp

# 2) Filesystem — 存取專案以外的檔案（務必最小權限，別開整個家目錄）
claude mcp add --scope project filesystem \\
  -- npx -y @modelcontextprotocol/server-filesystem ~/Shared/inbox

# 3) Playwright — 瀏覽器自動化（登入、填表、截圖）
npx -y playwright install chromium
claude mcp add --scope project playwright -- npx -y @playwright/mcp@latest

# 4) Google Workspace — Gmail / Calendar / Drive / Sheets
#    需 OAuth 設定，建議用服務帳號 + 最小 scope，授權範圍逐項給`;

export default function McpPage() {
  return (
    <>
      <DocBar subpage />

      <section className="doc-hero">
        <div className="wrap">
          <div className="lane">
            <p className="kicker">佈建系列 · 03 MCP 工具</p>
            <h1>MCP 工具標準化：讓 Claude 真的能做事</h1>
            <p className="lede">
              MCP（Model Context Protocol）讓 Claude 從「只會改檔案」變成能爬網、操作瀏覽器、讀資料庫。工具選對只是一半，企業真正要管的是
              <strong>scope、金鑰、最小權限</strong>——這頁把治理一次講清楚。
            </p>
            <div className="doc-meta">
              <span>原則：別全裝、按需挑、最小權限、金鑰不落地</span>
            </div>
            <div className="doc-toc">
              <a href="#scope">① 三種 scope</a>
              <a href="#secrets">② 金鑰治理</a>
              <a href="#tools">③ 常用工具</a>
            </div>
          </div>
        </div>
      </section>

      {/* ① scope */}
      <section className="light doc" id="scope">
        <svg className="grain" aria-hidden="true">
          <filter id="gm">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#gm)" />
        </svg>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 01</span>
              三種 scope：企業用 project
            </h2>
            <p>
              個人教學通常都用預設（只有自己看得到）。企業要的是<strong>全隊共用同一套工具</strong>：用
              <code>--scope project</code> 把設定寫進 <code>.mcp.json</code> 跟著 repo 走，整隊拉下來就有。
            </p>
            <Code lang="bash" code={SCOPE} />
            <div className="callout">
              <span className="tag">提醒</span>
              <p>
                <code>.mcp.json</code> 進 git 後，<strong>裡面絕不能有明碼金鑰</strong>——金鑰一律走環境變數（見下一節）。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ② secrets */}
      <section className="doc dark" id="secrets" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 02</span>
              金鑰治理：別寫死在指令裡
            </h2>
            <p>
              流傳的安裝寫法常把 API 金鑰直接打進指令——它會進 shell history 與設定檔，等於外洩。用{" "}
              <code>-e</code> 帶環境變數，金鑰由機器層 / secrets 提供，repo 看不到明碼。
            </p>
            <Code lang="bash" code={SECRETS} />
          </div>
        </div>
      </section>

      {/* ③ tools */}
      <section className="light doc" id="tools">
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 03</span>
              常用工具的正確安裝法
            </h2>
            <p>
              「不要全裝、按需挑」——這句對。下面四個最常用，已改成 project scope ＋ 環境變數金鑰 ＋ 最小權限的寫法。
            </p>
            <Code lang="bash" code={TOOLS} />
            <ul className="bullets">
              <li>
                <strong>Filesystem 要最小權限</strong>：只授權真正需要的單一目錄（例：<code>~/Shared/inbox</code>），別把整個
                Desktop / Documents / Downloads 開給 AI。安裝後請<strong>實測參數</strong>，不同版本的目錄參數寫法可能不同。
              </li>
              <li>
                <strong>裝完要重啟</strong> Claude Code，新 MCP 才會載入。
              </li>
              <li>
                <strong>Google Workspace</strong> 的 OAuth 較繁瑣：用最小授權 scope、設定測試使用者，逐項給權限。
              </li>
            </ul>
            <div className="callout">
              <span className="tag">接回佈建</span>
              <p>
                MCP 屬團隊知識的一部分，跟 <a href="/guides/claude-code/setup">核心佈建</a>的{" "}
                <code>CLAUDE.md</code> 一起標準化：哪些工具、什麼 scope、金鑰怎麼管，全隊一份。
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
