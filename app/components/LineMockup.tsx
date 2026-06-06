"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  from: "user" | "readie";
  text: string;
  delay: number;    // ms after previous message appears
  typingMs: number; // ms the typing indicator shows (readie only)
};

const MESSAGES: Message[] = [
  {
    from: "user",
    text: "老闆叫我研究 AI，但我不知道從哪裡開始…",
    delay: 600,
    typingMs: 0,
  },
  {
    from: "readie",
    text: "先不要急著買工具。\n告訴我，你們公司現在最花時間的工作是什麼？",
    delay: 600,
    typingMs: 1200,
  },
  {
    from: "user",
    text: "每天回客戶 LINE 就要花一兩個小時…",
    delay: 800,
    typingMs: 0,
  },
  {
    from: "readie",
    text: "好，那我們就從這裡開始。\n這是可以立刻做、立刻有感的那一件事。",
    delay: 500,
    typingMs: 1400,
  },
  {
    from: "user",
    text: "需要換系統嗎？",
    delay: 900,
    typingMs: 0,
  },
  {
    from: "readie",
    text: "不用。你們員工繼續用 LINE，後面我幫你接上 AI。\n老闆不需要改變習慣。",
    delay: 500,
    typingMs: 1300,
  },
  {
    from: "user",
    text: "那多快可以開始？",
    delay: 800,
    typingMs: 0,
  },
  {
    from: "readie",
    text: "先聊 20 分鐘，我評估一下你們現在的狀況。\n免費。",
    delay: 500,
    typingMs: 1000,
  },
];

function TypingDots() {
  return (
    <div className="flex justify-end">
      <div className="bg-[#06C755] rounded-xl rounded-tr-none px-4 py-2.5 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/80 inline-block"
            style={{
              animation: `bounce 1s infinite`,
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function LineMockup() {
  const [visible, setVisible] = useState<number>(0);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function run() {
      for (let i = 0; i < MESSAGES.length; i++) {
        const msg = MESSAGES[i];

        // wait before showing next message (or typing indicator)
        await new Promise<void>((res) => {
          timer = setTimeout(res, msg.delay);
        });
        if (cancelled) return;

        if (msg.from === "readie" && msg.typingMs > 0) {
          setTyping(true);
          await new Promise<void>((res) => {
            timer = setTimeout(res, msg.typingMs);
          });
          if (cancelled) return;
          setTyping(false);
        }

        setVisible((v) => v + 1);
      }
    }

    run();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // scroll to bottom whenever visible count or typing changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visible, typing]);

  return (
    <div className="bg-[#EFEFEF] rounded-2xl w-full max-w-xs shadow-xl border border-fog overflow-hidden">
      {/* header */}
      <div className="bg-white px-4 py-3 flex items-center gap-2 border-b border-fog">
        <div className="w-8 h-8 rounded-full bg-pine flex items-center justify-center text-warm text-xs font-bold shrink-0">
          R
        </div>
        <div>
          <p className="text-ink font-medium text-sm leading-tight">
            Marco @ Readie
          </p>
          <p className="text-xs text-gray-400">AI 導入顧問</p>
        </div>
      </div>

      {/* chat area */}
      <div className="h-72 overflow-y-auto px-3 py-3 space-y-2.5 scroll-smooth">
        {MESSAGES.slice(0, visible).map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === "user" ? "justify-start" : "justify-end"} animate-fadeUp`}
          >
            <div
              className={`text-sm px-3 py-2 rounded-xl max-w-[82%] leading-relaxed whitespace-pre-line shadow-sm ${
                msg.from === "user"
                  ? "bg-white text-ink rounded-tl-none"
                  : "bg-[#06C755] text-white rounded-tr-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {typing && <TypingDots />}

        <div ref={bottomRef} />
      </div>

      {/* input bar */}
      <div className="bg-white px-3 py-2 flex items-center gap-2 border-t border-fog">
        <div className="flex-1 bg-[#EFEFEF] rounded-full px-3 py-1.5 text-xs text-gray-400">
          輸入訊息…
        </div>
        <div className="w-7 h-7 rounded-full bg-[#06C755] flex items-center justify-center shrink-0">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
          animation: fadeUp 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}
