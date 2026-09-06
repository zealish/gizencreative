export type BlogCategoryInfo = {
  slug: string;
  name: string;
};

export type LocalizedBlogPost = {
  slug: string;
  category: BlogCategoryInfo;
  tags: string[];
  coverImage: string | null;
  readMinutes: number;
  date: string;
  title: string;
  excerpt: string;
  paragraphs: string[];
  contentHtml: string | null;
  gradient: string;
};
