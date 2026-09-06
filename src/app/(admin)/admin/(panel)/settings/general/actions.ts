"use server";

import { randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { siteSetting } from "@/lib/db/schema";
import { SITE_LOGO_KEY } from "@/lib/settings";

const MAX_LOGO_SIZE = 2 * 1024 * 1024;

const ALLOWED_LOGO_TYPES: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/svg+xml": ".svg",
  "image/webp": ".webp",
};

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function uploadSiteLogo(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin/login");
  }

  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file uploaded");
  }
  if (file.size > MAX_LOGO_SIZE) {
    throw new Error("File too large (max 2MB)");
  }
  const ext = ALLOWED_LOGO_TYPES[file.type];
  if (!ext) {
    throw new Error("Invalid file type. Use PNG, JPG, SVG, or WebP.");
  }

  const filename = `logo-${randomBytes(8).toString("hex")}${ext}`;
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(
    path.join(UPLOADS_DIR, filename),
    Buffer.from(await file.arrayBuffer()),
  );

  const value = `/uploads/${filename}`;

  const previous = await db
    .select({ value: siteSetting.value })
    .from(siteSetting)
    .where(eq(siteSetting.key, SITE_LOGO_KEY));

  await db
    .insert(siteSetting)
    .values({ key: SITE_LOGO_KEY, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSetting.key,
      set: { value, updatedAt: new Date() },
    });

  const oldPath = previous[0]?.value;
  if (oldPath?.startsWith("/uploads/")) {
    await unlink(path.join(UPLOADS_DIR, path.basename(oldPath))).catch(
      () => {},
    );
  }

  revalidateTag("site-settings", "max");
}

export async function removeSiteLogo() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin/login");
  }

  const rows = await db
    .select({ value: siteSetting.value })
    .from(siteSetting)
    .where(eq(siteSetting.key, SITE_LOGO_KEY));

  await db.delete(siteSetting).where(eq(siteSetting.key, SITE_LOGO_KEY));

  const oldPath = rows[0]?.value;
  if (oldPath?.startsWith("/uploads/")) {
    await unlink(path.join(UPLOADS_DIR, path.basename(oldPath))).catch(
      () => {},
    );
  }

  revalidateTag("site-settings", "max");
}
