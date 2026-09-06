"use client";

import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useMemo, useState } from "react";

function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

export function ParticlesCanvas() {
  const isDark = useIsDark();

  const options = useMemo<ISourceOptions>(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 60,
      detectRetina: true,
      background: { color: { value: "transparent" } },
      particles: {
        number: {
          value: 50,
          density: { enable: true, width: 1920, height: 1080 },
        },
        color: {
          value: isDark
            ? ["#34d399", "#fbbf24", "#38bdf8"]
            : ["#0d8a59", "#b45309", "#0369a1"],
        },
        shape: { type: "circle" },
        opacity: {
          value: isDark ? { min: 0.2, max: 0.5 } : { min: 0.3, max: 0.6 },
        },
        size: { value: { min: 1, max: 3 } },
        links: {
          enable: true,
          distance: 140,
          color: isDark ? "#34d399" : "#0d8a59",
          opacity: isDark ? 0.25 : 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.8,
          outModes: { default: "out" },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
        },
        modes: {
          grab: { distance: 160, links: { opacity: 0.4 } },
        },
      },
    }),
    [isDark],
  );

  return (
    <ParticlesProvider init={loadSlim}>
      <Particles
        key={isDark ? "dark" : "light"}
        id="hero-particles"
        options={options}
        className="pointer-events-none absolute inset-0 [&>canvas]:!pointer-events-auto"
      />
    </ParticlesProvider>
  );
}
