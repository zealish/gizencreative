import Image from "next/image";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";

import type { LocalizedBlogPost } from "@/lib/blog-shared";

export function BlogCard({ post }: { post: LocalizedBlogPost }) {
  const t = useTranslations("blog");
  const format = useFormatter();

  return (
    <article className="card-elegant group flex h-full flex-col overflow-hidden rounded-3xl">
      <Link
        href={`/blog/${post.slug}`}
        className={`relative block aspect-[16/9] bg-gradient-to-br ${post.gradient}`}
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            unoptimized
            className="object-cover"
          />
        ) : null}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground">
          {post.category.name}
        </span>
        <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
          <span className="rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-foreground shadow-lg">
            {t("readArticle")}
          </span>
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          {format.dateTime(new Date(post.date), {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          {" · "}
          {t("readTime", { minutes: post.readMinutes })}
        </p>
        <h3 className="mt-3 text-lg font-bold">
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors hover:text-accent"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag}`}
              className="rounded-full bg-accent-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent transition-opacity hover:opacity-80"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
