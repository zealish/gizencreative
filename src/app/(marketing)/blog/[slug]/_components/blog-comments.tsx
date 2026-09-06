"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

type Comment = {
  id: number;
  name: string;
  message: string;
};

export function BlogComments() {
  const t = useTranslations("blog.comments");
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedMessage) return;

    setComments((previous) => [
      { id: Date.now(), name: trimmedName, message: trimmedMessage },
      ...previous,
    ]);
    setName("");
    setMessage("");
  };

  const inputClass =
    "w-full rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none dark:border-white/15 dark:bg-white/5";

  return (
    <section className="mt-12 sm:mt-16">
      <h2 className="text-2xl font-bold tracking-tight">{t("title")}</h2>
      <p className="mt-1 text-sm text-muted">
        {t("count", { count: comments.length })}
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="sr-only">{t("nameLabel")}</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("namePlaceholder")}
            required
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="sr-only">{t("messageLabel")}</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={t("messagePlaceholder")}
            required
            rows={4}
            className={inputClass}
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-foreground px-7 py-3.5 text-xs font-bold uppercase tracking-wide text-background shadow-lg transition-opacity hover:opacity-85"
        >
          {t("submit")}
        </button>
      </form>
      <div className="mt-8 space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted">{t("emptyState")}</p>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 place-items-center rounded-full bg-accent-soft text-xs font-bold uppercase text-accent"
                >
                  {comment.name[0]}
                </span>
                <div>
                  <p className="text-sm font-bold">{comment.name}</p>
                  <p className="text-xs text-muted">{t("justNow")}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/80">
                {comment.message}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
