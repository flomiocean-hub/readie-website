import type { Metadata } from "next";
import { Code, DocBar, FinalCta, DocFooter } from "../../_shared/parts";

export const metadata: Metadata = {
  title: "Claude Code 成本與用量管理：團隊治理與監控｜Readie",
  description:
    "Claude Code 成本控制與用量監控企業指南：用 /usage 看花費、模型選擇與 context 管理降成本、workspace 花費上限與 per-user rate limit 建議、OpenTelemetry 把用量匯到儀表板。",
  keywords: [
    "Claude Code 成本",
    "Claude Code 用量",
    "/usage",
    "Claude Code OpenTelemetry",
    "Claude Code rate limit",
    "Claude Code 企業 預算",
    "Readie",
  ],
  alternates: { canonical: "https://readie.ai/guides/claude-code/cost" },
  openGraph: {
    type: "article",
    locale: "zh_TW",
    url: "https://readie.ai/guides/claude-code/cost",
    siteName: "Readie AI 導入顧問",
    title: "Claude Code 成本與用量管理：團隊治理與監控",
    description: "看花費、降成本、設花費上限與 rate limit、用 OpenTelemetry 監控。",
  },
};

const USAGE = `/usage     # 看 session 用量與配額 breakdown（按 d/w 切 24h / 7 天）
/context   # 看目前 context 被什麼佔用（找肥的來源）
/model     # 切模型：Sonnet 日常、Opus 難題、Haiku 雜務`;

const TELEMETRY = `{
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp",
    "OTEL_EXPORTER_OTLP_ENDPOINT": "http://你的collector:4317"
  }
}`;

export default function CostPage() {
  return (
    <>
      <DocBar subpage />

      <section className="doc-hero">
        <div className="wrap">
          <div className="lane">
            <p className="kicker">佈建系列 · 成本與用量</p>
            <h1>成本與用量管理</h1>
            <p className="lede">
              Claude Code 按 token 計費。企業導入前最該先回答的問題是「一個月會花多少、怎麼控、怎麼看」。參考值：企業部署平均
              <strong>約每位開發者每活躍日 13 美元、每月 150–250 美元</strong>。這頁講怎麼看、怎麼降、怎麼管。
            </p>
            <div className="doc-meta">
              <span>對象：要管 AI 預算的決策者／IT</span>
            </div>
            <div className="doc-toc">
              <a href="#track">① 看用量</a>
              <a href="#reduce">② 降成本</a>
              <a href="#team">③ 團隊治理</a>
            </div>
          </div>
        </div>
      </section>

      {/* ① track */}
      <section className="light doc" id="track">
        <svg className="grain" aria-hidden="true">
          <filter id="gc">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#gc)" />
        </svg>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 01</span>
              先看得到：用量指令
            </h2>
            <p>
              用 <code>/usage</code> 看本機 session 的 token 與配額分布，還會把用量歸因到 skills、subagents、MCP
              等各來源。權威帳單以 Claude Console 的 Usage 頁為準。
            </p>
            <Code lang="bash" code={USAGE} />
          </div>
        </div>
      </section>

      {/* ② reduce */}
      <section className="doc dark" id="reduce" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 02</span>
              降成本的做法
            </h2>
            <p>成本隨 context 大小走。把 context 維持精簡，是最直接的省錢手段。</p>
            <ul className="bullets">
              <li>
                <strong>選對模型</strong>：Sonnet 處理多數任務、成本低於 Opus；難的架構才用 Opus；subagent
                雜務指定 <code>model: haiku</code>。
              </li>
              <li>
                <strong>勤用 /clear</strong>：切換不相關工作時清空，舊 context 會在每則訊息持續燒 token。
              </li>
              <li>
                <strong>用 plan mode</strong>：複雜任務先規劃再動手，避免走錯方向的昂貴重工。
              </li>
              <li>
                <strong>流程移到 <a href="/guides/claude-code/skills">Skills</a></strong>：CLAUDE.md
                每次全載入，把長流程改成按需載入的 skill 可顯著縮小基礎 context（CLAUDE.md 控制在 200 行內）。
              </li>
              <li>
                <strong>用 <a href="/guides/claude-code/safety">Hooks</a> 先過濾</strong>：例如把
                10000 行 log 先 grep 成幾百行再給 AI。
              </li>
              <li>
                <strong>verbose 操作丟 subagent</strong>：跑測試、抓文件的大量輸出留在子代理 context，主對話只收摘要。
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ③ team */}
      <section className="light doc" id="team">
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 03</span>
              團隊治理：上限、配額、監控
            </h2>
            <p>
              走 Claude API 計費時，可在 Console 對 Claude Code 的 workspace 設<strong>花費上限</strong>與成本報表；Pro/Max
              可用 <code>/usage-credits</code> 設每月上限。建議的 per-user rate limit：
            </p>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>團隊規模</th>
                    <th>TPM / 人</th>
                    <th>RPM / 人</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1–5 人</td>
                    <td>200k–300k</td>
                    <td>5–7</td>
                  </tr>
                  <tr>
                    <td>5–20 人</td>
                    <td>100k–150k</td>
                    <td>2.5–3.5</td>
                  </tr>
                  <tr>
                    <td>20–50 人</td>
                    <td>50k–75k</td>
                    <td>1.25–1.75</td>
                  </tr>
                  <tr>
                    <td>50–100 人</td>
                    <td>25k–35k</td>
                    <td>0.62–0.87</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h3>用 OpenTelemetry 監控用量</h3>
            <p>把用量／成本指標匯到你的監控系統（Grafana、Datadog…），做全隊儀表板。</p>
            <Code lang="json" code={TELEMETRY} />
            <div className="callout">
              <span className="tag">小團隊提醒</span>
              <p>
                先用一小組做 pilot、用 <code>/usage</code> 建立基準，再決定全面推行的預算與 rate
                limit。自動化（見 <a href="/guides/claude-code/headless">無頭執行</a>）會增加用量，記得納入估算。
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
