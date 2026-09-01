import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo, JsonLd } from "@/lib/seo";
import { href, formatPrice } from "@/lib/utils";
import { products, getProduct, relatedProducts } from "@/lib/data/products";
import { getPattern, relatedPatterns } from "@/lib/data/patterns";
import { getArtist } from "@/lib/data/artists";
import { PatternArt } from "@/components/ui/PatternArt";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Price, SalePercent } from "@/components/ui/Price";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/cards/ProductCard";
import { PatternCard } from "@/components/cards/PatternCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function generateStaticParams() {
  return products.flatMap((p) => [{ lang: "fa", slug: p.slug }, { lang: "en", slug: p.slug }]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return seo({
    locale: lang,
    title: p.name[lang],
    description: p.seo?.description[lang] ?? p.shortDescription[lang],
    path: `/products/${slug}`,
    image: p.images[0],
    type: "product",
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  const product = getProduct(slug);
  if (!product) notFound();

  const pattern = product.patternSlug ? getPattern(product.patternSlug) : undefined;
  const artist = product.artistSlug ? getArtist(product.artistSlug) : undefined;
  const related = relatedProducts(slug, 4);
  const pd = d.productDetail;

  const slides = [
    ...(product.images.length
      ? product.images.map((src) => ({ kind: "image" as const, src, label: product.name[locale] }))
      : []),
    ...(pattern ? [{ kind: "pattern" as const, scheme: pattern.scheme, label: pattern.name[locale] }] : []),
  ];

  const specs = [
    product.sku && { k: d.common.sku, v: product.sku, ltr: true },
    product.category && { k: d.common.category, v: product.category[locale], ltr: false },
    product.material && { k: d.common.material, v: product.material[locale], ltr: false },
    product.dimensions && { k: d.common.dimensions, v: product.dimensions[locale], ltr: false },
    product.colorName && { k: d.common.color, v: product.colorName[locale], ltr: false },
    artist && { k: pd.by, v: artist.name[locale], ltr: false },
    pattern && { k: d.patternsPage.title, v: pattern.name[locale], ltr: false },
  ].filter(Boolean) as { k: string; v: string; ltr: boolean }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name[locale],
    sku: product.sku,
    image: [`https://reziatelier.com${product.images[0]}`],
    description: product.shortDescription[locale],
    brand: { "@type": "Brand", name: "Rezi Atelier" },
    offers: {
      "@type": "Offer",
      priceCurrency: locale === "fa" ? "IRR" : "USD",
      price: (product.salePrice ?? product.price)[locale],
      availability:
        product.availability === "in-stock"
          ? "https://schema.org/InStock"
          : product.availability === "sold-out"
            ? "https://schema.org/OutOfStock"
            : "https://schema.org/LimitedAvailability",
    },
    ...(product.rating
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewsCount ?? 1 } }
      : {}),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="container section-tight pd">
        <Breadcrumb
          locale={locale}
          items={[
            { label: d.nav.home, href: href(locale) },
            { label: d.productsPage.title, href: href(locale, "/products") },
            { label: product.name[locale] },
          ]}
        />

        <Reveal variant="reveal-image">
          <ProductGallery slides={slides} locale={locale} tags={product.tags} availability={product.availability} />
        </Reveal>

        <Reveal delay={1}>
          <div className="pd-info">
            <p className="pd-cat">{product.category[locale]}</p>
            <h1 className="display pd-title">{product.name[locale]}</h1>

            <div className="pd-meta-row">
              <span className="sku tnum">{product.sku}</span>
              {product.rating && (
                <span className="pd-rating">
                  <Icon name="star-solid" size={15} className="star" />
                  {new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(product.rating)}
                  <span className="text-muted fw-500">({new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(product.reviewsCount ?? 0)} {d.common.reviews})</span>
                </span>
              )}
              {product.colorName && (
                <span className="qv-colors">
                  {product.colors.map((c) => (
                    <span key={c} className="color-dot" style={{ background: c }} title={c} />
                  ))}
                  <span className="text-secondary">{product.colorName[locale]}</span>
                </span>
              )}
            </div>

            <div className="pd-price-row">
              <Price locale={locale} price={product.price} salePrice={product.salePrice} size="xl" />
              {product.salePrice && <SalePercent price={product.price} salePrice={product.salePrice} />}
              {product.salePrice && (
                <span className="pd-save">
                  {pd.save} {formatPrice(locale, { fa: product.price.fa - product.salePrice.fa, en: product.price.en - product.salePrice.en })}
                </span>
              )}
            </div>

            <p className="pd-desc">{product.description[locale]}</p>

            <ProductPurchase product={product} locale={locale} />

            <div className="pd-services">
              <p className="service-row">
                <Icon name="truck" size={17} />
                {pd.shippingText}
              </p>
              <p className="service-row">
                <Icon name="shield" size={17} />
                {locale === "fa" ? "ضمانت اصالت کالا و چاپ اورجینال رزی آتلیه" : "Authenticity & original-print guarantee by Rezi Atelier"}
              </p>
              <p className="service-row">
                <Icon name="layers" size={17} />
                {locale === "fa"
                  ? `ساخته‌شده با نگارهٔ اورجینال «${pattern?.name[locale] ?? ""}»`
                  : `Made with the original “${pattern?.name[locale] ?? ""}” motif`}
              </p>
            </div>

            <div className="spec-block">
              <h2 className="spec-title">{pd.specifications}</h2>
              <dl className="spec-table">
                {specs.map((s) => (
                  <div className="spec-row" key={s.k}>
                    <dt>{s.k}</dt>
                    <dd className={s.ltr ? "tnum" : undefined} dir={s.ltr ? "ltr" : undefined}>{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {pattern && (
              <div className="spec-block">
                <h2 className="spec-title">{pd.relatedPattern}</h2>
                <Link href={href(locale, `/patterns/${pattern.slug}`)} className="pattern-artist-mini">
                  <span className="mega-swatch" aria-hidden="true">
                    <PatternArt scheme={pattern.scheme} />
                  </span>
                  <span>
                    <span className="pattern-artist-mini-name">{pattern.name[locale]}</span>
                    <span className="pattern-artist-mini-prof tnum">{pattern.code} · {pattern.style[locale]}</span>
                  </span>
                  <span className="btn-arrow">
                    <span className="btn-label">{d.common.viewPattern}</span>
                    <Icon name="arrow-right" size={14} flipRtl />
                  </span>
                </Link>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      <div className="container section">
        <Reveal>
          <SectionHeader
            title={pd.relatedProducts}
            cta={{ href: href(locale, "/products"), label: d.common.viewAll }}
          />
        </Reveal>
        <div className="cards-grid">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i}>
              <ProductCard product={p} locale={locale} />
            </Reveal>
          ))}
        </div>
      </div>

      {pattern && (
        <div className="container section-tight" style={{ paddingBottom: "var(--space-8)" }}>
          <Reveal>
            <SectionHeader
              title={d.patternDetail.related}
              cta={{ href: href(locale, "/patterns"), label: d.common.viewAll }}
            />
          </Reveal>
          <div className="cards-grid">
            {relatedPatterns(pattern.slug, 4).map((pt, i) => (
              <Reveal key={pt.slug} delay={i}>
                <PatternCard pattern={pt} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
