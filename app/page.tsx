import FadeIn from "./components/FadeIn";
import LineMockup from "./components/LineMockup";

// ─────────────────────────────────────────────
// CTA links — fill in before launch
// ─────────────────────────────────────────────
const CALENDLY_URL = "https://line.me/R/ti/p/@784xoqdi";
const LINE_URL = "https://line.me/R/ti/p/@784xoqdi";

// ─────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────
function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pine/95 backdrop-blur-sm border-b border-pine-light">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <span
          className="text-warm font-bold text-xl tracking-wide"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Readie
        </span>
        <a
          href={CALENDLY_URL}
          className="text-sm font-medium bg-ember text-warm px-4 py-2 rounded-full hover:bg-ember-dark transition-colors"
        >
          預約免費諮詢
        </a>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────
function Hero() {
  return (
    <section className="bg-pine min-h-screen flex items-center pt-16">
      <div className="max-w-5xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center w-full">
        <div className="space-y-6">
          <p className="text-ember font-medium text-sm tracking-widest uppercase">
            Readie AI 導入顧問
          </p>
          <h1
            className="text-warm text-4xl lg:text-5xl font-black leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            你的公司導入 AI 了嗎？
          </h1>
          <p className="text-fog text-lg leading-relaxed">
            還是買了工具、開了教育訓練，
            <br className="hidden sm:block" />
            三個月後沒有人在用？
          </p>
          <p className="text-fog-dark text-base leading-relaxed">
            我幫你找出真正值得做的那一件事。
            <br />
            不換系統、不買新軟體，
            <br />
            從你們每天都在用的 LINE 開始。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={CALENDLY_URL}
              className="inline-flex items-center justify-center gap-2 bg-ember text-warm font-medium px-7 py-3.5 rounded-full hover:bg-ember-dark transition-colors text-base"
            >
              預約 20 分鐘免費諮詢 →
            </a>
          </div>
          <p className="text-fog-dark text-sm">
            不需要準備什麼。就是聊聊現在的狀況。
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <LineMockup />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Pain Points
// ─────────────────────────────────────────────
const painPoints = [
  {
    index: "01",
    title: "複製人現象",
    body: "員工把別人的 email 複製給 AI，AI 給答案，再複製傳回去。中間那個人，到底在做什麼？",
  },
  {
    index: "02",
    title: "簡報太完美，沒有靈魂",
    body: "AI 做的簡報版面漂亮、結構完整——但業務拿去報告，卻不知道怎麼解釋裡面的內容。",
  },
  {
    index: "03",
    title: "用了一個月，然後就沒用了",
    body: "剛開始大家很興奮。一個月後，沒有人提了。不是 AI 不好用，是它從來沒有真正接進工作流程。",
  },
  {
    index: "04",
    title: "每個人用不同工具",
    body: "A 用 ChatGPT，B 用 Copilot，C 不信任 AI 所以不用。公司沒有共識，知識沒有累積。",
  },
  {
    index: "05",
    title: "老闆交給年輕人研究",
    body: "「AI 這個我交給你們處理。」結果每個人各用各的，沒有方向，沒有成果。",
  },
  {
    index: "06",
    title: "只有他看得懂",
    body: "公司裡有個厲害的員工用 AI 做了一堆內部工具。他離職的那天，才發現有多危險。",
  },
];

function PainPoints() {
  return (
    <section className="bg-warm py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-ember font-medium text-sm tracking-widest uppercase mb-3">
              你有沒有遇過這些狀況
            </p>
            <h2
              className="text-ink text-3xl lg:text-4xl font-black"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              聽起來很熟悉嗎？
            </h2>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {painPoints.map((item, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className="bg-white rounded-2xl p-6 border border-fog hover:border-ember/40 hover:shadow-md transition-all duration-300 h-full">
                <div className="text-xs font-medium text-ember/70 mb-3 tracking-widest">
                  {item.index}
                </div>
                <h3
                  className="font-bold text-ink text-base mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Services
// ─────────────────────────────────────────────
const services = [
  {
    number: "01",
    name: "AI 導入健檢",
    description:
      "我到你公司聊兩個小時，了解你們現在的工作流程。然後告訴你：哪一件事，最值得從 AI 開始。不是給你一份報告，是給你一個可以馬上動手的方向。",
    price: "NT$5,000–8,000 一次性",
    tag: "入門",
    highlight: false,
  },
  {
    number: "02",
    name: "LINE Bot 建置",
    description:
      "把 AI 接進你們每天都在用的 LINE。業務跟進、客服回覆、內部報告——讓它真的動起來。員工不需要學新 app，老闆不需要改變習慣。",
    price: "NT$15,000–25,000 建置費",
    tag: "主推",
    highlight: true,
  },
  {
    number: "03",
    name: "陪伴顧問",
    description:
      "建好之後，我每個月陪你確認有沒有人在用、哪裡卡住、下一步要做什麼。因為導入失敗，最常發生在第三週。",
    price: "NT$8,000–15,000/月",
    tag: "長期",
    highlight: false,
  },
];

function Services() {
  return (
    <section id="services" className="bg-cream py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-ember font-medium text-sm tracking-widest uppercase mb-3">
              我幫你做的事，只有三件
            </p>
            <h2
              className="text-ink text-3xl lg:text-4xl font-black"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              服務說明
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div
                className={`rounded-2xl p-7 h-full flex flex-col border-2 transition-all duration-300 ${
                  s.highlight
                    ? "bg-pine border-pine text-warm shadow-xl"
                    : "bg-white border-fog hover:border-fog-dark hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-5xl font-black leading-none ${
                      s.highlight ? "text-ember" : "text-fog-dark"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {s.number}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      s.highlight
                        ? "bg-ember/20 text-ember"
                        : "bg-fog text-ink/60"
                    }`}
                  >
                    {s.tag}
                  </span>
                </div>

                <h3
                  className={`text-xl font-bold mb-3 ${
                    s.highlight ? "text-warm" : "text-ink"
                  }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {s.name}
                </h3>
                <p
                  className={`text-sm leading-relaxed flex-1 ${
                    s.highlight ? "text-fog" : "text-gray-500"
                  }`}
                >
                  {s.description}
                </p>
                <div
                  className={`mt-5 pt-4 border-t font-medium text-sm ${
                    s.highlight
                      ? "border-pine-light text-ember"
                      : "border-fog text-ink"
                  }`}
                >
                  → {s.price}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Philosophy
// ─────────────────────────────────────────────
function Philosophy() {
  return (
    <section className="bg-pine py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <FadeIn>
          <p className="text-ember font-medium text-sm tracking-widest uppercase mb-6">
            為什麼這樣做
          </p>
          <h2
            className="text-warm text-3xl lg:text-4xl font-black mb-10 leading-snug"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            慢，才是真的快
          </h2>
        </FadeIn>

        <FadeIn delay={150}>
          <div className="space-y-5 text-fog text-base lg:text-lg leading-relaxed text-left">
            <p>
              我見過太多公司，一次導入十個功能，三個月後沒有一個在用。
            </p>
            <p className="font-medium text-warm text-lg lg:text-xl">
              所以我只做一件事。
            </p>
            <p>
              做完，讓大家真的用起來。確認有效，才做下一件。
            </p>
            <p>
              這樣的速度聽起來很慢。但兩年後，你的公司會有一個別人複製不走的東西——一套真正屬於你們的工作方式，和一個準備好接上任何新技術的數位基礎。
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={300}>
          <div className="mt-12 border-t border-pine-light pt-10">
            <p
              className="text-warm text-2xl font-black italic"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              「工具會過時。流程不會。」
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// About
// ─────────────────────────────────────────────
function About() {
  return (
    <section id="about" className="bg-warm py-20 px-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <FadeIn className="lg:order-2">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-56 h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-xl border-4 border-fog">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/marco.jpg"
                  alt="Marco Liu"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-ember text-warm text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
                19 年產業經驗
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="lg:order-1" delay={100}>
          <div className="space-y-5">
            <p className="text-ember font-medium text-sm tracking-widest uppercase">
              你在跟誰說話
            </p>
            <h2
              className="text-ink text-3xl lg:text-4xl font-black leading-snug"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              我是 Marco Liu
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                做了 19 年醫療影像和國際業務，跑過台灣、越南、馬來西亞、印度、太平洋島國——在每一個地方，我學到的都是同一件事：
              </p>
              <p className="font-medium text-ink text-lg border-l-4 border-ember pl-4">
                技術本身不重要。重要的是，它有沒有真正被人用起來。
              </p>
              <p>
                現在我用同樣的邏輯，幫台灣中小企業把 AI 接進真實的工作流程。
              </p>
              <p>不是賣工具。是陪你走過那段最難的路。</p>
            </div>
            <div className="pt-2">
              <span className="inline-block bg-fog text-ink text-sm font-medium px-4 py-2 rounded-full">
                AI 導入顧問｜Readie 創辦人
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// CTA
// ─────────────────────────────────────────────
function CallToAction() {
  return (
    <section className="bg-ember py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <FadeIn>
          <h2
            className="text-warm text-3xl lg:text-4xl font-black mb-4 leading-snug"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            你的公司現在卡在哪裡？
          </h2>
          <p className="text-warm/90 text-lg mb-2">
            不需要準備什麼。就是聊聊你現在的狀況。
          </p>
          <p className="text-warm/80 text-base mb-10">20 分鐘，免費。</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={CALENDLY_URL}
              className="inline-flex items-center justify-center gap-2 bg-pine text-warm font-medium px-7 py-3.5 rounded-full hover:bg-pine-light transition-colors text-base shadow-lg"
            >
              預約免費諮詢 →
            </a>
            <a
              href={LINE_URL}
              className="inline-flex items-center justify-center gap-2 bg-white/20 border border-white/40 text-warm font-medium px-7 py-3.5 rounded-full hover:bg-white/30 transition-colors text-base"
            >
              先加 LINE，慢慢來也可以
            </a>
          </div>

        </FadeIn>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#111A1A] py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-10 mb-10">
          <div>
            <p
              className="text-warm font-bold text-xl mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Readie
            </p>
            <p className="text-fog-dark text-sm leading-relaxed">
              幫每家公司，
              <br />
              準備好迎接下一個時代。
            </p>
          </div>

          <div>
            <p className="text-fog text-xs font-medium uppercase tracking-widest mb-3">
              快速連結
            </p>
            <div className="space-y-2">
              {[
                { label: "服務說明", href: "#services" },
                { label: "關於 Marco", href: "#about" },
                { label: "預約諮詢", href: CALENDLY_URL },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-fog-dark text-sm hover:text-warm transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-fog text-xs font-medium uppercase tracking-widest mb-3">
              聯絡方式
            </p>
            <div className="space-y-2 text-fog-dark text-sm">
              <p>readie.tw</p>
              <a
                href={LINE_URL}
                className="block hover:text-warm transition-colors"
              >
                LINE：Marco @ Readie
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-pine-light pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-fog-dark text-xs">
            © 2025 Readie. All rights reserved.
          </p>
          <p className="text-fog-dark text-xs">Made in Taiwan</p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PainPoints />
        <Services />
        <Philosophy />
        <About />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
