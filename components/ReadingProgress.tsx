"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const start = document.querySelector("[data-progress-start]");
      const end = document.querySelector("[data-progress-end]");
      if (!start || !end) return;
      const startY = start.getBoundingClientRect().top + window.scrollY;
      const endY = end.getBoundingClientRect().bottom + window.scrollY;
      const denom = endY - startY;
      if (denom <= 0) return;
      const p = Math.min(1, Math.max(0, (window.scrollY - startY) / denom));
      setProgress(p);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      data-progress-bar
      className="no-print fixed inset-x-0 top-0 z-50 h-1 bg-border-default"
      aria-hidden
    >
      <div
        className="h-full transition-[width] duration-150"
        style={{
          width: `${progress * 100}%`,
          background: "var(--color-progress-bar)",
        }}
      />
    </div>
  );
}
