import type { Metadata } from "next";
import { Code, DocBar, FinalCta, DocFooter } from "../../_shared/parts";

export const metadata: Metadata = {
  title: "核心佈建：在 Mac Mini 快速佈建 Claude Code 團隊環境｜Readie",
  description:
    "從零到能用：Node 安裝與版本策略、設定四層優先序、一鍵佈建腳本、組織強制護欄、fullscreen 顯示、外部編輯器、遠端 SSH/tmux、登入授權、上線部署與驗證維護。針對 Mac Mini／團隊環境。",
  keywords: [
    "Claude Code 佈建",
    "Claude Code Mac Mini",
    "managed-settings.json",
    "Claude Code 版本",
    "claude setup-token",
    "Claude Code 團隊設定",
    "Readie",
  ],
  alternates: { canonical: "https://readie.ai/guides/claude-code/setup" },
  openGraph: {
    type: "article",
    locale: "zh_TW",
    url: "https://readie.ai/guides/claude-code/setup",
    siteName: "Readie AI 導入顧問",
    title: "核心佈建：在 Mac Mini 快速佈建 Claude Code 團隊環境",
    description: "安裝、設定四層、一鍵腳本、護欄、顯示、編輯器、遠端、登入、上線、驗證。",
  },
};

const INSTALL = `# 1. Node 18+（建議用 nvm 鎖版本，全機一致）
#    若已用 Homebrew 安裝 node 亦可，跳過這步
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
nvm install --lts && nvm alias default 'lts/*'

# 2. 全機安裝 Claude Code（再跑一次就是更新到最新版）
npm install -g @anthropic-ai/claude-code

# 3. 確認版本（fullscreen 需 v2.1.89+，/tui 指令需 v2.1.110+）
claude --version`;

const AUTH_ENT = `# 個人：執行 claude，瀏覽器登入（Pro / Max / Team / Enterprise 皆同）
claude

# 無頭 Mac Mini（SSH、開不了瀏覽器）：產生一年期 OAuth token
claude setup-token
export CLAUDE_CODE_OAUTH_TOKEN="貼上 token"   # 放機器層環境或 secrets

# 走 API 計費 / 自動化：用金鑰，建議 apiKeyHelper 從 vault 動態取，不要硬寫
export ANTHROPIC_API_KEY="sk-ant-..."`;

const PRECEDENCE = `# 設定檔由高到低（高的蓋低的）：
# 1) 組織強制（managed）  /Library/Application Support/ClaudeCode/managed-settings.json
# 2) CLI 參數             claude --setting ...
# 3) 專案個人            <repo>/.claude/settings.local.json   ← 個人、不進 git
# 4) 專案共用            <repo>/.claude/settings.json         ← 進 git，全隊共用
# 5) 使用者              ~/.claude/settings.json              ← 每台機器各自，優先序最低

# 企業佈建心法：
#  · 安全護欄 → 放第 1 層 managed（使用者無法覆蓋）
#  · 團隊習慣（顯示、別名、權限預設）→ 放第 5 層 user，由佈建腳本寫入
#  · 專案規範 → 放第 4 層，跟著 repo 走`;

const SETTINGS_TEAM = `{
  "tui": "fullscreen",
  "theme": "dark",
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff:*)",
      "Bash(npm run *)",
      "Read"
    ],
    "ask": [
      "Bash(git push:*)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./**/*.key)",
      "Read(./**/*.pem)"
    ]
  },
  "env": {
    "CLAUDE_CODE_SCROLL_SPEED": "3"
  }
}`;

const SETUP_SCRIPT = `#!/usr/bin/env bash
# provision-claude-code.sh — 在 Mac Mini 佈建 Claude Code 團隊統一環境
# 可重複執行（idempotent）：跑第二次只會補沒做的、不會弄壞既有設定
set -euo pipefail

# ── 1. Node（沒有就擋下，請先裝 nvm 或 brew install node）──
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
command -v node >/dev/null || { echo "✗ 找不到 Node，請先安裝（nvm / Homebrew）"; exit 1; }

# ── 2. 安裝或更新 Claude Code，並檢查版本下限 ──
MIN="2.1.110"   # /tui 等功能的下限；要凍結升級時機可另設 DISABLE_AUTOUPDATER=1
npm install -g @anthropic-ai/claude-code
CUR="$(claude --version | grep -oE '[0-9]+\\.[0-9]+\\.[0-9]+' | head -1)"
[ "$(printf '%s\\n%s\\n' "$MIN" "$CUR" | sort -V | head -1)" = "$MIN" ] \\
  || { echo "✗ Claude Code $CUR 低於下限 $MIN，請更新後重跑"; exit 1; }
echo "✓ Claude Code $CUR（≥ $MIN）"

# ── 3. 寫入團隊統一 user 設定（安全 deep-merge，保留既有設定）──
mkdir -p "$HOME/.claude"
TEAM_SETTINGS='{"tui":"fullscreen","theme":"dark","env":{"CLAUDE_CODE_SCROLL_SPEED":"3"},"permissions":{"allow":["Bash(git status)","Bash(git diff:*)","Bash(npm run *)","Read"],"ask":["Bash(git push:*)"],"deny":["Read(./.env)","Read(./**/*.key)","Read(./**/*.pem)"]}}'
if [ -f "$HOME/.claude/settings.json" ]; then
  echo "$TEAM_SETTINGS" | jq -s '.[0] * .[1]' "$HOME/.claude/settings.json" - \\
    > "$HOME/.claude/settings.json.tmp" && mv "$HOME/.claude/settings.json.tmp" "$HOME/.claude/settings.json"
else
  echo "$TEAM_SETTINGS" | jq . > "$HOME/.claude/settings.json"
fi
echo "✓ 已寫入 ~/.claude/settings.json"

# ── 4. cc 別名（已存在就不重複加）──
grep -q "alias cc=" "$HOME/.zshrc" 2>/dev/null || echo "alias cc='claude'" >> "$HOME/.zshrc"
echo "✓ cc 別名就緒（開新分頁或 source ~/.zshrc 生效）"

echo "── 完成。接著請各帳號執行一次 'claude' 完成登入 ──"`;

const MANAGED = `# 組織強制護欄：使用者無法覆蓋的安全底線（最高優先序）
#  需 sudo；只放「絕不允許」的事，不要放顯示偏好
sudo mkdir -p "/Library/Application Support/ClaudeCode"
sudo tee "/Library/Application Support/ClaudeCode/managed-settings.json" >/dev/null <<'JSON'
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./**/*.key)",
      "Read(./**/*.pem)",
      "Bash(rm -rf:*)",
      "Bash(curl:* | sh)"
    ]
  }
}
JSON
echo "✓ 組織護欄已佈署，全機使用者一致且無法關閉"`;

const REVERT = `/tui fullscreen     # 開啟（會自動重啟並保留對話，最簡單）
/tui                # 查目前用哪個 renderer
/tui default        # 關閉，退回經典模式

# 完全停用（環境變數，連 tui 設定都蓋過）
CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1 claude`;

const EDITOR_SETUP = `# 企業預設：micro（現代終端機編輯器，支援滑鼠、Ctrl+S 存檔，SSH 也能用）
brew install micro 2>/dev/null || true

# 指定 Ctrl+G 要開哪個編輯器（nano 為免裝備援；進階者可用 vim）
grep -q "EDITOR=" "$HOME/.zshrc" || echo "export EDITOR='micro'" >> "$HOME/.zshrc"
source "$HOME/.zshrc"

# Ctrl+G 已是內建動作，不需要 wrapper script：
#   按 Ctrl+G → 用 $EDITOR 開啟目前輸入 → 存檔關閉 → 內容自動帶回對話`;

const CLAUDE_MD = `# 專案說明（放在每個 repo 根目錄 CLAUDE.md，跟著 git 走）

## 這是什麼
一句話描述。技術棧、進入點、怎麼跑起來。

## 團隊規範
- 套件管理一律用 pnpm
- 改動前先讀相關檔案，不要憑空假設 API
- 提交訊息用繁體中文，一行摘要

## 絕不可做
- 不要碰 .env 與任何金鑰檔（managed 層已強制禁讀）
- 沒有人工確認前不要 git push`;

const AGENTS_BRIDGE = `# CLAUDE.md 內容：import 既有的 AGENTS.md，兩邊同一份來源
@AGENTS.md

## Claude Code 專屬（選填）
- src/billing/ 底下的改動用 plan mode

# 不需要 Claude 專屬內容時，直接 symlink 即可：
#   ln -s AGENTS.md CLAUDE.md`;

const DEPLOY = `# 選平台（依需求，不綁特定家）：
#   純前端 / 靜態頁     → Cloudflare Pages 或 Vercel
#   有後端 / DB / 要常駐 → Vercel / Railway / Zeabur 擇一
# 鐵則：金鑰一律放平台環境變數，別 hardcode 進 repo

# 範例 A：Vercel（你現有官網、EECP 都在這）
npm i -g vercel && vercel deploy --prod

# 範例 B：Cloudflare Pages（靜態）
npm i -g wrangler && wrangler pages deploy ./dist`;

const VERIFY = `claude --version                              # 版本對不對
jq . ~/.claude/settings.json                  # 設定檔格式正確（會報錯就是壞了）
cat "/Library/Application Support/ClaudeCode/managed-settings.json"  # 護欄在不在
claude --version && cc                         # cc 別名能啟動`;

export default function SetupPage() {
  return (
    <>
      <DocBar subpage />

      <section className="doc-hero">
        <div className="wrap">
          <div className="lane">
            <p className="kicker">佈建系列 · 01 核心佈建</p>
            <h1>核心佈建：在 Mac Mini 從零到能用</h1>
            <p className="lede">
              一份可照著跑的佈建參照。在一台 Mac Mini
              上，從安裝、設定四層、一鍵腳本、組織護欄，到顯示、編輯器、遠端、登入、上線，讓全公司用同一套
              Claude Code。
            </p>
            <div className="doc-meta">
              <span>對象：要佈建 Claude Code 的人</span>
              <span>結果：團隊統一、可重複、約 20 分鐘</span>
            </div>
            <div className="doc-toc">
              <a href="#install">① 安裝</a>
              <a href="#layers">② 設定四層</a>
              <a href="#standard">③ 統一設定</a>
              <a href="#script">④ 一鍵佈建</a>
              <a href="#display">⑤ 顯示模式</a>
              <a href="#editor">⑥ 外部編輯器</a>
              <a href="#remote">⑦ 遠端注意</a>
              <a href="#auth">⑧ 登入授權</a>
              <a href="#knowledge">⑨ CLAUDE.md</a>
              <a href="#deploy">⑩ 上線部署</a>
              <a href="#verify">⑪ 驗證維護</a>
            </div>
          </div>
        </div>
      </section>

      {/* ① install */}
      <section className="light doc" id="install">
        <svg className="grain" aria-hidden="true">
          <filter id="g2">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#g2)" />
        </svg>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">STEP 01</span>
              佈建前提與安裝
            </h2>
            <p>
              Mac Mini 是台灣中小企業最划算的「常開 AI 主機」——一台放著，全隊共用、跑排程、接
              LINE bot 都行。佈建第一步：把 Node 與 Claude Code 裝成全機一致的版本。授權細節見 STEP 08。
            </p>
            <Code lang="bash" code={INSTALL} />
            <div className="callout">
              <span className="tag">版本策略：統一、設下限、一起升</span>
              <p>
                兩件事分開看。<strong>Node</strong>：全隊用 nvm 對齊同一個 LTS，確保可重現。
                <strong>Claude Code 本身</strong>：它會自我更新，不要凍在舊版——你要的 fullscreen
                等功能反而需要夠新（<code>/tui</code> 需 v2.1.110+）。正確做法是設一個<strong>版本下限</strong>、全隊透過同一支腳本更新；若要避免被自動更新打斷，再用
                <code>DISABLE_AUTOUPDATER</code> 統一控管升級時機。目標是「大家版本一致且夠新」，不是「鎖在某一版」。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ② layers */}
      <section className="doc dark" id="layers" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">STEP 02</span>
              設定的四層與優先序（企業統一的關鍵）
            </h2>
            <p>
              這是個人教學最常漏、卻是企業佈建最重要的一件事：Claude Code
              的設定有多層，高層蓋低層。搞懂它，才能「安全的事鎖死、習慣的事統一、專案的事跟著 repo 走」。
            </p>
            <Code lang="bash" code={PRECEDENCE} />
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>層級</th>
                    <th>位置</th>
                    <th>企業用途</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>① 組織強制 managed</td>
                    <td>/Library/Application Support/ClaudeCode/managed-settings.json</td>
                    <td>安全底線，使用者無法覆蓋（最高）</td>
                  </tr>
                  <tr>
                    <td>② CLI 參數</td>
                    <td>claude --setting …</td>
                    <td>臨時覆寫，少用</td>
                  </tr>
                  <tr>
                    <td>③ 專案個人</td>
                    <td>repo/.claude/settings.local.json</td>
                    <td>個人偏好，不進 git</td>
                  </tr>
                  <tr>
                    <td>④ 專案共用</td>
                    <td>repo/.claude/settings.json</td>
                    <td>專案規範，進 git 全隊共用</td>
                  </tr>
                  <tr>
                    <td>⑤ 使用者</td>
                    <td>~/.claude/settings.json</td>
                    <td>每台機器習慣設定（最低）</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ③ standardized settings */}
      <section className="light doc" id="standard">
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">STEP 03</span>
              團隊統一設定檔
            </h2>
            <p>
              下面這份放在第 5 層（user），由佈建腳本寫進每台機器，是「全隊共同習慣」：fullscreen
              不閃、捲動速度、權限白名單（安全指令免確認、危險操作要問、金鑰檔禁讀）。權限的深入說明見
              <a href="/guides/claude-code/safety">安全與權限</a>專頁。
            </p>
            <Code lang="json" code={SETTINGS_TEAM} />
            <div className="callout">
              <span className="tag">更簡單的開法</span>
              <p>
                不必手改檔——在任何對話裡輸入 <code>/tui fullscreen</code>（需 v2.1.110+），它會自動寫進設定並無痛重啟、對話不中斷。上面的
                <code>settings.json</code> 是給<strong>批次佈建多台機器</strong>用的；單人開關用指令最快。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ④ one-shot script */}
      <section className="doc dark" id="script" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">STEP 04</span>
              一鍵佈建腳本（這頁的核心）
            </h2>
            <p>
              把前面所有步驟串成一支<strong>可重複執行</strong>的腳本。存成{" "}
              <code>provision-claude-code.sh</code>、<code>chmod +x</code> 後在每台 Mac Mini 跑一次即可。再跑一次只會補沒做的、不會弄壞既有設定。
            </p>
            <Code lang="bash" code={SETUP_SCRIPT} />
            <h3>加上組織強制護欄</h3>
            <p>
              真正的企業統一靠這層：把「絕不允許」的事放進 <code>managed-settings.json</code>，使用者改不掉、關不了。為什麼這層才是真護欄，見
              <a href="/guides/claude-code/safety">安全與權限</a>專頁。
            </p>
            <Code lang="bash" code={MANAGED} />
          </div>
        </div>
      </section>

      {/* ⑤ display mode */}
      <section className="light doc" id="display">
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">STEP 05</span>
              顯示模式：fullscreen
            </h2>
            <p>
              預設模式每吐一字就重畫整頁——畫面狂閃、捲不上去、滑鼠難選、開久了吃記憶體。切到
              <code>fullscreen</code>（差分渲染、只畫可見內容）一次解決。<strong>注意這目前是官方研究預覽（research
              preview），行為可能調整。</strong>
            </p>
            <Code lang="bash" code={REVERT} />
            <p>Fullscreen 與預設模式比較：</p>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>功能</th>
                    <th>預設模式</th>
                    <th>Fullscreen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>畫面閃爍</td>
                    <td>❌ 每字重畫整頁</td>
                    <td>✅ 差分渲染，穩定</td>
                  </tr>
                  <tr>
                    <td>往上捲看歷史</td>
                    <td>❌ 一直被拉回底部</td>
                    <td>✅ 上捲自動暫停跟隨</td>
                  </tr>
                  <tr>
                    <td>記憶體用量</td>
                    <td>❌ 隨對話增長</td>
                    <td>✅ 恆定</td>
                  </tr>
                  <tr>
                    <td>滑鼠選取複製</td>
                    <td>靠終端機原生</td>
                    <td>✅ 拖曳選取、放開自動複製</td>
                  </tr>
                  <tr>
                    <td>Cmd/Ctrl+click 開檔</td>
                    <td>勉強</td>
                    <td>✅ 可開檔／開 URL（mac 按 Cmd、其他按 Ctrl）</td>
                  </tr>
                  <tr>
                    <td>搜尋整段對話</td>
                    <td>終端機原生 Cmd+F</td>
                    <td>Ctrl+O 進 transcript，再按 / 搜（按 [ 倒回 scrollback 即可用 Cmd+F）</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ⑥ external editor */}
      <section className="doc dark" id="editor" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">STEP 06</span>
              外部編輯器(編輯長文字 / 貼上的大段內容)
            </h2>
            <p>
              貼一大段文字進去會變成 <code>[Pasted text +20 lines]</code> 無法再改。按{" "}
              <code>Ctrl+G</code> 就能用編輯器開啟、改完存檔自動帶回——這在新版 Claude Code 已是
              <strong>內建動作</strong>（<code>chat:externalEditor</code>），你要做的只是「指定它開哪個編輯器」。
            </p>
            <p>
              企業佈建的關鍵選擇：<strong>預設用終端機編輯器，不要用 GUI 編輯器</strong>。因為 Mac
              Mini 多半是遠端 SSH 進去用，GUI 編輯器（CotEditor、VS Code）只會開在那台機器的實體螢幕上，SSH
              使用者按了不會有反應。
            </p>
            <Code lang="bash" code={EDITOR_SETUP} />
            <h3>選編輯器</h3>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>編輯器</th>
                    <th>設定</th>
                    <th>適用</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>micro（建議）</td>
                    <td>export EDITOR=&apos;micro&apos;</td>
                    <td>本機＋SSH 都可，新手友善、有滑鼠</td>
                  </tr>
                  <tr>
                    <td>nano</td>
                    <td>export EDITOR=&apos;nano&apos;</td>
                    <td>免安裝備援，本機＋SSH</td>
                  </tr>
                  <tr>
                    <td>vim</td>
                    <td>export EDITOR=&apos;vim&apos;</td>
                    <td>進階者，本機＋SSH</td>
                  </tr>
                  <tr>
                    <td>CotEditor / VS Code</td>
                    <td>export EDITOR=&apos;code --wait&apos;</td>
                    <td>⚠️ 只限坐在機器前的本機使用者，SSH 下不可用</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="callout">
              <span className="tag">三個已知狀況</span>
              <p>
                ① 部分版本會自動偵測 IDE 而<strong>不一定吃 <code>$EDITOR</code></strong>，佈建後請實測。
                ② <code>Ctrl+G</code> 在 SSH 下開 GUI 編輯器會靜默失敗——所以才用終端機編輯器。
                ③ 在 fullscreen（滑鼠捕捉）下按 <code>Ctrl+G</code> 偶有跳脫序列亂碼，遇到就改用終端機編輯器或暫時關
                fullscreen。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ⑦ remote */}
      <section className="light doc" id="remote">
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">STEP 07</span>
              遠端 Mac Mini 的眉角（最容易踩雷）
            </h2>
            <p>
              Mac Mini 多半是放著、用 SSH 或 tmux 遠端進去操作——這正是 fullscreen
              最容易出狀況的場景。先知道，省下半天除錯。
            </p>
            <ul className="bullets">
              <li>
                <strong>tmux 滑鼠</strong>：要在 <code>~/.tmux.conf</code> 加{" "}
                <code>set -g mouse on</code> 滾輪才有效，否則滾動跑去控制 tmux。
              </li>
              <li>
                <strong>tmux -CC 不相容</strong>：iTerm2 的 tmux 整合模式（<code>tmux -CC</code>）下別開
                fullscreen，滑鼠會失效、雙擊可能弄壞畫面。一般 tmux 沒問題。
              </li>
              <li>
                <strong>SSH 剪貼簿</strong>：選取的字透過 OSC 52 回傳，部分終端機預設擋掉（iTerm2
                要開「允許存取剪貼簿」）。
              </li>
              <li>
                <strong>純鍵盤操作</strong>：若滑鼠捕捉在遠端很卡，設{" "}
                <code>CLAUDE_CODE_DISABLE_MOUSE=1</code>——保留不閃與低記憶體，改回終端機原生選取。
              </li>
              <li>
                <strong>SSH + tmux 會更閃</strong>：tmux 不支援同步輸出。若很明顯，直接在獨立分頁跑
                Claude Code，別包在 tmux 裡。
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ⑧ auth */}
      <section className="doc dark" id="auth" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">STEP 08</span>
              登入授權（個人 / 團隊 / 無頭機）
            </h2>
            <p>
              Claude Code 對團隊有完整方案，這是個人教學最常漏的一塊。挑符合你計費方式的一種即可。
            </p>
            <Code lang="bash" code={AUTH_ENT} />
            <ul className="bullets">
              <li>
                <strong>團隊／企業</strong>：用 Claude for Teams / Enterprise，成員各自用 Claude.ai
                帳號登入；Enterprise 另有 SSO 與 managed policy（集中控管設定）。
              </li>
              <li>
                <strong>無頭 Mac Mini</strong>：SSH 進去開不了瀏覽器，用 <code>claude setup-token</code>{" "}
                產生一年期 token，設成 <code>CLAUDE_CODE_OAUTH_TOKEN</code>。
              </li>
              <li>
                <strong>金鑰管理</strong>：憑證存在 macOS Keychain；要輪替用 <code>apiKeyHelper</code>{" "}
                從 vault 動態取，別把長期金鑰硬寫進設定檔。
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ⑨ knowledge */}
      <section className="light doc" id="knowledge">
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">STEP 09</span>
              把知識也統一：CLAUDE.md
            </h2>
            <p>
              設定統一只是地基。真正讓 Claude Code 變戰力、且<strong>不綁在某個人腦袋裡</strong>的，是把工作守則寫成每個
              repo 根目錄的 <code>CLAUDE.md</code>，跟著 git 走——等於每次對話自動載入的團隊守則。
            </p>
            <Code lang="markdown" code={CLAUDE_MD} />
            <h3>跨工具標準：AGENTS.md 橋接</h3>
            <p>
              <code>AGENTS.md</code> 是跨 AI 工具的開放標準（Cursor、Copilot、Devin… 都認）。但
              <strong>Claude Code 只讀 <code>CLAUDE.md</code>、不讀 <code>AGENTS.md</code></strong>。團隊若同時用多種工具，做法是讓
              <code>CLAUDE.md</code> 去 import 既有的 <code>AGENTS.md</code>——一份來源、全工具一致，不必各寫各的。
            </p>
            <Code lang="markdown" code={AGENTS_BRIDGE} />
            <p>
              小提醒：跑 <code>/init</code> 時若 repo 已有 <code>AGENTS.md</code>（或 <code>.cursorrules</code>{" "}
              等），它會讀進來整併。讓 Claude 能爬網、操作瀏覽器、查資料庫的 MCP 工具與金鑰治理，見
              <a href="/guides/claude-code/mcp">MCP 工具標準化</a>專頁。
            </p>
          </div>
        </div>
      </section>

      {/* ⑩ deploy */}
      <section className="doc dark" id="deploy" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">STEP 10</span>
              上線部署（選擇性）
            </h2>
            <p>
              用 Claude Code 做出來的工具要 24 小時可用、可分享，就得部署到雲端。平台不必綁特定家，依需求挑，重點是
              <strong>金鑰一律放平台環境變數、別 hardcode 進 repo</strong>。
            </p>
            <Code lang="bash" code={DEPLOY} />
          </div>
        </div>
      </section>

      {/* ⑪ verify */}
      <section className="light doc" id="verify">
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">STEP 11</span>
              驗證佈建成功與後續維護
            </h2>
            <Code lang="bash" code={VERIFY} />
            <h3>常見狀況</h3>
            <ul className="bullets">
              <li>
                <strong>設了還是閃</strong>：八成 JSON 壞了。用 <code>jq . ~/.claude/settings.json</code>{" "}
                檢查；另外設定只在啟動時讀取，要完全關掉重開。
              </li>
              <li>
                <strong>功能不存在 / 指令無效</strong>：版本太舊。重跑佈建腳本即更新，或{" "}
                <code>npm install -g @anthropic-ai/claude-code</code>。
              </li>
              <li>
                <strong>cc 找不到</strong>：<code>source ~/.zshrc</code> 或開新分頁；確認用的是 zsh（
                <code>echo $SHELL</code>）。
              </li>
              <li>
                <strong>維護</strong>：定期重跑佈建腳本即同步全機版本與設定；護欄改動只需更新一份
                <code>managed-settings.json</code>。
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
