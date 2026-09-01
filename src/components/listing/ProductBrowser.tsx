"use client";

import { useMemo, useState, useEffect } from "react";
import type { Locale, Product } from "@/lib/types";
import { getDictionary, sprintf } from "@/lib/i18n";
import { cx, formatNumber } from "@/lib/utils";
import { ProductCard } from "@/components/cards/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";

type Sort = "newest" | "popular" | "price-asc" | "price-desc";

const PAGE_SIZE = 8;

export function ProductBrowser({
  items,
  locale,
  categories,
  fixedCategory,
  countLabel,
  pageSize = PAGE_SIZE,
}: {
  items: Product[];
  locale: Locale;
  categories?: { slug: string; label: string }[];
  fixedCategory?: string;
  countLabel: string;
  pageSize?: number;
}) {
  const d = getDictionary(locale);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(fixedCategory ?? null);
  const [sort, setSort] = useState<Sort>("newest");
  const [page, setPage] = useState(1);

  useEffect(() => setCat(fixedCategory ?? null), [fixedCategory]);
  useEffect(() => setPage(1), [q, cat, sort]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let out = items.filter((p) => (cat ? p.categorySlug === cat : true));
    if (query) {
      out = out.filter((p) =>
        [
          p.name.fa, p.name.en, p.sku, p.category.fa, p.category.en,
          p.material?.fa, p.material?.en, p.colorName?.fa, p.colorName?.en, p.shortDescription.fa,
        ].some((s) => s && s.toLowerCase().includes(query))
      );
    }
    const price = (p: Product) => (p.salePrice ?? p.price)[locale];
    out = [...out].sort((a, b) => {
      switch (sort) {
        case "price-asc": return price(a) - price(b);
        case "price-desc": return price(b) - price(a);
        case "popular": return (b.rating ?? 0) * (b.reviewsCount ?? 0) - (a.rating ?? 0) * (a.reviewsCount ?? 0);
        default: return Number(b.sku.slice(4)) - Number(a.sku.slice(4));
      }
    });
    return out;
  }, [items, q, cat, sort, locale]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

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
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          aria-label={d.common.sort}
        >
          <option value="newest">{d.common.newest}</option>
          <option value="popular">{d.common.popular}</option>
          <option value="price-asc">{d.common.priceLow}</option>
          <option value="price-desc">{d.common.priceHigh}</option>
        </select>
        <span className="toolbar-count">
          {sprintf(countLabel, formatNumber(locale, filtered.length))}
        </span>
      </div>

      {categories && categories.length > 0 && (
        <div className="chip-row" role="group" aria-label={d.common.category}>
          <button className={cx("chip", cat === null && "is-active")} onClick={() => setCat(null)}>
            {d.common.viewAll}
          </button>
          {categories.map((c) => (
            <button key={c.slug} className={cx("chip", cat === c.slug && "is-active")} onClick={() => setCat(c.slug)}>
              {c.label}
            </button>
          ))}
        </div>
      )}

      {pageItems.length === 0 ? (
        <EmptyState title={d.common.noResults} hint={d.common.noResultsHint} ctaLabel={d.common.clearFilters} ctaHref="#results-top" />
      ) : (
        <div className="cards-grid">
          {pageItems.map((p) => (
            <ProductCard key={p.slug} product={p} locale={locale} />
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
