"use client";

import { ChevronDownIcon, ChevronUpIcon, PlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const MAX_FEATURES = 20;

const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5";

const iconButtonClass =
  "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/10";

export function FeaturesInput({
  name,
  defaultValue = [],
}: {
  name: string;
  defaultValue?: string[];
}) {
  const t = useTranslations("pricingAdmin");
  const [features, setFeatures] = useState<string[]>(
    defaultValue.length > 0 ? defaultValue : [""],
  );

  function updateFeature(index: number, value: string) {
    setFeatures((prev) =>
      prev.map((entry, position) => (position === index ? value : entry)),
    );
  }

  function removeFeature(index: number) {
    setFeatures((prev) => {
      const next = prev.filter((_, position) => position !== index);
      return next.length > 0 ? next : [""];
    });
  }

  function moveFeature(index: number, direction: -1 | 1) {
    setFeatures((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="space-y-2">
      {features.map((feature, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: rows are positional and reorderable
          key={index}
          className="flex items-center gap-1.5"
        >
          <input
            type="text"
            name={name}
            value={feature}
            maxLength={200}
            placeholder={t("featurePlaceholder")}
            onChange={(event) => updateFeature(index, event.target.value)}
            className={inputClass}
          />
          <button
            type="button"
            aria-label={t("featureMoveUp")}
            disabled={index === 0}
            onClick={() => moveFeature(index, -1)}
            className={iconButtonClass}
          >
            <ChevronUpIcon className="size-4" />
          </button>
          <button
            type="button"
            aria-label={t("featureMoveDown")}
            disabled={index === features.length - 1}
            onClick={() => moveFeature(index, 1)}
            className={iconButtonClass}
          >
            <ChevronDownIcon className="size-4" />
          </button>
          <button
            type="button"
            aria-label={t("featureRemove")}
            onClick={() => removeFeature(index)}
            className={iconButtonClass}
          >
            <XIcon className="size-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        disabled={features.length >= MAX_FEATURES}
        onClick={() => setFeatures((prev) => [...prev, ""])}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:border-black/30 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:hover:border-white/40"
      >
        <PlusIcon className="size-3.5" />
        {t("featureAdd")}
      </button>
    </div>
  );
}
