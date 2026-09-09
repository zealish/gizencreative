"use server";

import { randomBytes } from "node:crypto";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { auth } from "@/lib/auth";
import { deleteFile, uploadFile } from "@/lib/storage";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/svg+xml": ".svg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "application/pdf": ".pdf",
};

const COMPRESSIBLE_IMAGE_TYPES: Record<string, true> = {
  "image/png": true,
  "image/jpeg": true,
  "image/webp": true,
  "image/avif": true,
};

async function prepareUpload(
  file: File,
): Promise<{ data: Buffer; contentType: string; extension: string }> {
  const original = Buffer.from(await file.arrayBuffer());
  if (!COMPRESSIBLE_IMAGE_TYPES[file.type]) {
    return {
      data: original,
      contentType: file.type,
      extension: ALLOWED_TYPES[file.type],
    };
  }

  const image = sharp(original, { failOn: "error" });
  const data = await image.rotate().webp({ quality: 82, effort: 4 }).toBuffer();
  return { data, contentType: "image/webp", extension: ".webp" };
}

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin/login");
  }
}

export async function uploadMedia(formData: FormData) {
  await requireSession();

  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) {
    throw new Error("No file uploaded");
  }

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large (max 10MB): ${file.name}`);
    }
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      throw new Error(`Invalid file type: ${file.name}`);
    }

    const prepared = await prepareUpload(file);
    const base = path
      .basename(file.name, path.extname(file.name))
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);
    const filename = `${base || "file"}-${randomBytes(4).toString("hex")}${prepared.extension}`;

    await uploadFile({
      filename,
      contentType: prepared.contentType,
      data: prepared.data,
    });
  }

  revalidatePath("/admin/media");
}

export async function uploadMediaFiles(
  formData: FormData,
): Promise<{ name: string; url: string }[]> {
  await requireSession();

  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) {
    throw new Error("No file uploaded");
  }

  const uploaded: { name: string; url: string }[] = [];
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large (max 10MB): ${file.name}`);
    }
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      throw new Error(`Invalid file type: ${file.name}`);
    }

    const prepared = await prepareUpload(file);
    const base = path
      .basename(file.name, path.extname(file.name))
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);
    const filename = `${base || "file"}-${randomBytes(4).toString("hex")}${prepared.extension}`;

    const url = await uploadFile({
      filename,
      contentType: prepared.contentType,
      data: prepared.data,
    });
    uploaded.push({ name: filename, url });
  }

  revalidatePath("/admin/media");
  return uploaded;
}

export async function deleteMedia(formData: FormData) {
  await requireSession();

  const name = formData.get("name");
  if (typeof name !== "string" || name.length === 0) {
    throw new Error("Missing file name");
  }
  const safe = path.basename(name);
  if (safe !== name || safe.startsWith(".")) {
    throw new Error("Invalid file name");
  }

  await deleteFile(safe);

  revalidatePath("/admin/media");
}
