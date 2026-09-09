import path from "node:path";
import { getTranslations } from "next-intl/server";
import type { PortfolioProject } from "@/lib/portfolio";
import { listFiles } from "@/lib/storage";
import { CoverImagePicker } from "../../blog/_components/cover-image-picker";

const services = [
  "Website Development",
  "Social Media Management",
  "SEO Website",
] as const;
const imageExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".avif",
]);
const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted";

export async function PortfolioForm({
  action,
  project,
}: {
  action: (data: FormData) => Promise<void>;
  project?: PortfolioProject;
}) {
  const t = await getTranslations("portfolioAdmin");
  const storedFiles = await listFiles();
  const files = storedFiles
    .filter((file) =>
      imageExtensions.has(path.extname(file.name).toLowerCase()),
    )
    .sort(
      (a, b) =>
        new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime(),
    )
    .map(({ name, url }) => ({ name, url }));
  return (
    <form action={action} className="space-y-5">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        {(["projectName", "year", "clientCompany"] as const).map((name) => (
          <div key={name} className="space-y-1.5">
            <label htmlFor={name} className={labelClass}>
              {t(name)}
            </label>
            <input
              id={name}
              name={name}
              type={name === "year" ? "number" : "text"}
              min={name === "year" ? 1900 : undefined}
              max={name === "year" ? 9999 : undefined}
              maxLength={name === "year" ? undefined : 200}
              required
              defaultValue={project?.[name]}
              className={inputClass}
            />
          </div>
        ))}
        <div className="space-y-1.5">
          <label htmlFor="coverImage" className={labelClass}>
            {t("coverImage")}
          </label>
          <CoverImagePicker
            defaultValue={project?.coverImage ?? ""}
            files={files}
          />
        </div>
      </div>
      <fieldset className="space-y-3">
        <legend className={labelClass}>{t("services")}</legend>
        {services.map((service) => (
          <label
            key={service}
            className="flex cursor-pointer items-center gap-3 text-sm font-semibold"
          >
            <input
              type="checkbox"
              name="services"
              value={service}
              defaultChecked={project?.services.includes(service)}
              className="size-4 cursor-pointer accent-foreground"
            />
            {service}
          </label>
        ))}
      </fieldset>
      <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
        <input
          name="published"
          type="checkbox"
          defaultChecked={project?.published ?? false}
          className="size-4 cursor-pointer accent-foreground"
        />
        {t("published")}
      </label>
      <button
        type="submit"
        className="cursor-pointer rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
      >
        {project ? t("save") : t("createButton")}
      </button>
    </form>
  );
}
