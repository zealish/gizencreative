import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Logo } from "@/components/layout/logo";
import { WaLink } from "@/components/wa-link";

const footerColumns: { title: string; links: string[] }[] = [
  {
    title: "services",
    links: ["websiteDevelopment", "socialMediaManagement", "seoWebsite"],
  },
  {
    title: "packages",
    links: [
      "websitePackage",
      "socialMediaPackage",
      "seoPackage",
      "enterprisePackage",
    ],
  },
  {
    title: "resources",
    links: ["blog", "portfolio", "faq", "caseStudies"],
  },
  {
    title: "company",
    links: ["aboutUs", "contact", "privacyPolicy", "termsOfService"],
  },
];

const linkHrefs: Record<string, string> = {
  aboutUs: "/about",
  contact: "/contact",
  blog: "/blog",
  faq: "/faq",
  privacyPolicy: "/privacy-policy",
  termsOfService: "/terms-of-service",
  websiteDevelopment: "/services/website-development",
  socialMediaManagement: "/services/social-media-management",
  seoWebsite: "/services/seo-website",
};

const socialLinks: { label: string; href: string; wa?: boolean }[] = [
  { label: "Instagram", href: "https://instagram.com/gizencreative" },
  { label: "WhatsApp", href: "https://wa.me/6281234567890", wa: true },
  { label: "Email", href: "mailto:hello@gizencreative.com" },
  { label: "LinkedIn", href: "https://linkedin.com/company/gizencreative" },
];

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="px-4 pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-4 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="col-span-2 sm:col-span-4 md:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted">{t("tagline")}</p>
            <div className="mt-5 flex gap-3">
              {socialLinks.map((s) =>
                s.wa ? (
                  <WaLink
                    key={s.label}
                    source="footer"
                    href={s.href}
                    aria-label={s.label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-black/10 dark:border-white/15 text-muted transition-colors hover:text-foreground"
                  >
                    <span className="text-[10px] font-bold">{s.label[0]}</span>
                  </WaLink>
                ) : (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-black/10 dark:border-white/15 text-muted transition-colors hover:text-foreground"
                  >
                    <span className="text-[10px] font-bold">{s.label[0]}</span>
                  </a>
                ),
              )}
            </div>
          </div>
          {footerColumns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                {t(`columns.${col.title}`)}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href={linkHrefs[link] ?? "/#kontak"}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {t(`links.${link}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-black/10 dark:border-white/15 pt-6 text-xs text-muted sm:flex-row">
          <p>{t("copyright")}</p>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
