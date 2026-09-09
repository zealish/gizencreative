import { Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
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

const socialLinks = [
  { label: "Instagram", key: "instagramUrl" },
  { label: "WhatsApp", key: "contactPhone", wa: true },
  { label: "Email", key: "contactEmail" },
  { label: "LinkedIn", key: "linkedinUrl" },
] as const;

export function Footer({
  logoUrl,
  settings,
}: {
  logoUrl?: string | null;
  settings: Partial<
    Record<
      "contactEmail" | "contactPhone" | "instagramUrl" | "linkedinUrl",
      string
    >
  >;
}) {
  const t = useTranslations("footer");
  const links = socialLinks.flatMap((social) => {
    const value = settings[social.key];
    if (!value) return [];
    const href =
      social.key === "contactPhone"
        ? `https://wa.me/${value.replace(/[^\d]/g, "")}`
        : social.key === "contactEmail"
          ? `mailto:${value}`
          : value;
    return [{ ...social, href }];
  });

  return (
    <footer className="bg-[#f9fafb] px-4 pb-8 dark:bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-4 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="col-span-2 sm:col-span-4 md:col-span-1">
            <Logo logoUrl={logoUrl} />
            <p className="mt-4 max-w-xs text-sm text-muted">{t("tagline")}</p>
            <div className="mt-5 flex gap-3">
              {links.map((s) =>
                s.key === "contactPhone" ? (
                  <WaLink
                    key={s.label}
                    source="footer"
                    href={s.href}
                    aria-label={s.label}
                    className="marketing-action grid h-9 w-9 place-items-center rounded-full border border-black/10 text-muted transition-colors hover:text-foreground dark:border-white/15"
                  >
                    <MessageCircle
                      aria-hidden="true"
                      className="size-4 shrink-0"
                    />
                  </WaLink>
                ) : (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="marketing-action grid h-9 w-9 place-items-center rounded-full border border-black/10 text-muted transition-colors hover:text-foreground dark:border-white/15"
                  >
                    {s.label === "Email" ? (
                      <Mail aria-hidden="true" className="size-4 shrink-0" />
                    ) : s.label === "Instagram" ? (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle
                          cx="17.5"
                          cy="6.5"
                          r="1"
                          fill="currentColor"
                          stroke="none"
                        />
                      </svg>
                    ) : (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="size-4"
                        fill="currentColor"
                      >
                        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
                      </svg>
                    )}
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
        <div className="flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-6 text-xs text-muted sm:flex-row dark:border-white/15">
          <p>{t("copyright")}</p>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle className="flex" />
          </div>
        </div>
      </div>
    </footer>
  );
}
