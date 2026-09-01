"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale, Product } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { cx, formatNumber, href } from "@/lib/utils";
import { useCommerce } from "@/components/commerce/CommerceContext";
import { QuantitySelector, FavoriteButton } from "@/components/commerce/CommerceButtons";
import { Icon } from "@/components/ui/Icon";

export function ProductPurchase({ product, locale }: { product: Product; locale: Locale }) {
  const d = getDictionary(locale);
  const { add } = useCommerce();
  const [qty, setQty] = useState(1);
  const [variantId, setVariantId] = useState<string | undefined>(product.variants?.[0]?.id);
  const soldOut = product.availability === "sold-out";

  return (
    <>
      {product.variants && product.variants.length > 1 && (
        <div className="pd-choices">
          <p className="pd-choices-label">
            {product.variants[0].label[locale]}: <span className="text-muted fw-500">{formatNumber(locale, product.variants.length)} {locale === "fa" ? "گزینه" : "options"}</span>
          </p>
          <div className="chip-row" style={{ paddingBottom: 0 }} role="group" aria-label={product.variants[0].label[locale]}>
            {product.variants.map((v) => (
              <button
                key={v.id}
                className={cx("chip", variantId === v.id && "is-active")}
                onClick={() => setVariantId(v.id)}
                aria-pressed={variantId === v.id}
              >
                <span className="tnum">{v.option[locale]}</span>
                {v.priceDelta && v.priceDelta[locale] > 0 && (
                  <span className="text-muted" style={{ fontSize: "0.85em" }}>
                    +{formatNumber(locale, v.priceDelta[locale])}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pd-actions">
        <QuantitySelector value={qty} onChange={setQty} locale={locale} />
        <button
          type="button"
          className="btn btn-primary"
          disabled={soldOut}
          onClick={() => add(product.slug, qty, variantId)}
        >
          <Icon name="bag" size={17} />
          <span className="btn-label">{d.common.addToCart}</span>
        </button>
        <Link
          href={href(locale, "/checkout")}
          className="btn btn-accent"
          style={soldOut ? { pointerEvents: "none", opacity: 0.5 } : undefined}
          onClick={() => !soldOut && add(product.slug, qty, variantId)}
          aria-disabled={soldOut}
        >
          <Icon name="card" size={17} />
          <span className="btn-label">{d.common.buyNow}</span>
        </Link>
        <FavoriteButton slug={product.slug} locale={locale} />
      </div>
    </>
  );
}
