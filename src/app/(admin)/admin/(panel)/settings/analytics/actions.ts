"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { siteSetting } from "@/lib/db/schema";
import { ANALYTICS_KEYS, GA_SERVICE_ACCOUNT_KEY } from "@/lib/settings";

export async function saveAnalyticsSettings(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin/login");
  }

  for (const key of ANALYTICS_KEYS) {
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

const MAX_CREDS_SIZE = 64 * 1024;

export async function uploadGaCredentials(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin/login");
  }

  const file = formData.get("credentials");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file uploaded");
  }
  if (file.size > MAX_CREDS_SIZE) {
    throw new Error("File too large");
  }

  const text = await file.text();
  let creds: { type?: string; client_email?: string; private_key?: string };
  try {
    creds = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON file");
  }
  if (
    creds.type !== "service_account" ||
    !creds.client_email ||
    !creds.private_key
  ) {
    throw new Error("Not a valid Google service account credentials file");
  }

  await db
    .insert(siteSetting)
    .values({ key: GA_SERVICE_ACCOUNT_KEY, value: text, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSetting.key,
      set: { value: text, updatedAt: new Date() },
    });

  updateTag("site-settings");
}

export async function removeGaCredentials() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin/login");
  }

  await db
    .delete(siteSetting)
    .where(eq(siteSetting.key, GA_SERVICE_ACCOUNT_KEY));
  updateTag("site-settings");
}
