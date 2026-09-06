import { getTranslations } from "next-intl/server";
import { AdminPageHeader } from "../_components/admin-page-header";
import { SettingsNav } from "./_components/settings-nav";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("admin.settings");

  return (
    <section className="mx-auto max-w-6xl">
      <AdminPageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <div className="mt-8 flex flex-col gap-6 lg:flex-row">
        <SettingsNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </section>
  );
}
