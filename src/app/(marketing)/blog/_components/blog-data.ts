export const blogCategories = ["website", "social", "seo"] as const;
export type BlogCategory = (typeof blogCategories)[number];

export const blogTags = [
  "design",
  "ux",
  "performance",
  "instagram",
  "content",
  "branding",
  "keyword",
  "ranking",
  "local",
] as const;
export type BlogTag = (typeof blogTags)[number];

export type BlogPost = {
  slug: string;
  key: string;
  category: BlogCategory;
  tags: BlogTag[];
  date: string;
  readMinutes: number;
  gradient: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "cara-memilih-jasa-pembuatan-website",
    key: "websiteGuide",
    category: "website",
    tags: ["design", "ux"],
    date: "2026-08-28",
    readMinutes: 6,
    gradient: "from-emerald-200 via-teal-100 to-sky-200",
  },
  {
    slug: "strategi-konten-instagram-2026",
    key: "instagramStrategy",
    category: "social",
    tags: ["instagram", "content"],
    date: "2026-08-14",
    readMinutes: 5,
    gradient: "from-amber-200 via-orange-100 to-rose-200",
  },
  {
    slug: "panduan-seo-untuk-pemula",
    key: "seoBasics",
    category: "seo",
    tags: ["keyword", "ranking"],
    date: "2026-07-30",
    readMinutes: 8,
    gradient: "from-lime-200 via-emerald-100 to-teal-200",
  },
  {
    slug: "cara-mempercepat-website-lambat",
    key: "speedTips",
    category: "website",
    tags: ["performance", "ux"],
    date: "2026-07-11",
    readMinutes: 7,
    gradient: "from-indigo-200 via-purple-100 to-fuchsia-200",
  },
  {
    slug: "membangun-branding-di-social-media",
    key: "socialBranding",
    category: "social",
    tags: ["branding", "content"],
    date: "2026-06-25",
    readMinutes: 5,
    gradient: "from-rose-200 via-pink-100 to-amber-100",
  },
  {
    slug: "riset-keyword-untuk-bisnis-lokal",
    key: "localKeyword",
    category: "seo",
    tags: ["keyword", "local"],
    date: "2026-06-05",
    readMinutes: 6,
    gradient: "from-sky-200 via-cyan-100 to-emerald-200",
  },
];

export const postContentParagraphs = ["p1", "p2", "p3"] as const;

export function findPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function isBlogCategory(value: string): value is BlogCategory {
  return blogCategories.includes(value as BlogCategory);
}

export function isBlogTag(value: string): value is BlogTag {
  return blogTags.includes(value as BlogTag);
}
