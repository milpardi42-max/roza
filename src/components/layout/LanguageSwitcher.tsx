"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const pathname = usePathname() ?? `/${locale}`;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const target: Locale = locale === "fa" ? "en" : "fa";
  const targetPath = pathname.replace(/^\/(fa|en)(?=\/|$)/, `/${target}`);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="lang-switch" ref={ref}>
      <button
        className="icon-btn lang-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Language / زبان"
      >
        <Icon name="globe" size={18} />
        <span className="lang-current">{locale.toUpperCase()}</span>
        <Icon name="chevron-down" size={12} />
      </button>
      <div className={cx("lang-menu", open && "is-open")} role="listbox" aria-label="Language">
        <Link
          href={targetPath}
          role="option"
          aria-selected={false}
          className="lang-option"
          lang={target}
          onClick={() => setOpen(false)}
        >
          <span className="lang-option-name">{target === "fa" ? "فارسی" : "English"}</span>
          <span className="lang-option-dir">{target === "fa" ? "RTL" : "LTR"}</span>
        </Link>
      </div>
    </div>
  );
}
