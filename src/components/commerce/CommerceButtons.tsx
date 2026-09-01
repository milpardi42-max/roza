"use client";

import { useState } from "react";
import { cx } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { useCommerce } from "./CommerceContext";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";

export function AddToCartButton({
  slug,
  locale,
  variantId,
  qty = 1,
  size = "md",
  block = false,
  className,
}: {
  slug: string;
  locale: Locale;
  variantId?: string;
  qty?: number;
  size?: "sm" | "md";
  block?: boolean;
  className?: string;
}) {
  const { add } = useCommerce();
  const d = getDictionary(locale);
  return (
    <button
      type="button"
      className={cx("btn btn-primary", size === "sm" && "btn-sm", block && "btn-block", className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add(slug, qty, variantId);
      }}
      aria-label={d.a11y.addToCartLabel}
    >
      <Icon name="bag" size={size === "sm" ? 15 : 17} />
      <span className="btn-label">{d.common.addToCart}</span>
    </button>
  );
}

export function FavoriteButton({
  slug,
  locale,
  className,
  onCard = false,
}: {
  slug: string;
  locale: Locale;
  className?: string;
  onCard?: boolean;
}) {
  const { toggleWishlist, inWishlist, mounted } = useCommerce();
  const d = getDictionary(locale);
  const active = mounted && inWishlist(slug);
  return (
    <button
      type="button"
      className={cx("icon-btn fav-btn", onCard && "fav-on-card", active && "is-active", className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(slug);
      }}
      aria-pressed={active}
      aria-label={active ? d.a11y.unfavoriteLabel : d.a11y.favoriteLabel}
      title={active ? d.common.favorited : d.common.favorite}
    >
      <Icon name={active ? "heart-solid" : "heart"} size={17} />
    </button>
  );
}

export function QuantitySelector({
  value,
  onChange,
  locale,
  small = false,
}: {
  value: number;
  onChange: (qty: number) => void;
  locale: Locale;
  small?: boolean;
}) {
  const d = getDictionary(locale);
  return (
    <div className={cx("qty", small && "qty-sm")}>
      <button
        type="button"
        className="qty-btn"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label={d.a11y.decreaseQty}
        disabled={value <= 1}
      >
        <Icon name="minus" size={14} />
      </button>
      <span className="qty-value" aria-live="polite">
        {new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value)}
      </span>
      <button type="button" className="qty-btn" onClick={() => onChange(Math.min(99, value + 1))} aria-label={d.a11y.increaseQty}>
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}

/** client wrapper used on detail pages for qty + add */
export function AddToCartPanel({ slug, locale }: { slug: string; locale: Locale }) {
  const [qty, setQty] = useState(1);
  const [variantId, setVariantId] = useState<string | undefined>();
  return (
    <div className="add-panel">
      <QuantitySelector value={qty} onChange={setQty} locale={locale} />
      <AddToCartButton slug={slug} locale={locale} qty={qty} variantId={variantId} className="add-panel-cta" />
    </div>
  );
}
