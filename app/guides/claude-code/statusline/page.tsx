import type { Metadata } from "next";
import { Code, DocBar, FinalCta, DocFooter } from "../../_shared/parts";

export const metadata: Metadata = {
  title: "狀態列：一眼看到 model、配額、Git（選用）｜Readie 佈建參照",
  description:
    "為 Claude Code 加上狀態列，顯示目前模型、用量配額、Git 分支與專案。含 /statusline 互動建立、settings.json 設定，以及企業統一佈建方式與版本注意事項。",
  keywords: [
    "Claude Code statusline",
    "Claude Code 狀態列",
    "statusLine settings.json",
    "/statusline",
    "Readie",
  ],
  alternates: { canonical: "https://readie.ai/guides/claude-code/statusline" },
  openGraph: {
    type: "article",
    locale: "zh_TW",
    url: "https://readie.ai/guides/claude-code/statusline",
    siteName: "Readie AI 導入顧問",
    title: "狀態列：一眼看到 model、配額、Git（選用）",
    description: "顯示模型、配額、Git 分支與專案，附企業統一佈建方式。",
  },
};

const ENABLE = `# 最簡單：互動式建立（會幫你寫好腳本與 settings）
/statusline

# 或手動：把 statusLine 指向你的腳本（~/.claude/settings.json）`;

const SETTINGS = `{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline-command.sh"
  }
}`;

const SCRIPT = `#!/usr/bin/env bash
# ~/.claude/statusline-command.sh
# Claude Code 會把一段 JSON 從 stdin 餵進來（含模型、context、git 等資訊）
input="$(cat)"
model="$(echo "$input" | jq -r '.model.display_name // "Claude"')"
dir="$(echo "$input" | jq -r '.workspace.current_dir // "."')"
branch="$(git -C "$dir" branch --show-current 2>/dev/null)"

line="⚡ $model"
[ -n "$branch" ] && line="$line  ⎇ $branch"
echo "$line"`;

export default function StatuslinePage() {
  return (
    <>
      <DocBar subpage />

      <section className="doc-hero">
        <div className="wrap">
          <div className="lane">
            <p className="kicker">佈建系列 · 04 狀態列（選用）</p>
            <h1>狀態列：一眼看到 model、配額、Git</h1>
            <p className="lede">
              在 Claude Code 底部顯示目前模型、用量配額、Git 分支與專案名稱。屬<strong>錦上添花</strong>、非佈建必要——但團隊統一一套，看起來專業也方便。
            </p>
            <div className="doc-meta">
              <span>定位：選用、加分項</span>
            </div>
            <div className="doc-toc">
              <a href="#what">① 顯示什麼</a>
              <a href="#enable">② 啟用</a>
              <a href="#enterprise">③ 企業統一</a>
            </div>
          </div>
        </div>
      </section>

      {/* ① what */}
      <section className="light doc" id="what">
        <svg className="grain" aria-hidden="true">
          <filter id="gt">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#gt)" />
        </svg>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 01</span>
              狀態列能顯示什麼
            </h2>
            <ul className="bullets">
              <li>目前模型（例：Opus 4.8 / Sonnet 4.6）</li>
              <li>Context 使用量（漸層進度條）、用量配額剩餘</li>
              <li>Git 分支與未提交變更指示（<code>*</code>）、變更行數</li>
              <li>目前專案名稱</li>
            </ul>
            <div className="callout">
              <span className="tag">版本注意</span>
              <p>
                配額（5 小時 / 7 天）這類欄位，依賴 Claude Code 餵給腳本的 JSON 內容，
                <strong>欄位可能隨版本變動</strong>。做進階顯示前，先在你佈建的版本上實測一次。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ② enable */}
      <section className="doc dark" id="enable" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 02</span>
              啟用
            </h2>
            <p>最快是用內建指令互動建立；要客製就指向自己的腳本。</p>
            <Code lang="bash" code={ENABLE} />
            <Code lang="json" code={SETTINGS} />
            <h3>最小可用腳本（model + git 分支）</h3>
            <p>從這支開始，要什麼欄位再加。Claude Code 會從 stdin 餵 JSON 進來，解析後輸出一行文字。</p>
            <Code lang="bash" code={SCRIPT} />
          </div>
        </div>
      </section>

      {/* ③ enterprise */}
      <section className="light doc" id="enterprise">
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 03</span>
              企業統一佈建
            </h2>
            <ul className="bullets">
              <li>
                把同一支 <code>statusline-command.sh</code> 與 <code>statusLine</code> 設定納入
                <a href="/guides/claude-code/setup">核心佈建</a>腳本，全隊一致。
              </li>
              <li>
                「上次訊息時間」需要額外的 <code>UserPromptSubmit</code> hook，增加複雜度——
                <strong>企業預設可不裝</strong>，要再加。
              </li>
              <li>狀態列只是顯示，不影響權限與安全，可放心讓各人微調 emoji 等偏好。</li>
            </ul>
          </div>
        </div>
      </section>

      <FinalCta />
      <DocFooter />
    </>
  );
}
