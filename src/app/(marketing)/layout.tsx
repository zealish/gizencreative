import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getGeneralSettings, getSiteLogo } from "@/lib/settings";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [logoUrl, settings] = await Promise.all([
    getSiteLogo(),
    getGeneralSettings(),
  ]);
  const siteName = settings.siteName ?? null;

  return (
    <>
      <Navbar logoUrl={logoUrl} siteName={siteName} />
      <main className="flex-1">{children}</main>
      <Footer logoUrl={logoUrl} settings={settings} />
      <WhatsAppButton phone={settings.contactPhone} />
    </>
  );
}
