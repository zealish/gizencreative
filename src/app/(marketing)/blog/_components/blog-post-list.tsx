import Link from "next/link";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/reveal";
import type { LocalizedBlogPost } from "@/lib/blog-shared";
import { BlogCard } from "./blog-card";

export function BlogPostList({
  eyebrow,
  title,
  subtitle,
  posts,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  posts: LocalizedBlogPost[];
}) {
  const t = useTranslations("blog");

  return (
    <>
      <section className="px-4 pb-10 pt-28 text-center sm:pb-12 sm:pt-36">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted sm:mt-6 sm:text-lg">
            {subtitle}
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-block text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-foreground"
          >
            <span aria-hidden="true">←</span> {t("allPosts")}
          </Link>
        </div>
      </section>
      <section className="px-4 pb-14 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          {posts.length === 0 ? (
            <p className="text-center text-sm text-muted">{t("empty")}</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Reveal key={post.slug} delay={Math.min(index * 100, 300)}>
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
