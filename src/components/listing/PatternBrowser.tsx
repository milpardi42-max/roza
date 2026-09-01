"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Locale, Pattern } from "@/lib/types";
import { getDictionary, sprintf } from "@/lib/i18n";
import { cx, formatNumber } from "@/lib/utils";
import { PatternCard } from "@/components/cards/PatternCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";

type Sort = "popular" | "newest" | "price-asc" | "price-desc";

const PAGE_SIZE = 9;

export function PatternBrowser({
  items,
  locale,
  styleOptions,
  countLabel,
}: {
  items: Pattern[];
  locale: Locale;
  styleOptions: { slug: string; label: string }[];
  countLabel: string;
}) {
  const d = getDictionary(locale);
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [style, setStyle] = useState<string | null>(params.get("style"));
  const [sort, setSort] = useState<Sort>("popular");
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [q, style, sort]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let out = items;
    if (style) out = out.filter((p) => p.style.en.toLowerCase().includes(style.replace(/-/g, " ")) || p.category.en.toLowerCase().includes(style.replace(/-/g, " ")));
    if (query) {
      out = out.filter((p) =>
        [p.name.fa, p.name.en, p.code, p.style.fa, p.style.en, p.category.fa, p.category.en, p.description.fa]
          .some((s) => s && s.toLowerCase().includes(query))
      );
    }
    out = [...out].sort((a, b) => {
      switch (sort) {
        case "price-asc": return a.licensePrice[locale] - b.licensePrice[locale];
        case "price-desc": return b.licensePrice[locale] - a.licensePrice[locale];
        case "newest": return Number(b.code.slice(4)) - Number(a.code.slice(4));
        default: return b.favorites - a.favorites;
      }
    });
    return out;
  }, [items, q, style, sort, locale]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE);

  const goto = (p: number) => {
    setPage(Math.min(totalPages, Math.max(1, p)));
    document.getElementById("results-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div id="results-top">
      <div className="toolbar" role="search">
        <div className="toolbar-search">
          <Icon name="search" size={16} className="icon" />
          <input
            type="search"
            className="input"
            placeholder={d.common.searchPlaceholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label={d.common.searchResults}
          />
        </div>
        <select
          className="select toolbar-select"
          value={style ?? ""}
          onChange={(e) => setStyle(e.target.value || null)}
          aria-label={d.patternsPage.filters.style}
        >
          <option value="">{d.patternsPage.filters.style}: {d.common.viewAll}</option>
          {styleOptions.map((s) => (
            <option key={s.slug} value={s.slug}>{s.label}</option>
          ))}
        </select>
        <select
          className="select toolbar-select"
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          aria-label={d.patternsPage.filters.sort}
        >
          <option value="popular">{d.common.popular}</option>
          <option value="newest">{d.common.newest}</option>
          <option value="price-asc">{d.common.priceLow}</option>
          <option value="price-desc">{d.common.priceHigh}</option>
        </select>
        <span className="toolbar-count">
          {sprintf(countLabel, formatNumber(locale, filtered.length))}
        </span>
      </div>

      {pageItems.length === 0 ? (
        <EmptyState title={d.common.noResults} hint={d.common.noResultsHint} />
      ) : (
        <div className="cards-grid">
          {pageItems.map((p) => (
            <PatternCard key={p.slug} pattern={p} locale={locale} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="pagination" aria-label={d.a11y.pagination}>
          <button className={cx("page-arrow", clampedPage <= 1 && "is-disabled")} onClick={() => goto(clampedPage - 1)} aria-label={d.a11y.prevPage} disabled={clampedPage <= 1}>
            <Icon name="arrow-right" size={16} flipRtl />
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={cx("page-num", p === clampedPage && "is-active")} onClick={() => goto(p)} aria-current={p === clampedPage ? "page" : undefined}>
                {formatNumber(locale, p)}
              </button>
            ))}
          </div>
          <button className={cx("page-arrow", clampedPage >= totalPages && "is-disabled")} onClick={() => goto(clampedPage + 1)} aria-label={d.a11y.nextPage} disabled={clampedPage >= totalPages}>
            <Icon name="arrow-left" size={16} flipRtl />
          </button>
        </nav>
      )}
    </div>
  );
}
