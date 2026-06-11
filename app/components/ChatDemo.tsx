"use client";

import { useEffect, useRef, useState } from "react";

const MESSAGES = [
  { text: "嗨，我是 Readie 👋", delay: 400, you: false },
  { text: "先問你一個問題就好——", delay: 1400, you: false },
  {
    text: "你公司裡，每天重複在做、卻沒有人想做的那件事，是什麼？",
    delay: 2600,
    you: false,
  },
  { text: "每天手動整理客戶的跟進進度…", delay: 4600, you: true },
  { text: "很好，那就是最值得從 AI 開始的地方。", delay: 6000, you: false },
];

export default function ChatDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);

  // 進入視窗才開始播放，避免訪客還沒看到戲就演完了
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(MESSAGES.length);
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started || shown >= MESSAGES.length) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    MESSAGES.forEach((m, i) => {
      if (i < shown) return;
      if (m.delay > 500) {
        timers.push(setTimeout(() => setTyping(true), m.delay - 700));
      }
      timers.push(
        setTimeout(() => {
          setTyping(false);
          setShown(i + 1);
        }, m.delay)
      );
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return (
    <div className="phone rise d3" ref={ref} aria-label="Readie LINE 對話示意">
      <div className="phone-top">
        <div className="avatar">R</div>
        <div className="who">
          Readie<small>AI 導入顧問・線上</small>
        </div>
      </div>
      <div className="stream">
        {MESSAGES.map((m, i) => (
          <div
            key={i}
            className={`msg${m.you ? " you" : ""}${i < shown ? " show" : ""}`}
          >
            {m.text}
          </div>
        ))}
        <div className={`typing${typing ? " show" : ""}`}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
