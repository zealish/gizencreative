"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { portfolioProject } from "@/lib/db/schema";

const SERVICES = [
  "Website Development",
  "Social Media Management",
  "SEO Website",
] as const;
const schema = z.object({
  projectName: z.string().trim().min(1).max(200),
  year: z.coerce.number().int().min(1900).max(9999),
  clientCompany: z.string().trim().min(1).max(200),
  coverImage: z.string().trim().max(1000).optional(),
  services: z.array(z.enum(SERVICES)).min(1).max(3),
});

async function authorize() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");
}

function refresh() {
  revalidateTag("portfolio", "max");
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");
}

export async function savePortfolio(formData: FormData) {
  await authorize();
  const input = schema.parse({
    ...Object.fromEntries(formData),
    services: formData.getAll("services"),
  });
  const values = {
    ...input,
    coverImage: input.coverImage || null,
    published: true,
    updatedAt: new Date(),
  };
  const id = formData.get("id");
  if (id) {
    const projectId = z.string().uuid().parse(id);
    await db
      .update(portfolioProject)
      .set(values)
      .where(eq(portfolioProject.id, projectId));
  } else {
    await db.insert(portfolioProject).values({ id: randomUUID(), ...values });
  }
  refresh();
  redirect("/admin/portfolio");
}

export async function deletePortfolio(formData: FormData) {
  await authorize();
  const id = z.string().uuid().parse(formData.get("id"));
  await db.delete(portfolioProject).where(eq(portfolioProject.id, id));
  refresh();
}
