"use client";

import { lazy, Suspense, useEffect, useState } from "react";

// Defer the tsparticles bundle until the browser is idle so it never
// competes with LCP rendering or blocks the main thread during load.
const ParticlesCanvas = lazy(() =>
  import("./particles-canvas").then((m) => ({ default: m.ParticlesCanvas })),
);

export function HeroParticles() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    // Decorative only: skip entirely on small/coarse-pointer (mobile) devices.
    if (window.matchMedia("(max-width: 767px), (pointer: coarse)").matches) {
      return;
    }
    const start = () => setReady(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 1500);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <ParticlesCanvas />
    </Suspense>
  );
}
