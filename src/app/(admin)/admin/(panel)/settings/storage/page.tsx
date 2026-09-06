import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getStorageProvider, getStorageSettings } from "@/lib/settings";
import { StorageForm } from "./storage-form";

export const metadata: Metadata = {
  title: "Storage Settings",
  robots: { index: false, follow: false },
};

export default async function StorageSettingsPage() {
  const t = await getTranslations("admin.settings.storage");
  const settings = await getStorageSettings();
  const provider = getStorageProvider(settings);

  return (
    <div className="card-elegant rounded-3xl p-6 sm:p-8">
      <h2 className="text-xl font-bold tracking-tight">{t("title")}</h2>
      <p className="mt-2 text-sm text-muted">{t("description")}</p>
      <StorageForm settings={settings} initialProvider={provider} />
    </div>
  );
}
