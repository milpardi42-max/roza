"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { getDictionary, sprintf } from "@/lib/i18n";
import { href, formatPrice, formatNumber } from "@/lib/utils";
import { getProduct } from "@/lib/data/products";
import { getPattern } from "@/lib/data/patterns";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "./CommerceButtons";
import { useCommerce, cartSubtotal } from "./CommerceContext";
import { PatternArt } from "@/components/ui/PatternArt";
import FXImg from "@/components/fx/FXImg";

const FREE_SHIP: Record<Locale, number> = { fa: 2500000, en: 50 };

export function CartView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const c = d.cart;
  const { lines, setQty, remove, saved, saveForLater, moveToCart, mounted } = useCommerce();

  const rows = useMemo(
    () =>
      lines
        .map((l) => {
          const p = getProduct(l.productSlug);
          if (!p) return null;
          const variant = p.variants?.find((v) => v.id === l.variantId);
          const unit = (p.salePrice ?? p.price)[locale] + (variant?.priceDelta?.[locale] ?? 0);
          return { line: l, product: p, variant, unit, total: unit * l.qty };
        })
        .filter(Boolean) as {
        line: (typeof lines)[0];
        product: NonNullable<ReturnType<typeof getProduct>>;
        variant: { option: Record<Locale, string> } | undefined;
        unit: number;
        total: number;
      }[],
    [lines, locale]
  );

  const subtotal = cartSubtotal(lines, locale);
  const freeShip = subtotal >= FREE_SHIP[locale];
  const shipping = lines.length === 0 || freeShip ? 0 : locale === "fa" ? 180000 : 6;
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIP[locale]) * 100));

  if (!mounted) {
    return <div className="section-tight" aria-busy="true" />;
  }

  if (lines.length === 0) {
    return (
      <div className="section-tight" style={{ maxWidth: "34rem", marginInline: "auto" }}>
        <EmptyState title={c.empty} hint={c.emptyHint} ctaLabel={c.emptyCta} ctaHref={href(locale, "/store")} />
        {saved.length > 0 && <SavedGrid locale={locale} saved={saved} moveToCart={moveToCart} />}
      </div>
    );
  }

  return (
    <div className="cart-layout section-tight">
      <div>
        <div className="cart-lines">
          {rows.map(({ line, product, variant, unit, total }) => {
            const pattern = product.patternSlug ? getPattern(product.patternSlug) : undefined;
            return (
              <div className="cart-line" key={`${line.productSlug}-${line.variantId ?? ""}`}>
                <Link href={href(locale, `/products/${product.slug}`)} className="cart-line-img" aria-label={product.name[locale]}>
                  {product.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <FXImg src={product.images[0]} alt="" loading="lazy" />
                  ) : pattern ? (
                    <PatternArt scheme={pattern.scheme} />
                  ) : null}
                </Link>
                <div className="cart-line-info">
                  <Link href={href(locale, `/products/${product.slug}`)} className="cart-line-name">
                    {product.name[locale]}
                  </Link>
                  <span className="cart-line-sku tnum">{product.sku}</span>
                  <span className="cart-line-spec">
                    {product.material?.[locale]}
                    {product.dimensions ? ` · ${product.dimensions[locale]}` : ""}
                    {variant ? ` · ${variant.option[locale]}` : ""}
                  </span>
                  <div className="cart-line-actions-row">
                    <QuantitySelector
                      value={line.qty}
                      onChange={(q) => setQty(line.productSlug, q, line.variantId)}
                      locale={locale}
                      small
                    />
                    <button className="cart-line-link" onClick={() => saveForLater(product.slug)}>
                      <Icon name="copy" size={13} />
                      {c.saveForLater}
                    </button>
                    <button className="cart-line-link danger" onClick={() => remove(line.productSlug, line.variantId)}>
                      <Icon name="trash" size={13} />
                      {c.remove}
                    </button>
                  </div>
                </div>
                <div className="cart-line-price">
                  <span className="price price-sm">
                    <span className="price-current">{formatPrice(locale, { fa: total, en: total })}</span>
                  </span>
                  {line.qty > 1 && (
                    <span className="text-muted text-xs tnum">
                      {formatNumber(locale, unit)} {d.productDetail.perUnit}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "var(--space-4)" }}>
          <Button variant="arrow" href={href(locale, "/store")} icon="arrow-left" iconEnd={false}>
            {c.continueShopping}
          </Button>
        </div>

        {saved.length > 0 && <SavedGrid locale={locale} saved={saved} moveToCart={moveToCart} />}
      </div>

      <aside className="summary-card" aria-label={c.orderSummary}>
        <p className="summary-title">{c.orderSummary}</p>
        <div className="summary-row">
          <span>{c.subtotal}</span>
          <span className="tnum">{formatPrice(locale, { fa: subtotal, en: subtotal })}</span>
        </div>
        <div className="summary-row">
          <span>{c.shipping}</span>
          <span className="tnum">{shipping === 0 ? c.free : formatPrice(locale, { fa: shipping, en: shipping })}</span>
        </div>
        {!freeShip && (
          <>
            <div className="free-ship-bar" aria-hidden="true"><span style={{ inlineSize: `${progress}%` }} /></div>
            <p className="summary-note">{sprintf(c.freeShippingNote, formatPrice(locale, { fa: FREE_SHIP[locale] - subtotal, en: FREE_SHIP[locale] - subtotal }))}</p>
          </>
        )}
        <div className="summary-discount">
          <input className="input" placeholder={c.discountPlaceholder} aria-label={c.discount} dir="ltr" />
          <button className="btn btn-outline btn-sm" type="button">{c.apply}</button>
        </div>
        <div className="summary-row total">
          <span>{c.total}</span>
          <span className="tnum">{formatPrice(locale, { fa: subtotal + shipping, en: subtotal + shipping })}</span>
        </div>
        <Button variant="primary" href={href(locale, "/checkout")} block icon="card">
          {c.checkout}
        </Button>
        <p className="secure-note">
          <Icon name="shield" size={14} />
          {d.checkout.secure}
        </p>
      </aside>
    </div>
  );
}

function SavedGrid({
  locale,
  saved,
  moveToCart,
}: {
  locale: Locale;
  saved: string[];
  moveToCart: (s: string) => void;
}) {
  const d = getDictionary(locale);
  const items = saved.map((s) => getProduct(s)).filter(Boolean);
  if (!items.length) return null;
  return (
    <div style={{ marginTop: "var(--space-10)" }}>
      <h2 className="spec-title" style={{ marginBottom: "var(--space-4)" }}>{d.cart.savedForLater}</h2>
      <div className="cart-lines">
        {items.map((p) => (
          <div className="cart-line" key={p!.slug} style={{ gridTemplateColumns: "5.5rem 1fr auto" }}>
            <Link href={href(locale, `/products/${p!.slug}`)} className="cart-line-img" style={{ inlineSize: "5.5rem", blockSize: "5.5rem" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <FXImg src={p!.images[0]} alt="" loading="lazy" />
            </Link>
            <div className="cart-line-info">
              <span className="cart-line-name">{p!.name[locale]}</span>
              <span className="cart-line-sku tnum">{p!.sku}</span>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => moveToCart(p!.slug)}>
              <Icon name="bag" size={14} />
              <span className="btn-label">{d.cart.moveToCart}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
