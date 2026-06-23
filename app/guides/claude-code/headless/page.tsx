import type { Metadata } from "next";
import { Code, DocBar, FinalCta, DocFooter } from "../../_shared/parts";

export const metadata: Metadata = {
  title: "Claude Code 無頭自動化：claude -p、CI、排程企業建置｜Readie",
  description:
    "讓 Claude Code 跑在排程與 CI：claude -p 無互動模式、--bare 可重現執行、--output-format json 追成本、CLAUDE_CODE_OAUTH_TOKEN 做 CI 授權，以及 Mac Mini crontab 與 GitHub Actions 自動化範例。",
  keywords: [
    "Claude Code headless",
    "claude -p",
    "Claude Code CI",
    "Claude Code GitHub Actions",
    "CLAUDE_CODE_OAUTH_TOKEN",
    "Claude Code 自動化 排程",
    "Readie",
  ],
  alternates: { canonical: "https://readie.ai/guides/claude-code/headless" },
  openGraph: {
    type: "article",
    locale: "zh_TW",
    url: "https://readie.ai/guides/claude-code/headless",
    siteName: "Readie AI 導入顧問",
    title: "Claude Code 無頭自動化：claude -p、CI、排程",
    description: "claude -p / --bare / CI 授權 / Mac Mini crontab / GitHub Actions。",
  },
};

const HEADLESS = `# 一次性執行、直接印出結果
claude -p "把 auth.py 的 bug 找出來並修好" --allowedTools "Read,Edit,Bash"

# CI / 腳本建議加 --bare：不載入本機 hooks/MCP/CLAUDE.md，每台機器結果一致
claude --bare -p "摘要這個檔案" --allowedTools "Read"

# 結構化輸出（JSON 內含 total_cost_usd，可直接追每次花費）
claude -p "Summarize this project" --output-format json | jq -r '.result'`;

const CI_AUTH = `# 無頭/CI 授權：本機產生一年期 OAuth token
claude setup-token

# 把 token 設成 CI secret，workflow 內讀環境變數即可（無需瀏覽器登入）
export CLAUDE_CODE_OAUTH_TOKEN="********"`;

const CRON = `# Mac Mini crontab：每天 09:00 自動產生昨日數據摘要
0 9 * * * cd ~/repo && \\
  claude --bare -p "讀取昨日資料，產生摘要寫進 report.md" \\
  --allowedTools "Read,Write,Bash" >> ~/logs/daily.log 2>&1`;

export default function HeadlessPage() {
  return (
    <>
      <DocBar subpage />

      <section className="doc-hero">
        <div className="wrap">
          <div className="lane">
            <p className="kicker">佈建系列 · 無頭自動化</p>
            <h1>讓 Claude Code 跑在排程與 CI</h1>
            <p className="lede">
              Claude Code 不只是互動工具——加上 <code>-p</code> 就能無互動執行，接進 cron 排程、CI
              流水線、PR 自動審查。對一台常開的 Mac Mini 來說，這是把它從「AI 助理」變成「自動化員工」的關鍵。
            </p>
            <div className="doc-meta">
              <span>對象：要把 AI 接進排程／CI 的人</span>
            </div>
            <div className="doc-toc">
              <a href="#print">① claude -p</a>
              <a href="#auth">② CI 授權</a>
              <a href="#cases">③ 排程與 CI 範例</a>
            </div>
          </div>
        </div>
      </section>

      {/* ① print */}
      <section className="light doc" id="print">
        <svg className="grain" aria-hidden="true">
          <filter id="gh2">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#gh2)" />
        </svg>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 01</span>
              無互動模式 claude -p
            </h2>
            <p>
              任何 <code>claude</code> 指令加上 <code>-p</code>（<code>--print</code>）就是無互動執行，讀
              stdin、輸出結果，像一般 CLI 工具一樣可以 pipe、重導向。CI 與腳本建議再加{" "}
              <code>--bare</code> 確保可重現。
            </p>
            <Code lang="bash" code={HEADLESS} />
            <div className="callout">
              <span className="tag">為什麼用 --bare</span>
              <p>
                <code>--bare</code> 會跳過自動載入 hooks / MCP / 技能 / CLAUDE.md，只吃你明確傳入的旗標——確保「同一條指令在每台機器結果一致」，這正是
                CI 要的。只用 <code>ANTHROPIC_API_KEY</code> 或 apiKeyHelper 授權。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ② auth */}
      <section className="doc dark" id="auth" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 02</span>
              CI / 排程的授權
            </h2>
            <p>
              排程與 CI 開不了瀏覽器，用 <code>claude setup-token</code> 產生一年期 token、設成 secret 即可。
            </p>
            <Code lang="bash" code={CI_AUTH} />
            <ul className="bullets">
              <li>
                <strong>GitHub Actions</strong>：Anthropic 提供官方 Action，可在 PR 上自動跑 Claude
                Code（審查、修錯、回覆）；授權同樣走 <code>CLAUDE_CODE_OAUTH_TOKEN</code> 或 API 金鑰 secret。
              </li>
              <li>
                <strong>GitLab CI</strong> 亦有官方整合；其餘平台用 <code>claude -p</code> + secret 自行包裝。
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ③ cases */}
      <section className="light doc" id="cases">
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 03</span>
              排程與 CI 範例
            </h2>
            <h3>Mac Mini crontab（你的常開主機）</h3>
            <p>把每天重複的整理、摘要、巡檢交給排程，人起床就有結果。</p>
            <Code lang="bash" code={CRON} />
            <ul className="bullets">
              <li>
                <strong>PR 自動審查</strong>：在 CI 把 diff pipe 給 <code>claude -p</code>，當專案專屬
                linter／reviewer。
              </li>
              <li>
                <strong>成本可追</strong>：<code>--output-format json</code> 的回傳含{" "}
                <code>total_cost_usd</code>，每次自動化花多少一目了然（見
                <a href="/guides/claude-code/cost">成本與用量</a>）。
              </li>
              <li>
                <strong>權限收緊</strong>：CI 用 <code>--permission-mode dontAsk</code> 或精確的{" "}
                <code>--allowedTools</code>，避免卡在權限提示。
              </li>
            </ul>
          </div>
        </div>
      </section>

      <FinalCta />
      <DocFooter />
    </>
  );
}
