import { createHash } from "node:crypto";
import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  getStorageProvider,
  getStorageSettings,
  type StorageKey,
  type StorageProvider,
} from "@/lib/settings";

export type StoredFile = {
  name: string;
  url: string;
  size: number;
  modifiedAt: string;
};

export type StorageUploadInput = {
  filename: string;
  contentType: string;
  data: Buffer;
};

const LOCAL_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

type StorageSettings = Partial<Record<StorageKey, string>>;

async function resolveStorage(): Promise<{
  provider: StorageProvider;
  settings: StorageSettings;
}> {
  const settings = await getStorageSettings();
  return { provider: getStorageProvider(settings), settings };
}

export async function uploadFile(input: StorageUploadInput): Promise<string> {
  const { provider, settings } = await resolveStorage();
  if (provider === "cloudinary") {
    return uploadToCloudinary(input, settings);
  }
  if (provider === "s3" || provider === "r2") {
    const s3 = getS3Config(provider, settings);
    await s3.client.send(
      new PutObjectCommand({
        Bucket: s3.bucket,
        Key: input.filename,
        Body: input.data,
        ContentType: input.contentType,
      }),
    );
    return `${s3.publicUrl}/${input.filename}`;
  }
  await mkdir(LOCAL_UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_UPLOADS_DIR, input.filename), input.data);
  return `/uploads/${input.filename}`;
}

export async function deleteFile(name: string): Promise<void> {
  const { provider, settings } = await resolveStorage();
  if (provider === "cloudinary") {
    await deleteFromCloudinary(name, settings).catch(() => {});
    return;
  }
  if (provider === "s3" || provider === "r2") {
    const s3 = getS3Config(provider, settings);
    await s3.client
      .send(new DeleteObjectCommand({ Bucket: s3.bucket, Key: name }))
      .catch(() => {});
    return;
  }
  await unlink(path.join(LOCAL_UPLOADS_DIR, path.basename(name))).catch(
    () => {},
  );
}

export async function listFiles(): Promise<StoredFile[]> {
  const { provider, settings } = await resolveStorage();
  try {
    if (provider === "cloudinary") {
      return await listCloudinary(settings);
    }
    if (provider === "s3" || provider === "r2") {
      return await listS3(provider, settings);
    }
    return await listLocal();
  } catch {
    return [];
  }
}

async function listLocal(): Promise<StoredFile[]> {
  let entries: string[];
  try {
    entries = await readdir(LOCAL_UPLOADS_DIR);
  } catch {
    return [];
  }
  const files = await Promise.all(
    entries
      .filter((name) => !name.startsWith("."))
      .map(async (name): Promise<StoredFile | null> => {
        const info = await stat(path.join(LOCAL_UPLOADS_DIR, name)).catch(
          () => null,
        );
        if (!info?.isFile()) return null;
        return {
          name,
          url: `/uploads/${name}`,
          size: info.size,
          modifiedAt: info.mtime.toISOString(),
        };
      }),
  );
  return files.filter((f): f is StoredFile => f !== null);
}

function getS3Config(provider: "s3" | "r2", settings: StorageSettings) {
  if (provider === "r2") {
    const accountId = settings.r2AccountId;
    const bucket = settings.r2Bucket;
    const accessKeyId = settings.r2AccessKeyId;
    const secretAccessKey = settings.r2SecretAccessKey;
    if (!accountId || !bucket || !accessKeyId || !secretAccessKey) {
      throw new Error("Cloudflare R2 storage is not fully configured");
    }
    return {
      bucket,
      publicUrl: (settings.r2PublicUrl ?? "").replace(/\/$/, ""),
      client: new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId, secretAccessKey },
      }),
    };
  }
  const region = settings.s3Region;
  const bucket = settings.s3Bucket;
  const accessKeyId = settings.s3AccessKeyId;
  const secretAccessKey = settings.s3SecretAccessKey;
  if (!region || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error("Amazon S3 storage is not fully configured");
  }
  const publicUrl =
    settings.s3PublicUrl?.replace(/\/$/, "") ||
    `https://${bucket}.s3.${region}.amazonaws.com`;
  return {
    bucket,
    publicUrl,
    client: new S3Client({
      region,
      ...(settings.s3Endpoint ? { endpoint: settings.s3Endpoint } : {}),
      credentials: { accessKeyId, secretAccessKey },
    }),
  };
}

async function listS3(
  provider: "s3" | "r2",
  settings: StorageSettings,
): Promise<StoredFile[]> {
  const s3 = getS3Config(provider, settings);
  const result = await s3.client.send(
    new ListObjectsV2Command({ Bucket: s3.bucket, MaxKeys: 500 }),
  );
  return (result.Contents ?? [])
    .filter((obj) => obj.Key && obj.Size !== undefined)
    .map((obj) => ({
      name: obj.Key as string,
      url: `${s3.publicUrl}/${obj.Key}`,
      size: obj.Size ?? 0,
      modifiedAt: (obj.LastModified ?? new Date()).toISOString(),
    }));
}

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  folder: string;
};

function getCloudinaryConfig(settings: StorageSettings): CloudinaryConfig {
  const cloudName = settings.cloudinaryCloudName;
  const apiKey = settings.cloudinaryApiKey;
  const apiSecret = settings.cloudinaryApiSecret;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary storage is not fully configured");
  }
  return {
    cloudName,
    apiKey,
    apiSecret,
    folder: settings.cloudinaryFolder || "uploads",
  };
}

function signCloudinary(
  params: Record<string, string>,
  apiSecret: string,
): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");
}

async function uploadToCloudinary(
  input: StorageUploadInput,
  settings: StorageSettings,
): Promise<string> {
  const config = getCloudinaryConfig(settings);
  const publicId = input.filename.replace(/\.[^.]+$/, "");
  const timestamp = String(Math.floor(Date.now() / 1000));
  const params = {
    folder: config.folder,
    public_id: publicId,
    timestamp,
  };
  const body = new FormData();
  body.set(
    "file",
    new Blob([new Uint8Array(input.data)], { type: input.contentType }),
    input.filename,
  );
  body.set("api_key", config.apiKey);
  body.set("folder", params.folder);
  body.set("public_id", params.public_id);
  body.set("timestamp", params.timestamp);
  body.set("signature", signCloudinary(params, config.apiSecret));

  const resourceType = input.contentType.startsWith("image/") ? "image" : "raw";
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/${resourceType}/upload`,
    { method: "POST", body },
  );
  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }
  const data = (await response.json()) as { secure_url?: string };
  if (!data.secure_url) {
    throw new Error("Cloudinary upload returned no URL");
  }
  return data.secure_url;
}

async function deleteFromCloudinary(
  name: string,
  settings: StorageSettings,
): Promise<void> {
  const config = getCloudinaryConfig(settings);
  const publicId = `${config.folder}/${name.replace(/\.[^.]+$/, "")}`;
  const timestamp = String(Math.floor(Date.now() / 1000));
  const params = { public_id: publicId, timestamp };
  const body = new URLSearchParams({
    ...params,
    api_key: config.apiKey,
    signature: signCloudinary(params, config.apiSecret),
  });
  for (const resourceType of ["image", "raw"]) {
    await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudName}/${resourceType}/destroy`,
      { method: "POST", body },
    );
  }
}

async function listCloudinary(
  settings: StorageSettings,
): Promise<StoredFile[]> {
  const config = getCloudinaryConfig(settings);
  const auth = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString(
    "base64",
  );
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/resources/by_asset_folder?asset_folder=${encodeURIComponent(config.folder)}&max_results=500`,
    { headers: { Authorization: `Basic ${auth}` } },
  );
  if (!response.ok) return [];
  const data = (await response.json()) as {
    resources?: {
      public_id?: string;
      format?: string;
      bytes?: number;
      created_at?: string;
      secure_url?: string;
    }[];
  };
  return (data.resources ?? [])
    .filter((res) => res.public_id && res.secure_url)
    .map((res) => {
      const base = (res.public_id as string).split("/").pop() ?? "";
      return {
        name: res.format ? `${base}.${res.format}` : base,
        url: res.secure_url as string,
        size: res.bytes ?? 0,
        modifiedAt: res.created_at ?? new Date().toISOString(),
      };
    });
}
