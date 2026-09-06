"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  type CoverMediaItem,
  MediaPickerModal,
} from "../../../blog/_components/media-picker-modal";

const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5";

export function UseCaseImagePicker({
  name,
  defaultValue,
  files,
}: {
  name: string;
  defaultValue?: string;
  files: CoverMediaItem[];
}) {
  const t = useTranslations("admin.settings.useCases");
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="/uploads/background.webp"
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 rounded-2xl border border-black/10 px-4 py-3 text-xs font-semibold transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
        >
          {t("browse")}
        </button>
      </div>
      {value ? (
        <div className="flex items-center gap-3">
          <span className="relative block h-16 w-24 overflow-hidden rounded-xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
            <Image
              src={value}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          </span>
          <button
            type="button"
            onClick={() => setValue("")}
            className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-foreground dark:border-white/15"
          >
            {t("clear")}
          </button>
        </div>
      ) : null}
      <MediaPickerModal
        open={open}
        onCloseAction={() => setOpen(false)}
        onSelectAction={setValue}
        files={files}
        selectedUrl={value}
      />
    </div>
  );
}
