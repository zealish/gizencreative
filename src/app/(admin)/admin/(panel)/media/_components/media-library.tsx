"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { deleteMedia } from "../actions";

export type MediaFileItem = {
  name: string;
  url: string;
  size: number;
  modifiedAt: string;
  isImage: boolean;
  isSvg: boolean;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(1)} ${units[i]}`;
}

function FileIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

export function MediaLibrary({ files }: { files: MediaFileItem[] }) {
  const t = useTranslations("admin.media");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const visibleFiles = files.filter((f) =>
    f.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const selected = files.find((f) => f.name === selectedName) ?? null;

  useEffect(() => {
    if (!selected) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selected]);

  const select = (file: MediaFileItem) => {
    setCopied(false);
    setSelectedName(file.name === selectedName ? null : file.name);
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(
      new URL(url, window.location.origin).toString(),
    );
    setCopied(true);
  };

  return (
    <div className="mt-6 space-y-4">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="w-full rounded-xl border border-black/10 bg-background px-4 py-2 text-sm outline-none transition-colors focus:border-accent lg:max-w-sm dark:border-white/10 dark:bg-white/5"
      />
      <div>
        {visibleFiles.length === 0 ? (
          <p className="text-sm text-muted">{t("searchEmpty")}</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visibleFiles.map((file) => {
              const active = file.name === selectedName;
              return (
                <li key={file.name}>
                  <button
                    type="button"
                    onClick={() => select(file)}
                    className={`block w-full overflow-hidden rounded-2xl border text-left transition-colors ${
                      active
                        ? "border-accent ring-2 ring-accent/40"
                        : "border-black/10 dark:border-white/10"
                    } bg-background dark:bg-white/5`}
                  >
                    <span className="relative block aspect-square bg-black/5 dark:bg-white/5">
                      {file.isImage || file.isSvg ? (
                        <Image
                          src={file.url}
                          alt={file.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className={
                            file.isSvg ? "object-contain p-4" : "object-cover"
                          }
                          unoptimized
                        />
                      ) : (
                        <span className="grid h-full place-items-center text-muted">
                          <FileIcon />
                        </span>
                      )}
                    </span>
                    <span className="block space-y-1 p-3">
                      <span
                        className="block truncate text-xs font-semibold"
                        title={file.name}
                      >
                        {file.name}
                      </span>
                      <span className="block text-xs text-muted">
                        {formatBytes(file.size)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {selected
          ? createPortal(
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-label={t("detailsTitle")}
              >
                <button
                  type="button"
                  aria-label={t("detailsClose")}
                  onClick={() => setSelectedName(null)}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />
                <div
                  data-lenis-prevent
                  className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-black/10 bg-background p-5 shadow-xl dark:border-white/10 dark:bg-neutral-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold tracking-tight">
                      {t("detailsTitle")}
                    </h3>
                    <button
                      type="button"
                      aria-label={t("detailsClose")}
                      onClick={() => setSelectedName(null)}
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
                  <div className="relative mt-4 aspect-square overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
                    {selected.isImage || selected.isSvg ? (
                      // biome-ignore lint/performance/noImgElement: needed to read naturalWidth/naturalHeight
                      <img
                        src={selected.url}
                        alt={selected.name}
                        className="absolute inset-0 h-full w-full object-contain"
                        onLoad={(e) => {
                          const img = e.currentTarget;
                          if (img.naturalWidth > 0) {
                            setDimensions((prev) => ({
                              ...prev,
                              [selected.name]: `${img.naturalWidth} x ${img.naturalHeight} px`,
                            }));
                          }
                        }}
                      />
                    ) : (
                      <span className="grid h-full place-items-center text-muted">
                        <FileIcon />
                      </span>
                    )}
                  </div>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                        {t("detailsName")}
                      </dt>
                      <dd className="mt-0.5 break-all font-medium">
                        {selected.name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                        {t("detailsType")}
                      </dt>
                      <dd className="mt-0.5 font-medium uppercase">
                        {selected.name.split(".").pop()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                        {t("detailsSize")}
                      </dt>
                      <dd className="mt-0.5 font-medium">
                        {formatBytes(selected.size)}
                      </dd>
                    </div>
                    {selected.isImage || selected.isSvg ? (
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                          {t("detailsDimensions")}
                        </dt>
                        <dd className="mt-0.5 font-medium">
                          {dimensions[selected.name] ?? "…"}
                        </dd>
                      </div>
                    ) : null}
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                        {t("detailsModified")}
                      </dt>
                      <dd className="mt-0.5 font-medium">
                        {new Date(selected.modifiedAt).toLocaleString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                        {t("detailsUrl")}
                      </dt>
                      <dd className="mt-0.5 break-all font-medium">
                        {selected.url}
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => copyUrl(selected.url)}
                      className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
                    >
                      {copied ? t("detailsCopied") : t("detailsCopyUrl")}
                    </button>
                    <a
                      href={selected.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
                    >
                      {t("detailsOpen")}
                    </a>
                    <form
                      action={deleteMedia}
                      onSubmit={() => setSelectedName(null)}
                    >
                      <input type="hidden" name="name" value={selected.name} />
                      <button
                        type="submit"
                        className="rounded-full border border-red-600/30 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600/10 dark:text-red-400"
                      >
                        {t("delete")}
                      </button>
                    </form>
                  </div>
                </div>
              </div>,
              document.body,
            )
          : null}
      </div>
    </div>
  );
}
