"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      /* clipboard 被瀏覽器擋掉時靜默，使用者仍可手動選取 */
    }
  };

  return (
    <button
      type="button"
      className="copy-btn"
      onClick={copy}
      aria-label="複製程式碼"
    >
      {done ? "已複製 ✓" : "複製"}
    </button>
  );
}
