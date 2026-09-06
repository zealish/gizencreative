import { statfs } from "node:fs/promises";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { getGaDashboardStats } from "@/lib/ga";
import {
  getStorageProvider,
  getStorageSettings,
  type StorageKey,
  type StorageProvider,
} from "@/lib/settings";
import { AdminPageHeader } from "../_components/admin-page-header";
import { AnalyticsCard } from "./_components/analytics-card";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

type StorageUsage = {
  percent: number;
  rows: [{ label: string; value: string }, { label: string; value: string }];
};

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/admin/login");
  }

  const t = await getTranslations("admin.dashboard");
  const settings = await getStorageSettings();
  const provider = getStorageProvider(settings);
  const [usage, gaStats] = await Promise.all([
    getStorageUsage(provider, settings, {
      used: t("usedLabel"),
      total: t("totalLabel"),
      bucket: t("statsBucket"),
      credentials: t("statsCredentials"),
      configured: t("statsConfigured"),
      notConfigured: t("statsNotConfigured"),
    }),
    getGaDashboardStats(),
  ]);

  return (
    <section className="mx-auto max-w-6xl">
      <AdminPageHeader
        eyebrow={t("eyebrow")}
        title={`${t("title")}, ${session.user.name}`}
        description={t("description")}
      />
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="card-elegant rounded-3xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight">
              {t("storageCardTitle")}
            </h2>
            <span className="rounded-full border border-accent/30 bg-accent-soft/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
              {t("storageBadge", {
                provider: t(`storageProvider.${provider}`),
              })}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted">
            {t("storageCardDescription")}
          </p>
          <div className="mt-8 rounded-2xl border border-accent/20 bg-accent-soft/40 p-6">
            <div className="flex items-center gap-6">
              <UsageRing percent={usage.percent} />
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-3 pb-3">
                  <span className="text-sm text-muted">
                    {usage.rows[0].label}
                  </span>
                  <span className="text-sm font-bold">
                    {usage.rows[0].value}
                  </span>
                </div>
                <div className="h-0.5 rounded-full bg-accent/60" />
                <div className="flex items-baseline justify-between gap-3 pt-3">
                  <span className="text-sm text-muted">
                    {usage.rows[1].label}
                  </span>
                  <span className="text-sm font-bold text-accent">
                    {usage.rows[1].value}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Link
            href="/admin/settings/storage"
            className="mt-6 inline-block text-sm font-semibold text-accent hover:underline"
          >
            {t("storageCardManage")}
          </Link>
        </div>
        <AnalyticsCard stats={gaStats} />
      </div>
    </section>
  );
}

function UsageRing({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="10"
          className="stroke-black/10 dark:stroke-white/10"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(circumference * clamped) / 100} ${circumference}`}
          className="stroke-accent"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
        {clamped}%
      </span>
    </div>
  );
}

type UsageLabels = {
  used: string;
  total: string;
  bucket: string;
  credentials: string;
  configured: string;
  notConfigured: string;
};

async function getStorageUsage(
  provider: StorageProvider,
  settings: Partial<Record<StorageKey, string>>,
  labels: UsageLabels,
): Promise<StorageUsage> {
  if (provider === "cloudinary") {
    const cloudinary = await getCloudinaryUsage(settings);
    if (cloudinary) {
      return {
        percent:
          cloudinary.limitBytes > 0
            ? (cloudinary.usedBytes / cloudinary.limitBytes) * 100
            : 0,
        rows: [
          { label: labels.used, value: formatBytes(cloudinary.usedBytes) },
          { label: labels.total, value: formatBytes(cloudinary.limitBytes) },
        ],
      };
    }
  }

  if (provider === "local") {
    try {
      const fs = await statfs(process.cwd());
      const total = fs.blocks * fs.bsize;
      const used = (fs.blocks - fs.bfree) * fs.bsize;
      return {
        percent: total > 0 ? (used / total) * 100 : 0,
        rows: [
          { label: labels.used, value: formatBytes(used) },
          { label: labels.total, value: formatBytes(total) },
        ],
      };
    } catch {
      // fall through to config completeness
    }
  }

  const required = REQUIRED_KEYS[provider];
  const filled = required.filter((key) => settings[key]).length;
  const bucketValue =
    provider === "s3"
      ? settings.s3Bucket
      : provider === "r2"
        ? settings.r2Bucket
        : settings.cloudinaryCloudName;
  return {
    percent: required.length > 0 ? (filled / required.length) * 100 : 0,
    rows: [
      { label: labels.bucket, value: bucketValue || "-" },
      {
        label: labels.credentials,
        value:
          filled === required.length ? labels.configured : labels.notConfigured,
      },
    ],
  };
}

const REQUIRED_KEYS: Record<StorageProvider, StorageKey[]> = {
  local: [],
  cloudinary: [
    "cloudinaryCloudName",
    "cloudinaryApiKey",
    "cloudinaryApiSecret",
  ],
  s3: ["s3Region", "s3Bucket", "s3AccessKeyId", "s3SecretAccessKey"],
  r2: ["r2AccountId", "r2Bucket", "r2AccessKeyId", "r2SecretAccessKey"],
};

async function getCloudinaryUsage(
  settings: Partial<Record<StorageKey, string>>,
): Promise<{ usedBytes: number; limitBytes: number } | null> {
  const cloudName = settings.cloudinaryCloudName;
  const apiKey = settings.cloudinaryApiKey;
  const apiSecret = settings.cloudinaryApiSecret;
  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }
  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/usage`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
        },
        next: { revalidate: 300 },
      },
    );
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as {
      storage?: { usage?: number };
      credits?: { limit?: number };
    };
    if (typeof data.storage?.usage !== "number") {
      return null;
    }
    // On credit-based plans, 1 credit covers 1 GB of storage.
    const limitBytes =
      typeof data.credits?.limit === "number"
        ? data.credits.limit * 1024 ** 3
        : 0;
    return { usedBytes: data.storage.usage, limitBytes };
  } catch {
    return null;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
