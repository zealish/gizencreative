import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { BlogCard } from "../_components/blog-card";
import {
  blogPosts,
  findPostBySlug,
  postContentParagraphs,
} from "../_components/blog-data";
import { BlogComments } from "./_components/blog-comments";
import { ShareButtons } from "./_components/share-buttons";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = findPostBySlug(slug);
  if (!post) return {};

  const t = await getTranslations("blog");

  return {
    title: `${t(`posts.${post.key}.title`)} | Gizen Creative`,
    description: t(`posts.${post.key}.excerpt`),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: t(`posts.${post.key}.title`),
      description: t(`posts.${post.key}.excerpt`),
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = findPostBySlug(slug);
  if (!post) notFound();

  const t = await getTranslations("blog");
  const format = await getFormatter();

  const title = t(`posts.${post.key}.title`);
  const relatedPosts = blogPosts
    .filter(
      (candidate) =>
        candidate.slug !== post.slug && candidate.category === post.category,
    )
    .slice(0, 2);

  const jsonLd = [
    articleJsonLd({
      title,
      description: t(`posts.${post.key}.excerpt`),
      path: `/blog/${post.slug}`,
      datePublished: post.date,
      locale: await getLocale(),
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: title, path: `/blog/${post.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <article className="px-4 pb-14 pt-28 sm:pb-20 sm:pt-36">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-foreground"
          >
            <span aria-hidden="true">←</span> {t("detail.backToBlog")}
          </Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-wider text-accent">
            <Link
              href={`/blog/category/${post.category}`}
              className="transition-opacity hover:opacity-80"
            >
              {t(`categories.${post.category}`)}
            </Link>
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">
            {format.dateTime(new Date(post.date), {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" · "}
            {t("readTime", { minutes: post.readMinutes })}
          </p>
          <div
            aria-hidden="true"
            className={`mt-8 aspect-[16/9] rounded-3xl bg-gradient-to-br ${post.gradient}`}
          />
          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/80 sm:mt-10">
            {postContentParagraphs.map((paragraph) => (
              <p key={paragraph}>
                {t(`posts.${post.key}.content.${paragraph}`)}
              </p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {t("detail.tagsTitle")}
            </p>
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="rounded-full bg-accent-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent transition-opacity hover:opacity-80"
              >
                #{t(`tags.${tag}`)}
              </Link>
            ))}
          </div>
          <div className="mt-8 border-t border-black/10 pt-8 dark:border-white/15">
            <ShareButtons title={title} path={`/blog/${post.slug}`} />
          </div>
          <BlogComments />
        </div>
      </article>
      {relatedPosts.length > 0 ? (
        <section className="px-4 pb-14 sm:pb-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-5xl">
              {t("detail.relatedTitle")}
            </h2>
            <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2">
              {relatedPosts.map((relatedPost, index) => (
                <Reveal key={relatedPost.slug} delay={index * 100}>
                  <BlogCard post={relatedPost} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
