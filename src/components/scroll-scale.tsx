"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollScale({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // 0 when the element top is at the bottom of the viewport,
      // 1 when the element is fully in focus.
      const p =
        (window.innerHeight - rect.top) /
        Math.min(rect.height, window.innerHeight);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`will-change-transform ${className}`}
      style={{
        transform: `scale(${0.85 + progress * 0.15})`,
        opacity: 0.7 + progress * 0.3,
      }}
    >
      {children}
    </div>
  );
}
