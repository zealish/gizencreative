import { desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { portfolioProject } from "@/lib/db/schema";

export type PortfolioProject = typeof portfolioProject.$inferSelect;
const cached = unstable_cache(
  async () =>
    db
      .select()
      .from(portfolioProject)
      .where(eq(portfolioProject.published, true))
      .orderBy(desc(portfolioProject.year)),
  ["published-portfolio"],
  { tags: ["portfolio"] },
);
export async function getPublishedPortfolio(): Promise<PortfolioProject[]> {
  return cached();
}
export async function getAllPortfolioForAdmin(): Promise<PortfolioProject[]> {
  return db
    .select()
    .from(portfolioProject)
    .orderBy(desc(portfolioProject.year));
}
export async function getPortfolioById(
  id: string,
): Promise<PortfolioProject | null> {
  const rows = await db
    .select()
    .from(portfolioProject)
    .where(eq(portfolioProject.id, id))
    .limit(1);
  return rows[0] ?? null;
}
