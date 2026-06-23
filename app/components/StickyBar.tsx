"use client";

import { useEffect, useState } from "react";
import TrackedLink from "./TrackedLink";

const CALENDLY_URL =
  "https://calendly.com/flomiocean/30min?utm_source=website&utm_medium=navbar";

export default function StickyBar() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`bar${solid ? " solid" : ""}`}>
      <div className="wrap">
        <a className="mark" href="#top">
          Readie<span className="dot">.</span>
        </a>
        <nav className="nav">
          <a href="#pains">熟悉的狀況</a>
          <a href="#services">服務說明</a>
          <a href="#about">關於我</a>
          <a href="#faq">常見問題</a>
          <TrackedLink
            className="bar-cta"
            href={CALENDLY_URL}
            event="cta_calendly"
            location="navbar"
          >
            預約免費諮詢
          </TrackedLink>
        </nav>
      </div>
    </header>
  );
}
