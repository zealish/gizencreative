"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { StorageKey, StorageProvider } from "@/lib/settings";
import { saveStorageSettings } from "./actions";

const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted";

type FieldDef = {
  key: StorageKey;
  labelKey: string;
  type?: "text" | "password";
  placeholder?: string;
};

const PROVIDER_FIELDS: Record<
  Exclude<StorageProvider, "local">,
  FieldDef[]
> = {
  cloudinary: [
    { key: "cloudinaryCloudName", labelKey: "cloudNameLabel" },
    { key: "cloudinaryApiKey", labelKey: "apiKeyLabel" },
    { key: "cloudinaryApiSecret", labelKey: "apiSecretLabel", type: "password" },
    { key: "cloudinaryFolder", labelKey: "folderLabel", placeholder: "uploads" },
  ],
  s3: [
    { key: "s3Region", labelKey: "regionLabel", placeholder: "ap-southeast-1" },
    { key: "s3Bucket", labelKey: "bucketLabel" },
    { key: "s3AccessKeyId", labelKey: "accessKeyIdLabel" },
    { key: "s3SecretAccessKey", labelKey: "secretAccessKeyLabel", type: "password" },
    {
      key: "s3Endpoint",
      labelKey: "endpointLabel",
      placeholder: "https://s3.ap-southeast-1.amazonaws.com",
    },
    {
      key: "s3PublicUrl",
      labelKey: "publicUrlLabel",
      placeholder: "https://cdn.example.com",
    },
  ],
  r2: [
    { key: "r2AccountId", labelKey: "accountIdLabel" },
    { key: "r2Bucket", labelKey: "bucketLabel" },
    { key: "r2AccessKeyId", labelKey: "accessKeyIdLabel" },
    { key: "r2SecretAccessKey", labelKey: "secretAccessKeyLabel", type: "password" },
    {
      key: "r2PublicUrl",
      labelKey: "publicUrlLabel",
      placeholder: "https://pub-xxxx.r2.dev",
    },
  ],
};

const PROVIDERS: StorageProvider[] = ["local", "cloudinary", "s3", "r2"];

export function StorageForm({
  settings,
  initialProvider,
}: {
  settings: Partial<Record<StorageKey, string>>;
  initialProvider: StorageProvider;
}) {
  const t = useTranslations("admin.settings.storage");
  const [provider, setProvider] = useState<StorageProvider>(initialProvider);

  return (
    <form action={saveStorageSettings} className="mt-6 space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="storageProvider" className={labelClass}>
          {t("providerLabel")}
        </label>
        <select
          id="storageProvider"
          name="storageProvider"
          value={provider}
          onChange={(e) => setProvider(e.target.value as StorageProvider)}
          className={inputClass}
        >
          {PROVIDERS.map((p) => (
            <option key={p} value={p}>
              {t(`providers.${p}`)}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted">{t("providerHint")}</p>
      </div>

      {(Object.keys(PROVIDER_FIELDS) as Array<keyof typeof PROVIDER_FIELDS>).map(
        (p) => (
          <div key={p} className={provider === p ? "space-y-5" : "hidden"}>
            {PROVIDER_FIELDS[p].map((field) => (
              <div key={field.key} className="space-y-1.5">
                <label htmlFor={field.key} className={labelClass}>
                  {t(`${p}.${field.labelKey}`)}
                </label>
                <input
                  id={field.key}
                  name={field.key}
                  type={field.type ?? "text"}
                  defaultValue={settings[field.key] ?? ""}
                  placeholder={field.placeholder}
                  autoComplete="off"
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        ),
      )}

      <button
        type="submit"
        className="rounded-full bg-foreground px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-background shadow-lg transition-opacity hover:opacity-85"
      >
        {t("save")}
      </button>
    </form>
  );
}
