import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { href, formatNumber } from "@/lib/utils";
import { products, productsByCategory } from "@/lib/data/products";
import { categories, collections } from "@/lib/data/catalog";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PatternArt } from "@/components/ui/PatternArt";
import { ProductCard } from "@/components/cards/ProductCard";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { PageHeroArt } from "@/components/ui/PageHeroArt";

import FXImg from "@/components/fx/FXImg";

export function generateStaticParams(): Array<{ lang: Locale }> {
  return [{ lang: "fa" }, { lang: "en" }];
}


export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(lang);
  return seo({ locale: lang, title: d.storePage.heroTitle, description: d.storePage.heroSubtitle, path: "/store", image: "/assets/images/products/cushion-bamyan.jpg" });
}

export default async function StorePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  const sp = d.storePage;

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const newArrivals = products.filter((p) => p.tags?.includes("new")).slice(0, 4);
  const bestSellers = products.filter((p) => p.tags?.includes("bestseller")).slice(0, 4);
  const recommended = products.filter((p) => p.tags?.includes("sale")).slice(0, 3);
  const collection = collections[0];

  const catsWithCount = categories
    .map((c) => ({ ...c, count: productsByCategory(c.slug).length }))
    .filter((c) => c.count > 0);

  return (
    <>
      {/* store hero */}
      <header className="page-hero has-photo">
        <PageHeroArt src="/assets/images/hero/pages/store.jpg" focus="50% 62%" />
        <div className="container">
          <Breadcrumb locale={locale} items={[{ label: d.nav.home, href: href(locale) }, { label: sp.heroTitle }]} />
          <h1 className="page-hero-title">{sp.heroTitle}</h1>
          <p className="page-hero-lead">{sp.heroSubtitle}</p>
          <div className="cluster" style={{ marginTop: "var(--space-5)" }}>
            <Button variant="primary" href={href(locale, "/products")} icon="bag">{sp.browseAll}</Button>
            <Button variant="arrow" href={href(locale, `/collections/${collection.slug}`)} icon="arrow-right" iconEnd>
              {collection.title[locale]}
            </Button>
          </div>
        </div>
      </header>

      {/* categories */}
      <section className="container section" aria-labelledby="store-cats">
        <Reveal>
          <SectionHeader title={sp.categories} cta={{ href: href(locale, "/products"), label: d.common.viewAll }} />
        </Reveal>
        <div className="store-cats">
          {catsWithCount.map((c, i) => (
            <Reveal key={c.slug} delay={i % 4}>
              <Link href={href(locale, `/store/category/${c.slug}`)} className="style-tile" style={{ aspectRatio: "1 / 1.05" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <FXImg src={c.image} alt={c.name[locale]} loading="lazy" decoding="async" />
                <span className="style-tile-inner">
                  <span className="style-tile-name">{c.name[locale]}</span>
                  <span className="style-tile-desc tnum">{formatNumber(locale, c.count)} {d.productsPage.title}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* featured */}
      <section className="container section-tight" aria-labelledby="store-featured">
        <Reveal>
          <SectionHeader title={sp.featured} cta={{ href: href(locale, "/products?sort=popular"), label: d.common.viewAll }} />
        </Reveal>
        <div className="cards-grid">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i}><ProductCard product={p} locale={locale} priority={i < 2} /></Reveal>
          ))}
        </div>
      </section>

      {/* promo band */}
      <section className="container section-tight">
        <Reveal>
          <div className="promo-band">
            <span className="promo-art" aria-hidden="true">
              <PatternArt scheme={{ motif: "stripes", bg: "#ffffff", fg: "#f8ecdd", fg2: "#f4e3cd", density: 36 }} />
            </span>
            <div className="promo-inner">
              <p className="promo-kicker"><Icon name="spark" size={15} />{d.common.sale}</p>
              <h2 className="promo-title">{sp.promo.title}</h2>
              <p className="promo-sub tnum">{sp.promo.subtitle}</p>
            </div>
            <Button variant="accent" size="lg" href={href(locale, "/products?sort=price-asc")} className="promo-cta">{sp.promo.cta}</Button>
          </div>
        </Reveal>
      </section>

      {/* new arrivals */}
      <section className="container section-tight" aria-labelledby="store-new">
        <Reveal>
          <SectionHeader title={sp.newArrivals} cta={{ href: href(locale, "/products?sort=newest"), label: d.common.viewAll }} />
        </Reveal>
        <div className="cards-grid">
          {newArrivals.map((p, i) => (
            <Reveal key={p.slug} delay={i}><ProductCard product={p} locale={locale} /></Reveal>
          ))}
        </div>
      </section>

      {/* exclusive collection */}
      <section className="container section" aria-labelledby="store-exclusive">
        <Reveal>
          <div className="exclusive">
            <div className="exclusive-art" aria-hidden="true">
              <PatternArt scheme={collection.scheme} />
            </div>
            <div className="exclusive-body">
              <p className="eyebrow">{sp.exclusive}</p>
              <h2 className="exclusive-title">{collection.title[locale]}</h2>
              <p className="exclusive-desc">{collection.description[locale]}</p>
              <div>
                <Button variant="accent" size="lg" href={href(locale, `/collections/${collection.slug}`)}>
                  {d.common.viewCollection}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* best sellers */}
      <section className="container section-tight" aria-labelledby="store-best">
        <Reveal>
          <SectionHeader title={sp.bestSellers} cta={{ href: href(locale, "/products?sort=popular"), label: d.common.viewAll }} />
        </Reveal>
        <div className="cards-grid">
          {bestSellers.map((p, i) => (
            <Reveal key={p.slug} delay={i}><ProductCard product={p} locale={locale} /></Reveal>
          ))}
        </div>
      </section>

      {/* recommended */}
      <section className="section section-alt">
        <div className="container">
          <Reveal>
            <SectionHeader title={sp.recommended} cta={{ href: href(locale, "/products"), label: d.common.viewAll }} />
          </Reveal>
          <div className="cards-grid cards-grid-narrow">
            {recommended.map((p, i) => (
              <Reveal key={p.slug} delay={i}><ProductCard product={p} locale={locale} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* newsletter */}
      <section className="container section">
        <Reveal>
          <div className="newsletter-band">
            <span className="newsletter-band-art" aria-hidden="true">
              <PatternArt scheme={{ motif: "rings", bg: "#f9f6f1", fg: "#ece4d8", density: 40 }} />
            </span>
            <p className="eyebrow">{d.home.newsletter.eyebrow}</p>
            <h2 className="newsletter-title">{d.home.newsletter.title}</h2>
            <NewsletterForm locale={locale} />
          </div>
        </Reveal>
      </section>
    </>
  );
}
