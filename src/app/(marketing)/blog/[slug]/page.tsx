import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import {
  getApprovedCommentsByPostId,
  getBlogCategories,
  getPublishedPostBySlug,
  getPublishedPosts,
  localizeBlogPost,
} from "@/lib/blog";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { getSeoOverrides } from "@/lib/settings";
import { BlogCard } from "../_components/blog-card";
import { BlogComments } from "./_components/blog-comments";
import { ShareButtons } from "./_components/share-buttons";

type PageProps = { params: Promise<{ slug: string }> };

// Locale is resolved from cookies/headers per request, so this route
// cannot be statically generated.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const record = await getPublishedPostBySlug(slug);
  if (!record) return {};

  const categories = await getBlogCategories();
  const locale = await getLocale();
  const post = localizeBlogPost(record, locale, categories);
  const seo = await getSeoOverrides();
  const ogImage = seo.ogImage;
  return {
    title: `${post.title} | Gizen Creative`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const record = await getPublishedPostBySlug(slug);
  if (!record) notFound();

  const t = await getTranslations("blog");
  const format = await getFormatter();
  const locale = await getLocale();

  const categories = await getBlogCategories();
  const post = localizeBlogPost(record, locale, categories);
  const allPosts = await getPublishedPosts();
  const approvedComments = await getApprovedCommentsByPostId(record.id);
  const comments = approvedComments.map((comment) => ({
    id: comment.id,
    name: comment.name,
    message: comment.message,
    createdAt: comment.createdAt.toISOString(),
  }));
  const relatedPosts = allPosts
    .filter(
      (candidate) =>
        candidate.slug !== post.slug && candidate.category === record.category,
    )
    .slice(0, 2)
    .map((candidate) => localizeBlogPost(candidate, locale, categories));

  const jsonLd = [
    articleJsonLd({
      title: post.title,
      description: post.excerpt,
      path: `/blog/${post.slug}`,
      datePublished: post.date,
      locale,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
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
              href={`/blog/category/${post.category.slug}`}
              className="transition-opacity hover:opacity-80"
            >
              {post.category.name}
            </Link>
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            {post.title}
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
            className={`relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl bg-gradient-to-br ${post.gradient}`}
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
          </div>
          {post.contentHtml ? (
            <div
              className="rich-text mt-8 text-base leading-relaxed text-foreground/80 sm:mt-10"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: authored by authenticated admins via Tiptap
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          ) : (
            <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/80 sm:mt-10">
              {post.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          )}
          {post.tags.length > 0 ? (
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
                  #{tag}
                </Link>
              ))}
            </div>
          ) : null}
          <div className="mt-8 border-t border-black/10 pt-8 dark:border-white/15">
            <ShareButtons title={post.title} path={`/blog/${post.slug}`} />
          </div>
          <BlogComments postId={record.id} comments={comments} />
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
