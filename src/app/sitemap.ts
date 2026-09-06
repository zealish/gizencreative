import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/site-config";
import {
  blogCategories,
  blogPosts,
  blogTags,
} from "./(marketing)/blog/_components/blog-data";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    priority: route.priority,
  }));

  const postEntries = blogPosts.map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    priority: 0.6,
  }));

  const categoryEntries = blogCategories.map((category) => ({
    url: absoluteUrl(`/blog/category/${category}`),
    lastModified,
    priority: 0.4,
  }));

  const tagEntries = blogTags.map((tag) => ({
    url: absoluteUrl(`/blog/tag/${tag}`),
    lastModified,
    priority: 0.3,
  }));

  return [...staticEntries, ...postEntries, ...categoryEntries, ...tagEntries];
}
