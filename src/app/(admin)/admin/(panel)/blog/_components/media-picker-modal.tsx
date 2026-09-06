"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { uploadMediaFiles } from "../../media/actions";

export type CoverMediaItem = {
  name: string;
  url: string;
};

export function MediaPickerModal({
  open,
  onCloseAction,
  onSelectAction,
  files,
  selectedUrl,
}: {
  open: boolean;
  onCloseAction: () => void;
  onSelectAction: (url: string) => void;
  files: CoverMediaItem[];
  selectedUrl?: string;
}) {
  const t = useTranslations("admin.blog.form");
  const [query, setQuery] = useState("");
  const [uploaded, setUploaded] = useState<CoverMediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const serverNames = new Set(files.map((f) => f.name));
  const allFiles = [
    ...uploaded.filter((f) => !serverNames.has(f.name)),
    ...files,
  ];
  const visibleFiles = allFiles.filter((f) =>
    f.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      for (const file of Array.from(fileList)) {
        formData.append("files", file);
      }
      const result = await uploadMediaFiles(formData);
      setUploaded((prev) => [...result, ...prev]);
      if (result.length === 1) {
        onSelectAction(result[0].url);
        onCloseAction();
      }
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : t("coverImageUploadError"),
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("coverImageModalTitle")}
    >
      <button
        type="button"
        aria-label={t("coverImageModalClose")}
        onClick={onCloseAction}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div
        data-lenis-prevent
        className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-black/10 bg-background shadow-xl dark:border-white/10 dark:bg-neutral-900"
      >
        <div className="flex items-center justify-between gap-3 border-b border-black/10 p-5 dark:border-white/10">
          <h3 className="text-sm font-bold tracking-tight">
            {t("coverImageModalTitle")}
          </h3>
          <button
            type="button"
            aria-label={t("coverImageModalClose")}
            onClick={onCloseAction}
            className="grid size-7 place-items-center rounded-md text-muted transition-colors hover:text-foreground"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="space-y-4 overflow-y-auto p-5">
          <div className="flex gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("coverImageSearchPlaceholder")}
              className="w-full rounded-xl border border-black/10 bg-background px-4 py-2 text-sm outline-none transition-colors focus:border-accent dark:border-white/10 dark:bg-white/5"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
              multiple
              onChange={(e) => handleUpload(e.target.files)}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {uploading ? t("coverImageUploading") : t("coverImageUpload")}
            </button>
          </div>
          {uploadError ? (
            <p className="text-xs font-semibold text-red-600 dark:text-red-400">
              {uploadError}
            </p>
          ) : null}
          {visibleFiles.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              {t("coverImageEmpty")}
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {visibleFiles.map((file) => {
                const active = file.url === selectedUrl;
                return (
                  <li key={file.name}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectAction(file.url);
                        onCloseAction();
                      }}
                      className={`block w-full overflow-hidden rounded-2xl border text-left transition-colors ${
                        active
                          ? "border-accent ring-2 ring-accent/40"
                          : "border-black/10 dark:border-white/10"
                      } bg-background dark:bg-white/5`}
                    >
                      <span className="relative block aspect-square bg-black/5 dark:bg-white/5">
                        <Image
                          src={file.url}
                          alt={file.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover"
                          unoptimized
                        />
                      </span>
                      <span
                        className="block truncate p-2.5 text-xs font-semibold"
                        title={file.name}
                      >
                        {file.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
