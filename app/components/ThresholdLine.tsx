"use client";

import { useEffect, useRef } from "react";

export default function ThresholdLine() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="wrap">
      <div className="threshold" ref={ref}>
        <div className="line" />
        <div className="tick" />
      </div>
    </div>
  );
}
