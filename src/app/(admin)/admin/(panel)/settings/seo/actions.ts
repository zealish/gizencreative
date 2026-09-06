"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { siteSetting } from "@/lib/db/schema";
import {
  MARKETING_SEO_PAGES,
  type MarketingSeoPage,
  PAGE_SEO_PREFIX,
  SEO_META_KEYS,
} from "@/lib/settings";

export async function saveSeoSettings(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin/login");
  }

  for (const key of SEO_META_KEYS) {
    const value = String(formData.get(key) ?? "").trim();
    await db
      .insert(siteSetting)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSetting.key,
        set: { value, updatedAt: new Date() },
      });
  }

  revalidateTag("site-settings", "max");
}

export async function savePageSeo(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin/login");
  }

  const page = String(formData.get("page") ?? "");
  if (!MARKETING_SEO_PAGES.includes(page as MarketingSeoPage)) {
    throw new Error("Unknown page");
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const key = PAGE_SEO_PREFIX + page;

  if (!title && !description) {
    await db.delete(siteSetting).where(eq(siteSetting.key, key));
  } else {
    const value = JSON.stringify({ title, description });
    await db
      .insert(siteSetting)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSetting.key,
        set: { value, updatedAt: new Date() },
      });
  }

  revalidateTag("site-settings", "max");
}
