import type { Metadata } from "next";
import { Code, DocBar, FinalCta, DocFooter } from "../../_shared/parts";

export const metadata: Metadata = {
  title: "Claude Code 安全與權限：別被假護欄騙了｜Readie 佈建參照",
  description:
    "釐清 Claude Code 的安全真相：rm→trash 別名其實擋不住 AI、Bash 黑名單只是防呆不是沙箱、權限四模式怎麼選，以及真正的企業底線 managed-settings 護欄。針對 Mac Mini／團隊環境。",
  keywords: [
    "Claude Code 安全",
    "Claude Code 權限",
    "Claude Code 誤刪",
    "permissions deny",
    "bypassPermissions",
    "managed-settings.json",
    "Readie",
  ],
  alternates: { canonical: "https://readie.ai/guides/claude-code/safety" },
  openGraph: {
    type: "article",
    locale: "zh_TW",
    url: "https://readie.ai/guides/claude-code/safety",
    siteName: "Readie AI 導入顧問",
    title: "Claude Code 安全與權限：別被假護欄騙了",
    description: "trash 別名擋不住 AI、黑名單只是防呆，真正的底線是 managed 護欄。",
  },
};

const TRASH = `# 給「人」用的防手誤：刪除進垃圾桶而非真刪
brew install trash
cat >> ~/.zshrc << 'EOF'
alias rm='trash'      # 只影響你在終端機手打的 rm
alias rm!='/bin/rm'   # 真的要硬刪時用 rm!
EOF
source ~/.zshrc`;

const DENY = `# 防呆層：把高風險指令加進 deny（會跳出阻擋）
#  注意：這是「防呆」不是「沙箱」，能降低誤觸但無法保證擋死
test -f ~/.claude/settings.json || echo '{}' > ~/.claude/settings.json
jq '
  .permissions = (.permissions // {}) |
  .permissions.deny = (((.permissions.deny // []) + [
    "Bash(rm -rf:*)", "Bash(rm -fr:*)", "Bash(rm -r:*)",
    "Bash(sudo:*)", "Bash(dd:*)", "Bash(mkfs:*)",
    "Bash(diskutil erase:*)", "Bash(chmod -R 777:*)",
    "Bash(git reset --hard:*)", "Bash(git push --force:*)",
    "Bash(git clean -f:*)", "Bash(shutdown:*)", "Bash(reboot:*)"
  ]) | unique)
' ~/.claude/settings.json > /tmp/cc.json && mv /tmp/cc.json ~/.claude/settings.json`;

const MANAGED = `# 企業底線（使用者改不掉、關不了）：把絕對禁止的放這層
sudo mkdir -p "/Library/Application Support/ClaudeCode"
sudo tee "/Library/Application Support/ClaudeCode/managed-settings.json" >/dev/null <<'JSON'
{
  "permissions": {
    "defaultMode": "default",
    "deny": [
      "Read(./.env)", "Read(./**/*.key)", "Read(./**/*.pem)",
      "Bash(rm -rf:*)", "Bash(curl:* | sh)", "Bash(sudo:*)"
    ]
  }
}
JSON`;

const HOOKS = `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "~/.claude/hooks/guard.sh" }
        ]
      }
    ]
  }
}`;

const HOOK_SCRIPT = `#!/usr/bin/env bash
# ~/.claude/hooks/guard.sh — 真正的程式化攔截（不靠 AI 自律）
input="$(cat)"
cmd="$(echo "$input" | jq -r '.tool_input.command // ""')"
case "$cmd" in
  *"git push"*main*|*"rm -rf"*)
    jq -n '{hookSpecificOutput:{hookEventName:"PreToolUse",
      permissionDecision:"deny",
      permissionDecisionReason:"此操作被 hook 規則禁止"}}'
    exit 0;;
esac
echo '{}'   # 其餘放行`;

export default function SafetyPage() {
  return (
    <>
      <DocBar subpage />

      <section className="doc-hero">
        <div className="wrap">
          <div className="lane">
            <p className="kicker">佈建系列 · 02 安全與權限</p>
            <h1>安全與權限：別被假護欄騙了</h1>
            <p className="lede">
              網路上流行的「安全三件套」有個危險的誤解：它推薦的第一層其實<strong>擋不住 AI 自己的刪除</strong>。這頁說清楚每一層到底擋什麼、擋不了什麼，以及企業真正該倚靠的底線在哪。
            </p>
            <div className="doc-meta">
              <span>重點：分清「防手誤」「防呆」與「真隔離」</span>
            </div>
            <div className="doc-toc">
              <a href="#myth">① 三層各擋什麼</a>
              <a href="#modes">② 權限四模式</a>
              <a href="#trash">③ 垃圾桶</a>
              <a href="#deny">④ 黑名單</a>
              <a href="#hooks">⑤ Hooks 強制</a>
              <a href="#managed">⑥ 企業護欄</a>
            </div>
          </div>
        </div>
      </section>

      {/* ① myth */}
      <section className="light doc" id="myth">
        <svg className="grain" aria-hidden="true">
          <filter id="gs">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#gs)" />
        </svg>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 01</span>
              先搞清楚：三層各擋什麼
            </h2>
            <p>
              最關鍵的觀念校正：<strong>
                <code>alias rm=&apos;trash&apos;</code> 擋不住 Claude 自己跑的 rm。
              </strong>
              Claude 的 Bash 工具用的是非互動 shell，<strong>不讀 <code>~/.zshrc</code>、不展開 alias</strong>，所以那個別名只保護「你在終端機手打 rm」，不會約束 AI。把它當成「防 AI 誤刪的第一層」是錯的。
            </p>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>機制</th>
                    <th>實際擋的是</th>
                    <th>擋不了</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>rm→trash 別名</td>
                    <td>你本人手打的 rm（防手誤）</td>
                    <td>Claude 自己的刪除（非互動 shell 不吃 alias）</td>
                  </tr>
                  <tr>
                    <td>Bash deny 黑名單</td>
                    <td>常見危險指令的直球寫法（防呆）</td>
                    <td>換句話繞過：不同空格、find -delete、python -c、子 shell</td>
                  </tr>
                  <tr>
                    <td>不開 bypass + managed deny + 容器</td>
                    <td>真正的隔離與底線</td>
                    <td>—（這才是企業該倚靠的）</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="callout">
              <span className="tag">一句話</span>
              <p>
                黑名單給人「已經安全」的錯覺最危險。它是<strong>防呆，不是沙箱</strong>。真正的安全來自：預設不開
                bypass、把絕對禁止放進使用者改不掉的 managed 層、需要硬隔離時用容器或沙箱跑。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ② modes */}
      <section className="doc dark" id="modes" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 02</span>
              權限四模式怎麼選
            </h2>
            <p>
              <code>permissions.defaultMode</code> 決定 Claude 動作前要不要問你。企業共用機的重點：
              <strong>絕不要把 bypassPermissions 當預設</strong>。
            </p>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>模式</th>
                    <th>行為</th>
                    <th>企業建議</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>default</td>
                    <td>所有動作都要確認</td>
                    <td>新人 / 共用機的安全預設</td>
                  </tr>
                  <tr>
                    <td>acceptEdits</td>
                    <td>檔案編輯自動、指令仍要確認</td>
                    <td>熟手日常，效率與安全平衡</td>
                  </tr>
                  <tr>
                    <td>plan</td>
                    <td>只提計畫、不執行</td>
                    <td>盤點 / 評估高風險改動時</td>
                  </tr>
                  <tr>
                    <td>bypassPermissions</td>
                    <td>不再確認（除被 deny 的）</td>
                    <td>⚠️ 僅限隔離容器，共用機禁用</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ③ trash */}
      <section className="light doc" id="trash">
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 03</span>
              垃圾桶（給人用的防手誤）
            </h2>
            <p>
              還是值得裝——它保護「你本人手滑」。只是定位要正確：這是防你自己，不是防 AI。
            </p>
            <Code lang="bash" code={TRASH} />
          </div>
        </div>
      </section>

      {/* ④ deny */}
      <section className="doc dark" id="deny" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 04</span>
              危險指令黑名單（防呆層）
            </h2>
            <p>
              把高風險指令加進 <code>permissions.deny</code>，降低誤觸機率。記得它<strong>不是密封沙箱</strong>，只是其中一層。
            </p>
            <Code lang="bash" code={DENY} />
          </div>
        </div>
      </section>

      {/* ⑤ hooks */}
      <section className="light doc" id="hooks">
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 05</span>
              強制執行層：Hooks（真正擋得住）
            </h2>
            <p>
              黑名單與權限模式都是「請 AI 自律」。要<strong>程式化、無條件攔截</strong>，用{" "}
              <code>PreToolUse</code> hook：在工具實際執行前跑你的腳本，腳本說 deny 就一定擋下——不管 Claude 怎麼想。官方也明說「要硬擋就用
              hook，不要靠 CLAUDE.md 或權限提示」。
            </p>
            <Code lang="json" code={HOOKS} />
            <Code lang="bash" code={HOOK_SCRIPT} />
            <ul className="bullets">
              <li>
                <strong>怎麼擋</strong>：腳本 <code>exit 2</code>，或回傳{" "}
                <code>permissionDecision: &quot;deny&quot;</code>，該次工具呼叫就被攔下。
              </li>
              <li>
                <strong>常見用途</strong>：commit 前強制跑 lint/測試、禁止 push main、攔截破壞性指令、把敏感輸出先過濾再給
                AI。
              </li>
              <li>
                <strong>企業佈建</strong>：把 hook 設定放 managed 或專案層、腳本納入佈建腳本，全隊一致且改不掉。
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ⑥ managed */}
      <section className="doc dark" id="managed" style={{ background: "var(--ink)" }}>
        <div className="wrap">
          <div className="lane">
            <h2>
              <span className="num">SECTION 06</span>
              企業護欄（真正的底線）
            </h2>
            <p>
              黑名單放在 user 層，使用者自己能改掉；企業要的是<strong>改不掉的底線</strong>——放進最高優先序的
              <code>managed-settings.json</code>，全機一致、無法關閉。這才是「出事可追、人人一致」的關鍵。
            </p>
            <Code lang="bash" code={MANAGED} />
            <div className="callout">
              <span className="tag">怎麼接進佈建</span>
              <p>
                這一段會由<a href="/guides/claude-code/setup">核心佈建</a>的一鍵腳本一併佈署。安全分層的完整脈絡（四層優先序）也在那頁。
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
