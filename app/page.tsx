import Image from "next/image";
import StickyBar from "./components/StickyBar";
import ChatDemo from "./components/ChatDemo";
import Reveal from "./components/Reveal";
import ThresholdLine from "./components/ThresholdLine";
import TrackedLink from "./components/TrackedLink";

// ─────────────────────────────────────────────
// CTA links（UTM 只加在 Calendly；LINE 深層連結不加參數，避免導轉失敗）
// ─────────────────────────────────────────────
const CALENDLY = (medium: string) =>
  `https://calendly.com/flomiocean/30min?utm_source=website&utm_medium=${medium}`;
const LINE_URL = "https://line.me/R/ti/p/@784xoqdi";

// ─────────────────────────────────────────────
// 內容資料
// ─────────────────────────────────────────────
const PAINS = [
  {
    name: "複製人現象",
    desc: "員工把別人的 email 複製給 AI，AI 給答案，再複製傳回去。中間那個人，到底在做什麼？",
  },
  {
    name: "簡報太完美，沒有靈魂",
    desc: "AI 做的簡報版面漂亮、結構完整——但業務拿去報告，卻不知道怎麼解釋裡面的內容。",
  },
  {
    name: "用了一個月，然後就沒用了",
    desc: "剛開始大家很興奮。一個月後，沒有人提了。不是 AI 不好用，是它從來沒有真正接進工作流程。",
  },
  {
    name: "每個人用不同工具",
    desc: "A 用 ChatGPT，B 用 Copilot，C 不信任 AI 所以不用。公司沒有共識，知識沒有累積。",
  },
  {
    name: "老闆交給年輕人研究",
    desc: "「AI 這個我交給你們處理。」結果每個人各用各的，沒有方向，沒有成果。",
  },
  {
    name: "只有他看得懂",
    desc: "公司裡有個厲害的員工用 AI 做了一堆內部工具。他離職的那天，才發現有多危險。",
  },
];

const SERVICES = [
  {
    step: "01",
    tier: "入門",
    title: "AI 導入健檢",
    desc: "我到你公司聊兩個小時，了解你們現在的工作流程。然後告訴你：哪一件事，最值得從 AI 開始。不是給你一份報告，是給你一個可以馬上動手的方向。",
    price: "NT$8,000–12,000",
    unit: "一次性",
    featured: false,
    badge: null,
  },
  {
    step: "02",
    tier: "主推",
    title: "AI 工作流程建置",
    desc: "對台灣多數中小企業來說，LINE 是員工每天都在開的工具，是最低阻力的起點。我們把 AI 邏輯接進去，讓業務跟進、客服回覆、內部報告真的動起來——員工不需要學新 app，老闆不需要改變習慣。",
    price: "NT$25,000–45,000",
    unit: "建置費",
    featured: true,
    badge: "最多人從這裡開始",
  },
  {
    step: "03",
    tier: "長期",
    title: "陪伴顧問",
    desc: "建好之後，我每個月陪你確認有沒有人在用、哪裡卡住、下一步要做什麼。因為導入失敗，最常發生在第三週。",
    price: "NT$8,000–15,000",
    unit: "每月",
    featured: false,
    badge: null,
  },
];

const FAQS = [
  {
    q: "AI 導入需要換系統或買新軟體嗎？",
    a: "不需要。我們從你們每天已經在用的 LINE 開始，員工不需要學新 app，老闆不需要改變習慣。",
  },
  {
    q: "費用大概多少？",
    a: "服務分三個層次：AI 導入健檢 NT$8,000–12,000（一次性）、AI 工作流程建置 NT$25,000–45,000（建置費）、陪伴顧問 NT$8,000–15,000/月。可以從健檢開始，確認方向再決定下一步。",
  },
  {
    q: "適合什麼規模的公司？",
    a: "主要服務 5–50 人的台灣中小企業。規模不是重點，重點是你們有沒有每天重複在做、卻沒有人想做的事——那就是 AI 最適合介入的地方。",
  },
  {
    q: "多久可以看到效果？",
    a: "第一個月通常就能感受到。我只做一件事，做完確認有效再做下一件，不會讓你等三個月才看到結果。",
  },
  {
    q: "要準備什麼才能開始？",
    a: "不需要準備任何東西。第一步是預約 20 分鐘免費諮詢，聊聊你們現在的工作狀況，我來判斷哪裡最值得開始。",
  },
  {
    q: "跟一般 AI 課程或工具有什麼不同？",
    a: "課程教你怎麼用工具，但沒有人陪你把工具接進真實的工作流程。Readie 做的是後半段——確保 AI 真的被員工用起來，不是買了就放著。",
  },
  {
    q: "為什麼叫 Readie？",
    a: "台灣大多數中小企業都知道 AI 很重要，但真正把它用起來的其實很少。不是不想，是還沒準備好。Readie 的存在，就是縮短這段距離——讓更多企業從「知道 AI 重要」，變成「真的準備好了」。名字就是使命。",
  },
];

// 客戶見證版位：有素材後填入即自動顯示（quote / name / title 三欄）
const TESTIMONIALS: { quote: string; name: string; title: string }[] = [];

// ─────────────────────────────────────────────
// JSON-LD 結構化資料
// ─────────────────────────────────────────────
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://readie.ai/#service",
      name: "Readie AI 導入顧問",
      url: "https://readie.ai",
      email: "marco@readie.ai",
      description:
        "台灣 AI 導入顧問服務。不換系統、不買新軟體，從 LINE 開始，幫 5–50 人的中小企業把 AI 接進真實工作流程。",
      areaServed: { "@type": "Country", name: "Taiwan" },
      priceRange: "NT$8,000–NT$45,000",
      founder: {
        "@type": "Person",
        name: "Marco Liu",
        jobTitle: "AI 導入顧問",
        image: "https://readie.ai/marco.jpg",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://readie.ai/#faq",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

// ─────────────────────────────────────────────
// 區塊
// ─────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero" id="top">
      <div className="vlabel">跨　過　那　條　線</div>
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <p className="eyebrow rise d1">AI 導入顧問</p>
            <h1 className="hook rise d2">
              你的公司
              <br />
              導入 AI 了嗎？
            </h1>
            <p className="sub rise d3">
              還是買了工具、開了教育訓練，三個月後沒有人在用？
            </p>
            <p className="promise rise d4">
              我幫你找出真正值得做的那一件事——不換系統、不改習慣，AI
              直接接進你現有的工作流程。
            </p>
            <div className="ctas rise d5">
              <TrackedLink
                className="btn btn-primary"
                href={CALENDLY("hero")}
                event="cta_calendly"
                location="hero"
              >
                預約 20 分鐘免費諮詢 →
              </TrackedLink>
              <TrackedLink
                className="btn btn-ghost"
                href={LINE_URL}
                event="cta_line"
                location="hero"
              >
                加 LINE 立刻體驗 →
              </TrackedLink>
            </div>
            <p className="hero-note rise d6">
              加入後，AI 顧問 Readie
              馬上問你幾個問題，幫你找出最值得開始的那一件事。
            </p>
          </div>
          <ChatDemo />
        </div>
      </div>
    </section>
  );
}

function Pains() {
  return (
    <section className="pains" id="pains">
      <div className="wrap">
        <Reveal className="sec-head">
          <p className="eyebrow">你有沒有遇過這些狀況</p>
          <h2 className="sec-title">聽起來很熟悉嗎？</h2>
        </Reveal>
        <div className="pain-list">
          {PAINS.map((p) => (
            <Reveal className="pain" key={p.name}>
              <h3 className="pain-name">{p.name}</h3>
              <p className="pain-desc">{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Grain({ id }: { id: string }) {
  return (
    <svg className="grain" aria-hidden="true">
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}

function Quote() {
  return (
    <section className="light quote">
      <Grain id="n1" />
      <div className="wrap">
        <Reveal as="p" className="eyebrow">
          為什麼做 Readie
        </Reveal>
        <Reveal as="h2" className="q-line" step={2}>
          不是讓你用 AI，
          <br />
          而是讓 AI <span className="accent">成為你</span>。
        </Reveal>
        <div className="q-foot">
          <Reveal as="p" className="q-support" step={2}>
            AI
            工具普及之後，門檻不再是「你會不會用
            AI」，而是「你能不能用 AI
            放大你自己的價值」。問題從來不是工具不夠好，而是沒有人幫企業把自己的文化、語言、邏輯放進去。Readie
            做的就是這件事——陪你打造一個真正屬於你的 AI 協調者。
          </Reveal>
          <Reveal as="p" className="q-by" step={3}>
            Marco Liu<span>Readie 創辦人・19 年產業經驗</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;
  return (
    <section className="light testi" id="testimonials">
      <Grain id="n5" />
      <div className="wrap">
        <Reveal className="sec-head">
          <p className="eyebrow">客戶怎麼說</p>
          <h2 className="sec-title">真實的聲音</h2>
        </Reveal>
        <div className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <Reveal className="testi-card" key={i} step={i === 0 ? undefined : 2}>
              <p className="testi-quote">「{t.quote}」</p>
              <p className="testi-by">
                <strong>{t.name}</strong>｜{t.title}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="light services" id="services">
      <Grain id="n2" />
      <div className="wrap">
        <Reveal className="sec-head">
          <p className="eyebrow">我幫你做的事，只有三件</p>
          <h2 className="sec-title">服務說明</h2>
        </Reveal>
        {SERVICES.map((s) => (
          <Reveal
            className={`svc${s.featured ? " featured" : ""}`}
            key={s.step}
          >
            <div className="svc-step">
              {s.step}
              <small>{s.tier}</small>
            </div>
            <div>
              {s.badge && <span className="svc-badge">{s.badge}</span>}
              <h3 className="svc-title">{s.title}</h3>
              <p className="svc-desc">{s.desc}</p>
            </div>
            <div className="svc-price">
              {s.price}
              <small>{s.unit}</small>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="light about" id="about">
      <Grain id="n3" />
      <div className="wrap">
        <div className="about-grid">
          <Reveal className="portrait">
            <Image
              src="/marco.jpg"
              alt="Marco Liu — Readie 創辦人"
              width={627}
              height={627}
              sizes="(max-width: 860px) 90vw, 40vw"
            />
          </Reveal>
          <Reveal className="about-body" step={2}>
            <p className="eyebrow">你在跟誰說話</p>
            <h2 className="sec-title">我是 Marco Liu</h2>
            <p>
              做了 19
              年醫療影像和國際業務，跑過台灣、越南、馬來西亞、印度、太平洋島國——在每一個地方，我學到的都是同一件事：
            </p>
            <p className="lede">
              技術本身不重要。重要的是，它有沒有真正被人用起來。
            </p>
            <p>
              現在我用同樣的邏輯，幫台灣中小企業把 AI
              接進真實的工作流程。工程師出身讓我看懂技術能做什麼，業務經驗讓我知道組織需要什麼。這兩件事加在一起，才能做真正有用的
              AI 導入。
            </p>
            <p>不是賣工具。是陪你走過那段最難的路。</p>
            <p className="about-sign">
              Marco Liu<span>AI 導入顧問｜Readie 創辦人</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="light faq" id="faq">
      <Grain id="n4" />
      <div className="wrap">
        <Reveal className="sec-head">
          <p className="eyebrow">常見問題</p>
          <h2 className="sec-title">你可能想知道的事</h2>
        </Reveal>
        <Reveal className="faq-list">
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>
                {f.q}
                <span className="x" />
              </summary>
              <p className="faq-a">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final">
      <div className="final-line" aria-hidden="true" />
      <div className="wrap">
        <Reveal as="h2" className="final-title">
          你的公司，
          <br />
          現在卡在哪裡？
        </Reveal>
        <Reveal as="p" step={2}>
          不需要準備什麼。就是聊聊你現在的狀況。20 分鐘，免費。
        </Reveal>
        <Reveal className="ctas" step={3}>
          <TrackedLink
            className="btn btn-primary"
            href={CALENDLY("final")}
            event="cta_calendly"
            location="final"
          >
            預約免費諮詢 →
          </TrackedLink>
          <TrackedLink
            className="btn btn-ghost"
            href={LINE_URL}
            event="cta_line"
            location="final"
          >
            加 LINE 立刻體驗 →
          </TrackedLink>
        </Reveal>
        <Reveal as="p" className="final-note" step={3}>
          加入後，AI 顧問 Readie
          馬上問你幾個問題，幫你找出最值得開始的那一件事。
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="mark">
              Readie<span className="dot">.</span>
            </div>
            <p className="foot-tag">
              幫每家公司，
              <br />
              準備好迎接下一個時代。
            </p>
          </div>
          <div>
            <p className="foot-h">快速連結</p>
            <a href="#services">服務說明</a>
            <a href="#about">關於 Marco</a>
            <a
              href={CALENDLY("footer")}
              target="_blank"
              rel="noopener noreferrer"
            >
              預約諮詢
            </a>
          </div>
          <div>
            <p className="foot-h">聯絡方式</p>
            <ul>
              <li>
                <a href="https://readie.ai">readie.ai</a>
              </li>
              <li>
                <a href="mailto:marco@readie.ai">marco@readie.ai</a>
              </li>
              <li>
                <a
                  href={LINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LINE：Marco @ Readie
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>© {new Date().getFullYear()} Readie. All rights reserved.</span>
          <span>Made in Taiwan</span>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <StickyBar />
      <main>
        <Hero />
        <Pains />
        <ThresholdLine />
        <Quote />
        <Testimonials />
        <Services />
        <About />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
