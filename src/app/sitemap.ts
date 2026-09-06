import type { MetadataRoute } from "next";

import {
  getBlogCategories,
  getPublishedPosts,
  getPublishedTags,
} from "@/lib/blog";
import { absoluteUrl } from "@/lib/seo/site-config";

// Render at request time so blog data comes from the live database
// (the DB is not available during Docker image builds).
export const dynamic = "force-dynamic";

const staticRoutes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/services/website-development", priority: 0.9 },
  { path: "/services/social-media-management", priority: 0.9 },
  { path: "/services/seo-website", priority: 0.9 },
  { path: "/pricing", priority: 0.9 },
  { path: "/portfolio", priority: 0.8 },
  { path: "/blog", priority: 0.7 },
  { path: "/faq", priority: 0.6 },
  { path: "/contact", priority: 0.8 },
  { path: "/privacy-policy", priority: 0.3 },
  { path: "/terms-of-service", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const posts = await getPublishedPosts();
  const tags = await getPublishedTags();
  const categories = await getBlogCategories();

  const staticEntries = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    priority: route.priority,
  }));

  const postEntries = posts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.updatedAt,
    priority: 0.6,
  }));

  const categoryEntries = categories.map((category) => ({
    url: absoluteUrl(`/blog/category/${category.slug}`),
    lastModified,
    priority: 0.4,
  }));

  const tagEntries = tags.map((tag) => ({
    url: absoluteUrl(`/blog/tag/${tag}`),
    lastModified,
    priority: 0.3,
  }));

  return [...staticEntries, ...postEntries, ...categoryEntries, ...tagEntries];
}
