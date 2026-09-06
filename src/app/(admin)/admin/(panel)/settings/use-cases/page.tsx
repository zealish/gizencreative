import path from "node:path";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getUseCaseImages, USE_CASE_IDS } from "@/lib/settings";
import { listFiles } from "@/lib/storage";
import { UseCaseImagePicker } from "./_components/use-case-image-picker";
import { saveUseCaseImages } from "./actions";

export const metadata: Metadata = {
  title: "Use Cases Settings",
  robots: { index: false, follow: false },
};

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);

const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted";

export default async function UseCasesSettingsPage() {
  const t = await getTranslations("admin.settings.useCases");
  const [images, storedFiles] = await Promise.all([
    getUseCaseImages(),
    listFiles(),
  ]);
  const mediaFiles = storedFiles
    .filter((f) => IMAGE_EXTS.has(path.extname(f.name).toLowerCase()))
    .sort(
      (a, b) =>
        new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime(),
    )
    .map(({ name, url }) => ({ name, url }));

  return (
    <div className="card-elegant rounded-3xl p-6 sm:p-8">
      <h2 className="text-xl font-bold tracking-tight">{t("title")}</h2>
      <p className="mt-2 text-sm text-muted">{t("description")}</p>
      <form action={saveUseCaseImages} className="mt-6 space-y-5">
        {USE_CASE_IDS.map((id) => (
          <div key={id} className="space-y-1.5">
            <label htmlFor={`image-${id}`} className={labelClass}>
              {t(`sections.${id}`)}
            </label>
            <UseCaseImagePicker
              name={`image-${id}`}
              defaultValue={images[id]}
              files={mediaFiles}
            />
          </div>
        ))}
        <p className="text-xs text-muted">{t("hint")}</p>
        <button
          type="submit"
          className="rounded-full bg-foreground px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-background shadow-lg transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {t("save")}
        </button>
      </form>
    </div>
  );
}
