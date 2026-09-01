"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { href } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/lib/types";

function NotFoundInner() {
  const pathname = usePathname() ?? "/fa";
  const locale: Locale = pathname.startsWith("/en") ? "en" : "fa";
  const d = getDictionary(locale);

  return (
    <>
      <p
        className="display"
        style={{ fontSize: "clamp(4rem, 12vw, 7rem)", lineHeight: 1, color: "var(--border-strong)", textAlign: "center", margin: 0 }}
        aria-hidden="true"
      >
        {locale === "fa" ? "۴۰۴" : "404"}
      </p>
      <EmptyState
        title={locale === "fa" ? "این صفحه پیدا نشد" : "Page not found"}
        hint={locale === "fa" ? "نشانی تغییر کرده یا صفحه حذف شده است." : "The address changed or the page was removed."}
      />
      <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
        <Button variant="primary" href={href(locale)}>{d.nav.home}</Button>
        <Button variant="outline" href={href(locale, "/patterns")}>{d.nav.patterns}</Button>
        <Button variant="outline" href={href(locale, "/store")}>{d.nav.store}</Button>
      </div>
      <p style={{ textAlign: "center", marginTop: "var(--space-6)" }}>
        <Link href={href(locale, "/contact")} className="text-secondary" style={{ textDecoration: "underline", textUnderlineOffset: "0.2em" }}>
          {locale === "fa" ? "گزارش مشکل به تیم رزی آتلیه" : "Report an issue to the team"}
        </Link>
      </p>
    </>
  );
}

export function NotFoundView() {
  return (
    <div className="container section" style={{ maxWidth: "36rem" }}>
      <Suspense>
        <NotFoundInner />
      </Suspense>
    </div>
  );
}
