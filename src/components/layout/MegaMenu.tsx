"use client";

import Link from "next/link";
import { href } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { patterns } from "@/lib/data/patterns";
import { categories, collections } from "@/lib/data/catalog";
import { styles } from "@/lib/data/catalog";
import { PatternArt } from "@/components/ui/PatternArt";
import { Icon } from "@/components/ui/Icon";
import FXImg from "@/components/fx/FXImg";

/* Editorial mega-menu: visual thumbs + grouped links + staggered reveal */
export function MegaMenu({
  kind,
  locale,
  onNavigate,
}: {
  kind: "patterns" | "store";
  locale: Locale;
  onNavigate: () => void;
}) {
  const d = getDictionary(locale);
  const featuredPatterns = patterns.filter((p) => p.trending).slice(0, 4);
  const featuredCats = categories.slice(0, 4);
  const collection = collections[0];

  return (
    <div className="mega" role="region" aria-label={kind}>
      {kind === "patterns" && (
        <div className="mega-grid">
          <div className="mega-col mega-col-links">
            <p className="mega-col-title">{d.mega.columns.motifs}</p>
            <ul role="list">
              {styles.slice(0, 6).map((s, i) => (
                <li key={s.slug} className="mega-item" style={{ "--i": i } as React.CSSProperties}>
                  <Link href={href(locale, `/patterns?style=${s.slug}`)} onClick={onNavigate} className="mega-link">
                    <span className="mega-swatch" aria-hidden="true">
                      <PatternArt scheme={s.scheme} />
                    </span>
                    <span>
                      <span className="mega-link-title">{s.name[locale]}</span>
                      <span className="mega-link-desc">{s.description[locale]}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mega-col mega-col-visual">
            <p className="mega-col-title">{d.mega.featured}</p>
            <div className="mega-thumbs">
              {featuredPatterns.map((p, i) => (
                <Link
                  key={p.slug}
                  href={href(locale, `/patterns/${p.slug}`)}
                  onClick={onNavigate}
                  className="mega-thumb mega-item"
                  style={{ "--i": i + 2 } as React.CSSProperties}
                >
                  <span className="mega-thumb-art"><PatternArt scheme={p.scheme} /></span>
                  <span className="mega-thumb-name">{p.name[locale]}</span>
                </Link>
              ))}
            </div>
            <Link href={href(locale, "/patterns")} onClick={onNavigate} className="btn-arrow mega-all">
              <span className="btn-label">{d.mega.viewAll}</span>
              <Icon name="arrow-right" size={15} flipRtl />
            </Link>
          </div>
        </div>
      )}

      {kind === "store" && (
        <div className="mega-grid mega-grid-store">
          <div className="mega-col mega-col-links">
            <p className="mega-col-title">{d.mega.columns.categories}</p>
            <ul role="list" className="mega-cats">
              {categories.map((c, i) => (
                <li key={c.slug} className="mega-item" style={{ "--i": i } as React.CSSProperties}>
                  <Link href={href(locale, `/store/category/${c.slug}`)} onClick={onNavigate} className="mega-cat-link">
                    {c.name[locale]}
                    <Icon name="arrow-left" size={13} flipRtl className="mega-cat-arrow" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mega-col mega-col-visual">
            <div className="mega-thumbs mega-thumbs-store">
              {featuredCats.map((c, i) => (
                <Link
                  key={c.slug}
                  href={href(locale, `/store/category/${c.slug}`)}
                  onClick={onNavigate}
                  className="mega-thumb mega-item"
                  style={{ "--i": i + 2 } as React.CSSProperties}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <span className="mega-thumb-art"><FXImg src={c.image} alt="" loading="lazy" /></span>
                  <span className="mega-thumb-name">{c.name[locale]}</span>
                </Link>
              ))}
            </div>
            <Link href={href(locale, "/collections/desert-light")} onClick={onNavigate} className="mega-promo mega-item" style={{ "--i": 7 } as React.CSSProperties}>
              <span className="mega-promo-art">
                <PatternArt scheme={collection.scheme} />
              </span>
              <span className="mega-promo-text">
                <span className="mega-promo-tag">{d.common.exclusive}</span>
                <strong>{collection.title[locale]}</strong>
                <span>{collection.description[locale]}</span>
              </span>
              <Icon name="arrow-left" size={16} flipRtl />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
