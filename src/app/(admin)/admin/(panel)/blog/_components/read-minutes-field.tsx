"use client";

import { useEffect, useState } from "react";

const WORDS_PER_MINUTE = 200;

function computeMinutes(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(60, Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)));
}

export function ReadMinutesField({
  defaultValue,
  className,
}: {
  defaultValue: number;
  className?: string;
}) {
  const [minutes, setMinutes] = useState(defaultValue);

  useEffect(() => {
    const contentId = document.querySelector('input[name="contentId"]');
    if (!(contentId instanceof HTMLInputElement)) return;

    const update = () => setMinutes(computeMinutes(contentId.value));
    update();
    contentId.addEventListener("input", update);
    return () => contentId.removeEventListener("input", update);
  }, []);

  return (
    <input
      id="readMinutes"
      name="readMinutes"
      type="number"
      readOnly
      value={minutes}
      className={`${className ?? ""} cursor-not-allowed opacity-60`}
    />
  );
}
