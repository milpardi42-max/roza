"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { getProduct } from "@/lib/data/products";
import { getPattern } from "@/lib/data/patterns";
import { formatPrice, href } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { AvailabilityBadge } from "@/components/ui/Badge";
import { QuantitySelector, AddToCartPanel } from "./CommerceButtons";
import { PatternArt } from "@/components/ui/PatternArt";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { useState as useLocalState } from "react";
import FXImg from "@/components/fx/FXImg";

const QuickViewContext = createContext<{ open: (slug: string) => void } | null>(null);

export function useQuickView() {
  const ctx = useContext(QuickViewContext);
  if (!ctx) throw new Error("useQuickView outside provider");
  return ctx;
}

export function QuickViewButton({ slug, locale }: { slug: string; locale: Locale }) {
  const { open } = useQuickView();
  const d = getDictionary(locale);
  return (
    <button
      type="button"
      className="qv-trigger"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        open(slug);
      }}
      aria-label={d.a11y.openQuickView}
    >
      <Icon name="eye" size={16} />
      <span>{d.common.quickView}</span>
    </button>
  );
}

export function QuickViewProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
  const [slug, setSlug] = useState<string | null>(null);
  const open = useCallback((s: string) => setSlug(s), []);
  const close = useCallback(() => setSlug(null), []);
  const d = getDictionary(locale);

  useEffect(() => {
    if (!slug) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [slug, close]);

  const product = slug ? getProduct(slug) : undefined;

  return (
    <QuickViewContext.Provider value={{ open }}>
      {children}
      {product && (
        <div className="qv-backdrop" onClick={close} role="presentation">
          <div
            className="qv-modal"
            role="dialog"
            aria-modal="true"
            aria-label={product.name[locale]}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="qv-close icon-btn" onClick={close} aria-label={d.a11y.closeModal}>
              <Icon name="x" size={18} />
            </button>
            <div className="qv-grid">
              <div className="qv-media">
                {product.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <FXImg src={product.images[0]} alt={product.imageAlt?.[locale] ?? product.name[locale]} />
                ) : product.patternSlug && getPattern(product.patternSlug) ? (
                  <PatternArt scheme={getPattern(product.patternSlug)!.scheme} />
                ) : null}
              </div>
              <div className="qv-info">
                <p className="qv-cat">{product.category[locale]}</p>
                <h3 className="qv-title">{product.name[locale]}</h3>
                <p className="qv-sku tnum">
                  {d.common.sku}: {product.sku}
                </p>
                <div className="qv-stock">
                  <AvailabilityBadge locale={locale} value={product.availability} />
                </div>
                <p className="qv-desc">{product.shortDescription[locale]}</p>
                <dl className="qv-specs">
                  {product.material && (
                    <div>
                      <dt>{d.common.material}</dt>
                      <dd>{product.material[locale]}</dd>
                    </div>
                  )}
                  {product.dimensions && (
                    <div>
                      <dt>{d.common.dimensions}</dt>
                      <dd className="tnum">{product.dimensions[locale]}</dd>
                    </div>
                  )}
                  {product.colorName && (
                    <div>
                      <dt>{d.common.color}</dt>
                      <dd className="qv-colors">
                        {product.colors.map((c) => (
                          <span key={c} className="color-dot" style={{ background: c }} title={c} />
                        ))}
                        <span className="text-secondary">{product.colorName[locale]}</span>
                      </dd>
                    </div>
                  )}
                </dl>
                <div className="qv-price">
                  <strong>{formatPrice(locale, product.salePrice ?? product.price)}</strong>
                  {product.salePrice && <s>{formatPrice(locale, product.price)}</s>}
                </div>
                <AddToCartPanel slug={product.slug} locale={locale} />
                <Link
                  href={href(locale, `/products/${product.slug}`)}
                  className="btn-arrow qv-full"
                  onClick={close}
                >
                  <span className="btn-label">{d.common.viewFullProduct}</span>
                  <Icon name="arrow-right" size={16} flipRtl />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </QuickViewContext.Provider>
  );
}
