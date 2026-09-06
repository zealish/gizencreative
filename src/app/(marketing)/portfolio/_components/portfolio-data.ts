export const filterOptions = ["all", "website", "social", "seo"] as const;

export type PortfolioFilter = (typeof filterOptions)[number];
export type PortfolioCategory = Exclude<PortfolioFilter, "all">;

export type PortfolioItem = {
  key: string;
  category: PortfolioCategory;
  badge?: "new" | "featured";
  gradient: string;
};

export const portfolioItems: PortfolioItem[] = [
  {
    key: "arunika",
    category: "website",
    badge: "new",
    gradient: "from-blue-200 via-sky-100 to-cyan-200",
  },
  {
    key: "kopiSemesta",
    category: "social",
    gradient: "from-amber-200 via-orange-100 to-rose-200",
  },
  {
    key: "lumina",
    category: "website",
    badge: "featured",
    gradient: "from-indigo-200 via-purple-100 to-fuchsia-200",
  },
  {
    key: "sehatDaily",
    category: "seo",
    gradient: "from-sky-200 via-blue-100 to-indigo-200",
  },
  {
    key: "batikNusantara",
    category: "website",
    gradient: "from-rose-200 via-pink-100 to-amber-100",
  },
  {
    key: "travelindo",
    category: "social",
    badge: "new",
    gradient: "from-cyan-200 via-sky-100 to-blue-200",
  },
];
