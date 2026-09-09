import path from "node:path";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  getBentoCustomImage,
  getCtaDarkImage,
  getUseCaseImages,
  USE_CASE_IDS,
} from "@/lib/settings";
import { listFiles } from "@/lib/storage";
import { UseCaseImagePicker } from "./_components/use-case-image-picker";
import { saveBentoImage, saveCtaDarkImage, saveUseCaseImages } from "./actions";

export const metadata: Metadata = {
  title: "Pages Settings",
  robots: { index: false, follow: false },
};

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);

const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted";

export default async function PagesSettingsPage() {
  const t = await getTranslations("admin.settings.pages");
  const [images, bentoImage, ctaDarkImage, storedFiles] = await Promise.all([
    getUseCaseImages(),
    getBentoCustomImage(),
    getCtaDarkImage(),
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
    <div className="space-y-6">
      <div className="card-elegant rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-bold tracking-tight">
          {t("useCases.title")}
        </h2>
        <p className="mt-2 text-sm text-muted">{t("useCases.description")}</p>
        <form action={saveUseCaseImages} className="mt-6 space-y-5">
          {USE_CASE_IDS.map((id) => (
            <div key={id} className="space-y-1.5">
              <label htmlFor={`image-${id}`} className={labelClass}>
                {t(`useCases.sections.${id}`)}
              </label>
              <UseCaseImagePicker
                name={`image-${id}`}
                defaultValue={images[id]}
                files={mediaFiles}
              />
            </div>
          ))}
          <p className="text-xs text-muted">{t("useCases.hint")}</p>
          <button
            type="submit"
            className="rounded-full bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {t("useCases.save")}
          </button>
        </form>
      </div>
      <div className="card-elegant rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-bold tracking-tight">{t("bento.title")}</h2>
        <p className="mt-2 text-sm text-muted">{t("bento.description")}</p>
        <form action={saveBentoImage} className="mt-6 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="bento-custom" className={labelClass}>
              {t("bento.customLabel")}
            </label>
            <UseCaseImagePicker
              name="bento-custom"
              defaultValue={bentoImage ?? undefined}
              files={mediaFiles}
            />
          </div>
          <p className="text-xs text-muted">{t("bento.hint")}</p>
          <button
            type="submit"
            className="rounded-full bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {t("bento.save")}
          </button>
        </form>
      </div>
      <div className="card-elegant rounded-3xl p-6 sm:p-8">
        <h2 className="text-xl font-bold tracking-tight">
          {t("ctaDark.title")}
        </h2>
        <p className="mt-2 text-sm text-muted">{t("ctaDark.description")}</p>
        <form action={saveCtaDarkImage} className="mt-6 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="cta-dark" className={labelClass}>
              {t("ctaDark.imageLabel")}
            </label>
            <UseCaseImagePicker
              name="cta-dark"
              defaultValue={ctaDarkImage ?? undefined}
              files={mediaFiles}
            />
          </div>
          <p className="text-xs text-muted">{t("ctaDark.hint")}</p>
          <button
            type="submit"
            className="rounded-full bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {t("ctaDark.save")}
          </button>
        </form>
      </div>
    </div>
  );
}
