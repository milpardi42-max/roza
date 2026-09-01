import Link from "next/link";
import type { Locale, Product } from "@/lib/types";
import { cx, href, formatNumber } from "@/lib/utils";
import { getPattern } from "@/lib/data/patterns";
import { getDictionary } from "@/lib/i18n";
import { PatternArt } from "@/components/ui/PatternArt";
import { TagBadge, AvailabilityBadge } from "@/components/ui/Badge";
import { Price, SalePercent } from "@/components/ui/Price";
import { FavoriteButton, AddToCartButton } from "@/components/commerce/CommerceButtons";
import { QuickViewButton } from "@/components/commerce/QuickView";
import FXImg from "@/components/fx/FXImg";

/** Information-rich product card — image, SKU, category, specs,
    variants, price, availability, favourite, quick view, add-to-cart. */
export function ProductCard({
  product,
  locale,
  priority = false,
}: {
  product: Product;
  locale: Locale;
  priority?: boolean;
}) {
  const d = getDictionary(locale);
  const pattern = product.patternSlug ? getPattern(product.patternSlug) : undefined;
  const productUrl = href(locale, `/products/${product.slug}`);
  const onSale = !!product.salePrice && product.salePrice.fa < product.price.fa;

  return (
    <article className={cx("pcard hover-lift", product.availability === "sold-out" && "is-soldout")}>
      <div className="pcard-media img-zoom">
        <Link href={productUrl} className="pcard-media-link" aria-label={product.name[locale]} tabIndex={-1}>
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <FXImg
              src={product.images[0]}
              alt={product.imageAlt?.[locale] ?? product.name[locale]}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
            />
          ) : pattern ? (
            <PatternArt scheme={pattern.scheme} ariaLabel={pattern.name[locale]} />
          ) : null}
        </Link>

        <div className="pcard-badges">
          {product.tags?.slice(0, 2).map((t) => <TagBadge key={t} locale={locale} tag={t} />)}
          {onSale && <SalePercent price={product.price} salePrice={product.salePrice!} />}
        </div>

        <FavoriteButton slug={product.slug} locale={locale} onCard />

        <div className="pcard-quick">
          <QuickViewButton slug={product.slug} locale={locale} />
        </div>
      </div>

      <div className="pcard-body">
        <div className="pcard-head">
          <h3 className="pcard-name">
            <Link href={productUrl}>{product.name[locale]}</Link>
          </h3>
          <span className="sku tnum" title={d.common.sku}>{product.sku}</span>
        </div>

        <p className="pcard-cat">{product.category[locale]}</p>

        <dl className="pcard-specs">
          {product.material && (
            <div className="pcard-spec">
              <dt>{d.common.material}</dt>
              <dd>{product.material[locale]}</dd>
            </div>
          )}
          {product.dimensions && (
            <div className="pcard-spec">
              <dt>{d.common.dimensions}</dt>
              <dd className="tnum">{product.dimensions[locale]}</dd>
            </div>
          )}
        </dl>

        <div className="pcard-meta">
          {product.colors.length > 0 && (
            <span className="pcard-swatches" role="img" aria-label={product.colorName?.[locale]}>
              {product.colors.slice(0, 4).map((c) => (
                <span key={c} style={{ background: c }} />
              ))}
            </span>
          )}
          {product.variants && product.variants.length > 1 && (
            <span className="pcard-variants">
              {locale === "fa"
                ? `${formatNumber(locale, product.variants.length)} اندازه`
                : `${product.variants.length} sizes`}
            </span>
          )}
          <AvailabilityBadge locale={locale} value={product.availability} />
        </div>

        <div className="pcard-foot">
          <Price locale={locale} price={product.price} salePrice={product.salePrice} />
          <AddToCartButton slug={product.slug} locale={locale} size="sm" />
        </div>
      </div>
    </article>
  );
}
