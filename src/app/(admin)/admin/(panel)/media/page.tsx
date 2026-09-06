import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AdminPageHeader } from "../_components/admin-page-header";
import { type MediaFileItem, MediaLibrary } from "./_components/media-library";
import { uploadMedia } from "./actions";

export const metadata: Metadata = {
  title: "Media",
  robots: { index: false, follow: false },
};

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

const IMAGE_EXTS: Record<string, true> = {
  ".png": true,
  ".jpg": true,
  ".jpeg": true,
  ".webp": true,
  ".gif": true,
  ".avif": true,
};

type MediaFile = MediaFileItem;

async function getMediaFiles(): Promise<MediaFile[]> {
  let entries: string[];
  try {
    entries = await readdir(UPLOADS_DIR);
  } catch {
    return [];
  }

  const files = await Promise.all(
    entries
      .filter((name) => !name.startsWith("."))
      .map(async (name): Promise<MediaFile | null> => {
        const info = await stat(path.join(UPLOADS_DIR, name)).catch(() => null);
        if (!info?.isFile()) return null;
        const ext = path.extname(name).toLowerCase();
        return {
          name,
          url: `/uploads/${name}`,
          size: info.size,
          modifiedAt: info.mtime.toISOString(),
          isImage: IMAGE_EXTS[ext] === true,
          isSvg: ext === ".svg",
        };
      }),
  );

  return files
    .filter((f): f is MediaFile => f !== null)
    .sort(
      (a, b) =>
        new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime(),
    );
}

export default async function MediaPage() {
  const t = await getTranslations("admin.media");
  const files = await getMediaFiles();

  return (
    <section className="mx-auto max-w-6xl">
      <AdminPageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <div className="mt-8 space-y-5">
        <div className="card-elegant rounded-3xl p-6 sm:p-8">
          <h2 className="text-xl font-bold tracking-tight">
            {t("uploadTitle")}
          </h2>
          <p className="mt-2 text-sm text-muted">{t("uploadDescription")}</p>
          <form action={uploadMedia} className="mt-6 space-y-4">
            <input
              type="file"
              name="files"
              multiple
              accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif,image/avif,application/pdf"
              required
              className="block w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-background dark:border-white/15 dark:bg-white/5"
            />
            <p className="text-xs text-muted">{t("uploadHint")}</p>
            <button
              type="submit"
              className="rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-85"
            >
              {t("uploadButton")}
            </button>
          </form>
        </div>
        <div className="card-elegant rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight">
              {t("libraryTitle")}
            </h2>
            <p className="text-sm text-muted">
              {t("fileCount", { count: files.length })}
            </p>
          </div>
          {files.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-dashed border-black/15 p-8 text-center text-sm text-muted dark:border-white/15">
              {t("empty")}
            </p>
          ) : (
            <MediaLibrary files={files} />
          )}
        </div>
      </div>
    </section>
  );
}
