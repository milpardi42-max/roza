"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { href, formatPrice } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { patterns } from "@/lib/data/patterns";
import { products } from "@/lib/data/products";
import { artists } from "@/lib/data/artists";
import { portfolios } from "@/lib/data/catalog";
import { education } from "@/lib/data/catalog";
import { Icon } from "@/components/ui/Icon";
import { PatternArt } from "@/components/ui/PatternArt";
import FXImg from "@/components/fx/FXImg";

interface Hit {
  type: "patterns" | "products" | "artists" | "portfolios" | "education";
  key: string;
  title: string;
  sub: string;
  url: string;
  thumb: { kind: "img"; src: string } | { kind: "scheme"; scheme: (typeof patterns)[0]["scheme"] };
}

export function SearchOverlay({ locale, onClose }: { locale: Locale; onClose: () => void }) {
  const d = getDictionary(locale);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const otherLocale: Locale = locale === "fa" ? "en" : "fa";

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const hits = useMemo<Hit[]>(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    const match = (...parts: (string | undefined)[]) =>
      parts.some((p) => p && p.toLowerCase().includes(query));

    const results: Hit[] = [];
    for (const p of patterns) {
      if (match(p.name[locale], p.name[otherLocale], p.code, p.style[locale], p.category[locale], p.creatorSlug))
        results.push({
          type: "patterns", key: p.slug, title: p.name[locale],
          sub: `${p.code} · ${p.style[locale]}`,
          url: href(locale, `/patterns/${p.slug}`),
          thumb: { kind: "scheme", scheme: p.scheme },
        });
    }
    for (const p of products) {
      if (match(p.name[locale], p.name[otherLocale], p.sku, p.category[locale], p.material?.[locale], p.colorName?.[locale]))
        results.push({
          type: "products", key: p.slug, title: p.name[locale],
          sub: `${p.sku} · ${formatPrice(locale, p.salePrice ?? p.price)}`,
          url: href(locale, `/products/${p.slug}`),
          thumb: p.images[0] ? { kind: "img", src: p.images[0] } : { kind: "scheme", scheme: patterns.find((x) => x.slug === p.patternSlug)?.scheme ?? { motif: "dots", bg: "#eee", fg: "#999" } },
        });
    }
    for (const a of artists) {
      if (match(a.name[locale], a.name[otherLocale], a.profession[locale], a.location[locale]))
        results.push({
          type: "artists", key: a.slug, title: a.name[locale], sub: a.profession[locale],
          url: href(locale, `/artists/${a.slug}`),
          thumb: { kind: "img", src: a.avatar },
        });
    }
    for (const pf of portfolios) {
      if (match(pf.title[locale], pf.title[otherLocale], pf.category[locale], pf.location[locale]))
        results.push({
          type: "portfolios", key: pf.slug, title: pf.title[locale],
          sub: `${pf.category[locale]} · ${pf.year}`,
          url: href(locale, `/portfolio/${pf.slug}`),
          thumb: { kind: "img", src: pf.cover },
        });
    }
    for (const e of education) {
      if (match(e.title[locale], e.title[otherLocale], e.category[locale], e.excerpt[locale]))
        results.push({
          type: "education", key: e.slug, title: e.title[locale],
          sub: `${d.kinds[e.kind]} · ${e.duration[locale]}`,
          url: href(locale, `/education/${e.slug}`),
          thumb: e.cover
            ? { kind: "img", src: e.cover }
            : { kind: "scheme", scheme: e.coverScheme ?? { motif: "dots", bg: "#eee", fg: "#999" } },
        });
    }
    return results.slice(0, 18);
  }, [q, locale, otherLocale, d]);

  const grouped = useMemo(() => {
    const g = new Map<Hit["type"], Hit[]>();
    for (const h of hits) {
      const arr = g.get(h.type) ?? [];
      arr.push(h);
      g.set(h.type, arr);
    }
    return Array.from(g.entries());
  }, [hits]);

  useEffect(() => setActive(0), [hits.length]);

  const flatHits = hits;

  const onKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(flatHits.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" && flatHits[active]) {
      window.location.href = flatHits[active].url;
    }
  };

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label={d.search.title}>
      <div className="search-panel">
        <div className="search-input-row">
          <Icon name="search" size={20} className="search-ico" />
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyNav}
            placeholder={d.common.searchPlaceholder}
            aria-label={d.search.title}
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={flatHits[active] ? `hit-${active}` : undefined}
          />
          <button className="icon-btn" onClick={onClose} aria-label={d.nav.close}>
            <Icon name="x" size={20} />
          </button>
        </div>
        <p className="search-hint">{d.search.hint}</p>

        <div className="search-results" id="search-results" role="listbox">
          {!q.trim() && <p className="search-empty">{d.search.empty}</p>}
          {q.trim() && hits.length === 0 && <p className="search-empty">{d.search.none}</p>}

          {grouped.map(([type, group]) => {
            let index = -1;
            return (
              <section key={type} className="search-group">
                <h4>{d.search.groups[type]}</h4>
                <ul role="list">
                  {group.map((h) => {
                    index = flatHits.indexOf(h);
                    return (
                      <li key={h.key}>
                        <Link
                          href={h.url}
                          id={`hit-${index}`}
                          role="option"
                          aria-selected={index === active}
                          className={`search-hit ${index === active ? "is-active" : ""}`}
                          onClick={onClose}
                        >
                          <span className="search-thumb" aria-hidden="true">
                            {h.thumb.kind === "img" ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <FXImg src={h.thumb.src} alt="" loading="lazy" />
                            ) : (
                              <PatternArt scheme={h.thumb.scheme} />
                            )}
                          </span>
                          <span className="search-hit-text">
                            <strong>{h.title}</strong>
                            <span>{h.sub}</span>
                          </span>
                          <Icon name="arrow-left" size={15} flipRtl className="search-hit-arrow" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
