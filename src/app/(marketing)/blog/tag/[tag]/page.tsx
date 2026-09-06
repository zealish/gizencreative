import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { blogPosts, blogTags, isBlogTag } from "../../_components/blog-data";
import { BlogPostList } from "../../_components/blog-post-list";

type PageProps = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return blogTags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag } = await params;
  if (!isBlogTag(tag)) return {};

  const t = await getTranslations("blog");
  const tagName = t(`tags.${tag}`);

  return {
    title: t("tagPage.metaTitle", { tag: tagName }),
    description: t("tagPage.metaDescription", { tag: tagName }),
    alternates: { canonical: `/blog/tag/${tag}` },
  };
}

export default async function BlogTagPage({ params }: PageProps) {
  const { tag } = await params;
  if (!isBlogTag(tag)) notFound();

  const t = await getTranslations("blog");
  const tagName = t(`tags.${tag}`);
  const posts = blogPosts.filter((post) => post.tags.includes(tag));

  return (
    <BlogPostList
      eyebrow={t("tagPage.eyebrow")}
      title={`#${tagName}`}
      subtitle={t("tagPage.subtitle", { tag: tagName })}
      posts={posts}
    />
  );
}
