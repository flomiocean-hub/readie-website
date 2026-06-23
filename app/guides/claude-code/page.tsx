import type { Metadata } from "next";
import { DocBar, FinalCta, DocFooter } from "../_shared/parts";

export const metadata: Metadata = {
  title: "在 Mac Mini 佈建 Claude Code 企業統一環境｜Readie 佈建參照系列",
  description:
    "一套照著做就能完成的 Claude Code 企業佈建參照：核心佈建、安全與權限（含 Hooks）、MCP 工具、AI Agent 團隊、Skills 技能、無頭自動化（CI/排程）、成本與用量管理、狀態列。針對 Mac Mini／團隊環境，依官方文件更新。Readie AI 導入顧問整理。",
  keywords: [
    "Claude Code 企業佈建",
    "Claude Code Mac Mini",
    "Claude Code 團隊設定",
    "managed-settings.json",
    "Claude Code 安全 權限",
    "Claude Code MCP",
    "AI 工具標準化",
    "Readie",
  ],
  alternates: { canonical: "https://readie.ai/guides/claude-code" },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://readie.ai/guides/claude-code",
    siteName: "Readie AI 導入顧問",
    title: "在 Mac Mini 佈建 Claude Code 企業統一環境（參照系列）",
    description:
      "核心佈建、安全與權限、MCP 工具、狀態列——針對 Mac Mini／團隊環境的完整參照。",
  },
};

const CARDS = [
  {
    no: "01",
    tag: "核心 · 必讀",
    href: "/guides/claude-code/setup",
    title: "核心佈建",
    desc: "從零到能用：安裝與版本策略、設定四層優先序、一鍵佈建腳本、組織護欄、fullscreen 顯示、外部編輯器、遠端 SSH/tmux、登入授權、上線部署、驗證維護。",
  },
  {
    no: "02",
    tag: "安全",
    href: "/guides/claude-code/safety",
    title: "安全與權限",
    desc: "別被假護欄騙了：trash alias 其實擋不住 AI、Bash 黑名單只是防呆不是沙箱、權限四模式怎麼選，以及真正的企業底線 managed 護欄。",
  },
  {
    no: "03",
    tag: "工具",
    href: "/guides/claude-code/mcp",
    title: "MCP 工具標準化",
    desc: "讓 Claude 真的能做事：MCP 的三種 scope、金鑰治理（別寫死）、最小權限，以及爬蟲／瀏覽器／檔案／Google 等常用工具的正確安裝法。",
  },
  {
    no: "04",
    tag: "進階",
    href: "/guides/claude-code/agents",
    title: "AI Agent 團隊",
    desc: "把架構師／後端／審查／驗證等專業角色做成 subagents、提交進 repo 全隊共用，工具最小權限、模型控成本，含可抄的六角色團隊模板。",
  },
  {
    no: "05",
    tag: "工具",
    href: "/guides/claude-code/skills",
    title: "Skills 技能標準化",
    desc: "把可重複的多步驟流程封裝成 SKILL.md、按需載入不佔 context、提交進 repo 全隊共用。與 CLAUDE.md／subagents 構成完整知識層。",
  },
  {
    no: "06",
    tag: "自動化",
    href: "/guides/claude-code/headless",
    title: "無頭自動化（CI / 排程）",
    desc: "claude -p 無互動執行、--bare 可重現、CI 授權與 Mac Mini crontab／GitHub Actions 範例，把 AI 接進排程與流水線。",
  },
  {
    no: "07",
    tag: "治理",
    href: "/guides/claude-code/cost",
    title: "成本與用量管理",
    desc: "看花費、降成本、設 workspace 花費上限與 per-user rate limit，並用 OpenTelemetry 把用量匯進儀表板。",
  },
  {
    no: "08",
    tag: "選用",
    href: "/guides/claude-code/statusline",
    title: "狀態列",
    desc: "一眼看到 model、配額、Git 分支與專案。屬錦上添花，附企業統一佈建方式與版本注意事項。",
  },
];

export default function ClaudeCodeHub() {
  return (
    <>
      <DocBar />

      <section className="doc-hero">
        <div className="wrap">
          <div className="lane">
            <p className="kicker">Readie 佈建參照系列 · DEPLOYMENT GUIDES</p>
            <h1>在 Mac Mini 佈建 Claude Code 企業統一環境</h1>
            <p className="lede">
              這是一套<strong>可照著跑的企業佈建參照</strong>，不是個人調校教學。目標是讓全公司在一台
              Mac Mini 上用同一套 Claude Code——設定一致、護欄一致、出事可追。內容針對團隊／伺服器情境，並依官方文件更新。
            </p>
            <div className="doc-meta">
              <span>對象：要在 Mac Mini／伺服器佈建 Claude Code 的人</span>
              <span>八篇，從核心佈建開始</span>
            </div>
          </div>
        </div>
      </section>

      <section className="light doc">
        <svg className="grain" aria-hidden="true">
          <filter id="gh">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#gh)" />
        </svg>
        <div className="wrap">
          <div className="sec-head">
            <p className="eyebrow">系列目錄</p>
            <h2 className="sec-title">挑一篇開始，或從核心佈建讀起</h2>
          </div>
          <div className="paths">
            {CARDS.map((c) => (
              <a className="path-card" href={c.href} key={c.no}>
                <p className="pc-when">
                  {c.no} · {c.tag}
                </p>
                <h4>{c.title}</h4>
                <p>{c.desc}</p>
                <p className="pc-go">閱讀 →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
      <DocFooter />
    </>
  );
}
