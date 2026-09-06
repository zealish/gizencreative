import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/admin/dashboard");
  }

  const t = await getTranslations("admin.login");

  return (
    <section className="flex min-h-svh items-center justify-center px-4 py-14">
      <div className="card-elegant w-full max-w-md rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-sm text-muted">{t("description")}</p>
        <LoginForm />
      </div>
    </section>
  );
}
