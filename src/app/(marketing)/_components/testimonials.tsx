"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const testimonialKeys = ["andi", "sari", "budi", "rina", "dedi"] as const;

const count = testimonialKeys.length;

function QuoteIcon() {
  return (
    <svg
      width="44"
      height="32"
      viewBox="0 0 44 32"
      fill="none"
      aria-hidden="true"
      className="text-accent/40"
    >
      <path
        d="M9.6 32C6.4 32 3.9 30.9 2.1 28.7 0.7 26.8 0 24.5 0 21.8 0 17.9 1.2 13.9 3.6 9.9 6 5.9 9.3 2.6 13.5 0l4.3 4.1c-2.5 1.7-4.6 3.6-6.2 5.7-1.6 2.1-2.5 4-2.7 5.7 1-.4 2-.6 3-.6 2.6 0 4.7.9 6.3 2.6 1.6 1.7 2.4 3.8 2.4 6.3 0 2.4-.9 4.4-2.6 6-1.7 1.5-4.2 2.2-7.4 2.2Z"
        fill="currentColor"
      />
      <path
        d="M32.6 32c-3.2 0-5.7-1.1-7.5-3.3-1.4-1.9-2.1-4.2-2.1-6.9 0-3.9 1.2-7.9 3.6-11.9C29 5.9 32.3 2.6 36.5 0l4.3 4.1c-2.5 1.7-4.6 3.6-6.2 5.7-1.6 2.1-2.5 4-2.7 5.7 1-.4 2-.6 3-.6 2.6 0 4.7.9 6.3 2.6 1.6 1.7 2.4 3.8 2.4 6.3 0 2.4-.9 4.4-2.6 6-1.7 1.5-4.2 2.2-7.4 2.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Testimonials() {
  const t = useTranslations("testimonials");
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / scrollable));
      setProgress(p * (count - 1));
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

  const active = ((Math.round(progress) % count) + count) % count;

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${count * 55 + 100}vh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden px-4">
        <h2 className="text-center text-4xl font-bold tracking-tight sm:text-6xl">
          {t("headingLine1")}
          <br />
          <span className="text-foreground/50">{t("headingLine2")}</span>
        </h2>
        <div className="relative mx-auto mt-10 h-[26rem] w-full sm:mt-16 sm:h-[26rem]">
          {testimonialKeys.map((key, i) => {
            let offset = i - progress;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;
            const abs = Math.abs(offset);
            const closeness = Math.max(0, 1 - abs);
            const isActive = i === active;
            return (
              <figure
                key={key}
                aria-hidden={!isActive}
                className="absolute left-1/2 top-1/2 flex h-[24rem] w-[min(88vw,26rem)] flex-col rounded-[2rem] border border-black/5 bg-white p-6 will-change-transform dark:border-white/10 dark:bg-[#1c2023] sm:h-[23rem] sm:w-[32rem] sm:p-10"
                style={{
                  transform: `translate(calc(-50% + ${offset * 88}%), -50%) scale(${0.94 + closeness * 0.12})`,
                  opacity: 0.8 + closeness * 0.2,
                  zIndex: 10 - Math.round(abs),
                  boxShadow: `0 ${12 + closeness * 20}px ${40 + closeness * 30}px -20px rgba(22,24,26,${0.12 + closeness * 0.13})`,
                  filter: `blur(${abs * 3}px)`,
                }}
              >
                <QuoteIcon />
                <blockquote className="mt-6 text-lg font-medium leading-snug tracking-tight text-foreground/90 sm:mt-7 sm:text-[1.45rem]">
                  “{t(`items.${key}.quote`)}”
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-4 pt-6">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent">
                    {t(`items.${key}.name`)[0]}
                  </span>
                  <div>
                    <p className="text-base font-semibold">
                      {t(`items.${key}.name`)}
                    </p>
                    <p className="text-sm text-foreground/75">
                      {t(`items.${key}.role`)}
                    </p>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
