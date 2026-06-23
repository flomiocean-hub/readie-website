import CopyButton from "../../components/CopyButton";
import TrackedLink from "../../components/TrackedLink";

export const CALENDLY =
  "https://calendly.com/flomiocean/30min?utm_source=website&utm_medium=guide_claude_code";
export const LINE_URL = "https://line.me/R/ti/p/@784xoqdi";
export const HUB = "/guides/claude-code";

// 程式碼區塊（伺服器端渲染 + 客戶端複製按鈕）
export function Code({ lang, code }: { lang: string; code: string }) {
  return (
    <div className="code">
      <div className="code-top">
        <span className="code-lang">{lang}</span>
        <CopyButton text={code} />
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

// 頂部列。subpage=true 時顯示「← 佈建系列」回 hub
export function DocBar({ subpage = false }: { subpage?: boolean }) {
  return (
    <header className="bar solid">
      <div className="wrap">
        <a className="mark" href="/">
          Readie<span className="dot">.</span>
        </a>
        <nav className="nav">
          {subpage ? <a href={HUB}>← 佈建系列</a> : <a href="/">回首頁</a>}
          <TrackedLink
            className="bar-cta"
            href={CALENDLY}
            event="cta_calendly"
            location="guide_navbar"
          >
            預約免費諮詢
          </TrackedLink>
        </nav>
      </div>
    </header>
  );
}

export function FinalCta() {
  return (
    <section className="final">
      <span className="final-line" />
      <div className="wrap">
        <p className="eyebrow" style={{ color: "var(--terracotta)", opacity: 1 }}>
          把工具變成戰力
        </p>
        <h2 className="final-title">
          佈建好環境，只是開始。
          <br />
          讓全公司真的用同一套，才是價值。
        </h2>
        <p>
          Readie 幫台灣中小企業把 AI 從「裝好了」帶到「天天在用、人人一致」——不換系統、不買新軟體，從你們每天已經在用的工具與一台
          Mac Mini 開始。
        </p>
        <div className="ctas">
          <TrackedLink
            className="btn btn-primary"
            href={CALENDLY}
            event="cta_calendly"
            location="guide_final"
          >
            預約 30 分鐘免費諮詢
          </TrackedLink>
          <TrackedLink
            className="btn btn-ghost"
            href={LINE_URL}
            event="cta_line"
            location="guide_final"
          >
            用 LINE 聊聊
          </TrackedLink>
        </div>
        <p className="final-note">Readie AI 導入顧問 · 創辦人 Marco Liu · 19 年產業經驗</p>
      </div>
    </section>
  );
}

export function DocFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="legal">
          <span>© {new Date().getFullYear()} Readie. AI 導入顧問.</span>
          <a href="/">readie.ai</a>
        </div>
      </div>
    </footer>
  );
}
