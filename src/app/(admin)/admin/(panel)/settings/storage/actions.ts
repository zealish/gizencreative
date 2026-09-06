"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { siteSetting } from "@/lib/db/schema";
import { STORAGE_KEYS, STORAGE_PROVIDERS } from "@/lib/settings";

export async function saveStorageSettings(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin/login");
  }

  const provider = String(formData.get("storageProvider") ?? "").trim();
  if (!STORAGE_PROVIDERS.includes(provider as (typeof STORAGE_PROVIDERS)[number])) {
    throw new Error("Invalid storage provider");
  }

  for (const key of STORAGE_KEYS) {
    const value = String(formData.get(key) ?? "").trim();
    await db
      .insert(siteSetting)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSetting.key,
        set: { value, updatedAt: new Date() },
      });
  }

  updateTag("site-settings");
}
