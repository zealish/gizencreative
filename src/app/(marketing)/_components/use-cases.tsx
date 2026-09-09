"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { UseCaseId } from "@/lib/settings";

const useCases: { id: UseCaseId; background: string; href: string }[] = [
  {
    id: "website",
    background:
      "radial-gradient(circle at 70% 20%, #2e3338 0%, #16181a 60%), #16181a",
    href: "/services/website-development",
  },
  {
    id: "socialMedia",
    background:
      "radial-gradient(circle at 30% 30%, #1087dd 0%, #0b5d99 55%, #073d66 100%)",
    href: "/services/social-media-management",
  },
  {
    id: "seo",
    background:
      "radial-gradient(circle at 60% 70%, #3a4148 0%, #1c2024 55%, #101214 100%)",
    href: "/services/seo-website",
  },
];

export function UseCases({
  images,
}: {
  images: Partial<Record<UseCaseId, string>>;
}) {
  const t = useTranslations("useCases");
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  // coverage[i] = how far the next panel has scrolled over panel i (0..1)
  const [coverage, setCoverage] = useState<number[]>(() =>
    useCases.map(() => 0),
  );

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      setCoverage(
        useCases.map((_, i) => {
          const next = panelRefs.current[i + 1];
          if (!next) return 0;
          const top = next.getBoundingClientRect().top;
          return Math.min(1, Math.max(0, 1 - top / vh));
        }),
      );
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
    <section id="portofolio">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-10 sm:pb-24 sm:pt-32">
        <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
          {t("title1")}
          <br />
          <span className="text-foreground/50">{t("title2")}</span>
        </h2>
        <p className="mt-5 max-w-2xl text-base text-muted sm:mt-6 sm:text-lg">
          {t("subtitle")}
        </p>
      </div>
      {useCases.map((uc, i) => {
        const c = coverage[i];
        const image = images[uc.id];
        return (
          <div
            key={uc.id}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="sticky top-0 h-svh"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 overflow-hidden will-change-transform"
              style={{
                background: uc.background,
                transform: `scale(${1 - c * 0.06})`,
                opacity: c * 0.5,
                borderRadius: `${c * 1.25}rem`,
                filter: "brightness(0.7)",
              }}
            >
              {image ? (
                <Image
                  src={image}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : null}
            </div>
            <div
              className="relative flex h-full flex-col justify-end overflow-hidden will-change-transform"
              style={{
                background: uc.background,
                transform: `scale(${1 - c * 0.02})`,
                opacity: 1 - c * 0.1,
                borderRadius: `${c * 0.75}rem`,
              }}
            >
              {image ? (
                <Image
                  src={image}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : null}
              <span
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10rem] font-bold leading-none text-white/5 sm:right-8 sm:text-[24rem]"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="relative w-full px-6 pb-16 sm:px-24 sm:pb-24 lg:px-32">
                <h3 className="text-4xl font-bold tracking-tight text-white sm:text-7xl">
                  {t(`items.${uc.id}.title`)}
                </h3>
                <p className="mt-4 max-w-md text-base text-white/80 sm:text-lg">
                  {t(`items.${uc.id}.description`)}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-widest sm:gap-6">
                  <Link
                    data-marketing-action
                    href="/contact"
                    className="group flex items-center gap-2 rounded-full bg-white/15 px-6 py-3.5 text-white backdrop-blur-sm transition-[transform,background-color] duration-200 hover:scale-[1.02] hover:bg-white/25 motion-reduce:transition-none"
                  >
                    {t("start")}
                    <Sparkles className="size-4" aria-hidden="true" />
                  </Link>
                  <Link
                    data-marketing-action
                    href={uc.href}
                    className="group flex items-center gap-2 text-white/80 transition-colors hover:text-white"
                  >
                    {t("learn")}
                    <ArrowRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
