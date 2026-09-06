import path from "node:path";
import { getTranslations } from "next-intl/server";
import {
  type BlogPostRecord,
  getAllTagsForAdmin,
  getBlogCategories,
} from "@/lib/blog";
import { listFiles } from "@/lib/storage";
import { CategorySelect } from "./category-select";
import { CoverImagePicker } from "./cover-image-picker";
import { DatePickerField } from "./date-picker-field";
import { ReadMinutesField } from "./read-minutes-field";
import { RichTextEditor } from "./rich-text-editor";
import { TagsInput } from "./tags-input";

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);

const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted";

export async function BlogPostForm({
  action,
  post,
}: {
  action: (formData: FormData) => Promise<void>;
  post?: BlogPostRecord;
}) {
  const t = await getTranslations("admin.blog.form");
  const [categories, tagSuggestions, storedFiles] = await Promise.all([
    getBlogCategories(),
    getAllTagsForAdmin(),
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
    <form action={action} className="space-y-5">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="slug" className={labelClass}>
            {t("slug")}
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            defaultValue={post?.slug}
            readOnly={Boolean(post)}
            placeholder="cara-memilih-jasa-website"
            className={`${inputClass} ${post ? "cursor-not-allowed opacity-60" : ""}`}
          />
          {post ? (
            <p className="text-xs text-muted">{t("slugReadonlyHint")}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <span className={labelClass}>{t("category")}</span>
          <CategorySelect
            categories={categories.map(({ slug, nameId, nameEn }) => ({
              slug,
              nameId,
              nameEn,
            }))}
            defaultValue={post?.category}
          />
        </div>
        <div className="space-y-1.5">
          <span className={labelClass}>{t("tags")}</span>
          <TagsInput suggestions={tagSuggestions} defaultValue={post?.tags} />
          <p className="text-xs text-muted">{t("tagsHint")}</p>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="coverImage" className={labelClass}>
            {t("coverImage")}
          </label>
          <CoverImagePicker
            defaultValue={post?.coverImage ?? ""}
            files={mediaFiles}
          />
          <p className="text-xs text-muted">{t("coverImageHint")}</p>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="readMinutes" className={labelClass}>
            {t("readMinutes")}
          </label>
          <ReadMinutesField
            defaultValue={post?.readMinutes ?? 1}
            className={inputClass}
          />
          <p className="text-xs text-muted">{t("readMinutesHint")}</p>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="publishedAt" className={labelClass}>
            {t("publishedAt")}
          </label>
          <DatePickerField
            defaultValue={(post?.publishedAt ?? new Date())
              .toISOString()
              .slice(0, 10)}
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="titleId" className={labelClass}>
            {t("titleId")}
          </label>
          <input
            id="titleId"
            name="titleId"
            type="text"
            required
            defaultValue={post?.titleId}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="titleEn" className={labelClass}>
            {t("titleEn")}
          </label>
          <input
            id="titleEn"
            name="titleEn"
            type="text"
            required
            defaultValue={post?.titleEn}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="excerptId" className={labelClass}>
            {t("excerptId")}
          </label>
          <textarea
            id="excerptId"
            name="excerptId"
            rows={3}
            required
            defaultValue={post?.excerptId}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="excerptEn" className={labelClass}>
            {t("excerptEn")}
          </label>
          <textarea
            id="excerptEn"
            name="excerptEn"
            rows={3}
            required
            defaultValue={post?.excerptEn}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="contentId" className={labelClass}>
            {t("contentId")}
          </label>
          <RichTextEditor
            id="contentId"
            name="contentId"
            defaultValue={post?.contentId}
            mediaFiles={mediaFiles}
          />
          <p className="text-xs text-muted">{t("contentHint")}</p>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="contentEn" className={labelClass}>
            {t("contentEn")}
          </label>
          <RichTextEditor
            id="contentEn"
            name="contentEn"
            defaultValue={post?.contentEn}
            mediaFiles={mediaFiles}
          />
        </div>
      </div>
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? false}
          className="size-4 accent-foreground"
        />
        {t("published")}
      </label>
      <button
        type="submit"
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-85"
      >
        {post ? t("saveButton") : t("createButton")}
      </button>
    </form>
  );
}
