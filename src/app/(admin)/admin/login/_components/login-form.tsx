"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";

export function LoginForm() {
  const t = useTranslations("admin.login");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasError(false);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const { error } = await signIn.email({ email, password });

    if (error) {
      setHasError(true);
      setIsSubmitting(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-xs font-semibold uppercase tracking-wider text-muted"
        >
          {t("emailLabel")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5"
        />
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-xs font-semibold uppercase tracking-wider text-muted"
        >
          {t("passwordLabel")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent dark:border-white/15 dark:bg-white/5"
        />
      </div>
      {hasError ? (
        <p role="alert" className="text-sm font-medium text-red-500">
          {t("error")}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
