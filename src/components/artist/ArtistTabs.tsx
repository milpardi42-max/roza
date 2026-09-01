"use client";

import { useState } from "react";
import type { Locale, Pattern, Product, Portfolio } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { cx, formatNumber } from "@/lib/utils";
import { PatternCard } from "@/components/cards/PatternCard";
import { ProductCard } from "@/components/cards/ProductCard";
import { PortfolioCard } from "@/components/cards/PortfolioCard";
import { EmptyState } from "@/components/ui/EmptyState";

export function ArtistTabs({
  locale,
  patterns: pats,
  products: prods,
  folios,
}: {
  locale: Locale;
  patterns: Pattern[];
  products: Product[];
  folios: Portfolio[];
}) {
  const d = getDictionary(locale);
  const [tab, setTab] = useState<"patterns" | "products" | "portfolio">("patterns");

  const tabs = [
    { key: "patterns" as const, label: d.artistProfile.tabs.patterns, count: pats.length },
    { key: "products" as const, label: d.artistProfile.tabs.products, count: prods.length },
    { key: "portfolio" as const, label: d.artistProfile.tabs.portfolio, count: folios.length },
  ];

  return (
    <div>
      <div className="tabs" role="tablist" aria-label={d.artistProfile.tabs.patterns}>
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={cx("ptab", tab === t.key && "is-active")}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <span className="ptab-count tnum"> ({formatNumber(locale, t.count)})</span>
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {tab === "patterns" &&
          (pats.length ? (
            <div className="cards-grid">
              {pats.map((p) => <PatternCard key={p.slug} pattern={p} locale={locale} />)}
            </div>
          ) : (
            <EmptyState title={d.common.noResults} />
          ))}
        {tab === "products" &&
          (prods.length ? (
            <div className="cards-grid">
              {prods.map((p) => <ProductCard key={p.slug} product={p} locale={locale} />)}
            </div>
          ) : (
            <EmptyState title={d.common.noResults} />
          ))}
        {tab === "portfolio" &&
          (folios.length ? (
            <div className="cards-grid cards-grid-wide">
              {folios.map((p) => <PortfolioCard key={p.slug} project={p} locale={locale} />)}
            </div>
          ) : (
            <EmptyState title={d.common.noResults} />
          ))}
      </div>
    </div>
  );
}
