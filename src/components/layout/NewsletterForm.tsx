"use client";

import { useState } from "react";
import { cx } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";

export function NewsletterForm({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const d = getDictionary(locale);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    setState("done");
  };

  if (state === "done") {
    return (
      <p className={cx("newsletter-done", compact && "newsletter-compact")}>
        <Icon name="check" size={16} />
        {d.home.newsletter.success}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className={cx("newsletter-form", compact && "newsletter-compact")} noValidate>
      <label htmlFor={compact ? "nl-footer" : "nl-home"} className="visually-hidden">
        {d.common.emailPlaceholder}
      </label>
      <input
        id={compact ? "nl-footer" : "nl-home"}
        type="email"
        inputMode="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={d.common.emailPlaceholder}
        className="input newsletter-input"
        dir="ltr"
        required
      />
      <button type="submit" className="btn btn-accent newsletter-btn">
        <span className="btn-label">{d.home.newsletter.cta}</span>
        <Icon name="arrow-right" size={16} flipRtl />
      </button>
    </form>
  );
}
