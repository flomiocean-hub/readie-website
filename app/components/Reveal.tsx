"use client";

import { useEffect, useRef, ReactNode, ElementType } from "react";

interface RevealProps {
  children?: ReactNode;
  className?: string;
  /** 進場延遲階段：2 → .12s，3 → .24s */
  step?: 2 | 3;
  as?: ElementType;
}

export default function Reveal({
  children,
  className = "",
  step,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

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
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const stepClass = step === 2 ? " s2" : step === 3 ? " s3" : "";
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`reveal${stepClass} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
