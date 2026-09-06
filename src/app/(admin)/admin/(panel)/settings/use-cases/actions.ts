"use server";

import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { siteSetting } from "@/lib/db/schema";
import { USE_CASE_IDS, USE_CASE_IMAGE_PREFIX } from "@/lib/settings";

const imageUrlSchema = z.string().trim().max(500);

export async function saveUseCaseImages(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin/login");
  }

  for (const id of USE_CASE_IDS) {
    const parsed = imageUrlSchema.safeParse(formData.get(`image-${id}`) ?? "");
    if (!parsed.success) {
      throw new Error(`Invalid image URL for section "${id}"`);
    }
    const key = USE_CASE_IMAGE_PREFIX + id;
    await db
      .insert(siteSetting)
      .values({ key, value: parsed.data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSetting.key,
        set: { value: parsed.data, updatedAt: new Date() },
      });
  }

  revalidateTag("site-settings", "max");
}
