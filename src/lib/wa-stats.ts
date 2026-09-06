import { count, desc, gte } from "drizzle-orm";
import { db } from "@/lib/db";
import { waClick } from "@/lib/db/schema";
import type { GaRange } from "@/lib/ga";

const RANGE_DAYS: Record<GaRange, number> = {
  "7d": 7,
  "28d": 28,
  "90d": 90,
};

export type WaClickStats = {
  total: number;
  bySource: { source: string; clicks: number }[];
  recent: {
    id: string;
    source: string;
    path: string;
    createdAt: Date;
  }[];
};

export async function getWaClickStats(range: GaRange): Promise<WaClickStats> {
  const since = new Date();
  since.setDate(since.getDate() - RANGE_DAYS[range]);

  const [totalRows, sourceRows, recentRows] = await Promise.all([
    db
      .select({ value: count() })
      .from(waClick)
      .where(gte(waClick.createdAt, since)),
    db
      .select({ source: waClick.source, clicks: count() })
      .from(waClick)
      .where(gte(waClick.createdAt, since))
      .groupBy(waClick.source)
      .orderBy(desc(count())),
    db
      .select({
        id: waClick.id,
        source: waClick.source,
        path: waClick.path,
        createdAt: waClick.createdAt,
      })
      .from(waClick)
      .where(gte(waClick.createdAt, since))
      .orderBy(desc(waClick.createdAt))
      .limit(8),
  ]);

  return {
    total: totalRows[0]?.value ?? 0,
    bySource: sourceRows,
    recent: recentRows,
  };
}
