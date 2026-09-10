"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { pricingPlan } from "@/lib/db/schema";
import { pricingSeoTiers, pricingServices } from "@/lib/pricing-shared";

const featureList = z
  .array(z.string().trim().max(200))
  .transform((values) => values.filter(Boolean))
  .pipe(z.array(z.string()).max(20));

const schema = z
  .object({
    service: z.enum(pricingServices),
    seoTier: z.enum(pricingSeoTiers).optional(),
    nameId: z.string().trim().min(1).max(200),
    nameEn: z.string().trim().min(1).max(200),
    descriptionId: z.string().trim().min(1).max(500),
    descriptionEn: z.string().trim().min(1).max(500),
    unitId: z.string().trim().min(1).max(200),
    unitEn: z.string().trim().min(1).max(200),
    featuresId: featureList,
    featuresEn: featureList,
    price: z.string().trim().max(50).optional(),
    originalPrice: z.string().trim().max(50).optional(),
    discountPercent: z.coerce.number().int().min(1).max(99).optional(),
    sortOrder: z.coerce.number().int().min(0).max(999).default(0),
    featured: z.coerce.boolean().default(false),
    published: z.coerce.boolean().default(false),
  })
  .refine((value) => value.service !== "seo" || Boolean(value.seoTier), {
    path: ["seoTier"],
    message: "SEO plans require a tier",
  });

async function authorize() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");
}

function refresh() {
  revalidateTag("pricing", "max");
  revalidatePath("/pricing");
  revalidatePath("/admin/pricing");
}

export async function savePricingPlan(formData: FormData) {
  await authorize();
  const raw = Object.fromEntries(formData);
  const input = schema.parse({
    ...raw,
    seoTier: raw.seoTier || undefined,
    price: raw.price || undefined,
    originalPrice: raw.originalPrice || undefined,
    discountPercent: raw.discountPercent || undefined,
    featuresId: formData.getAll("featuresId"),
    featuresEn: formData.getAll("featuresEn"),
  });
  const values = {
    ...input,
    seoTier: input.service === "seo" ? (input.seoTier ?? null) : null,
    price: input.price ?? null,
    originalPrice: input.originalPrice ?? null,
    discountPercent: input.discountPercent ?? null,
    updatedAt: new Date(),
  };
  const id = formData.get("id");
  if (id) {
    const planId = z.string().uuid().parse(id);
    await db.update(pricingPlan).set(values).where(eq(pricingPlan.id, planId));
  } else {
    await db.insert(pricingPlan).values({ id: randomUUID(), ...values });
  }
  refresh();
  redirect("/admin/pricing");
}

export async function deletePricingPlan(formData: FormData) {
  await authorize();
  const id = z.string().uuid().parse(formData.get("id"));
  await db.delete(pricingPlan).where(eq(pricingPlan.id, id));
  refresh();
}
