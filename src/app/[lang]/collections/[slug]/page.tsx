import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { href } from "@/lib/utils";
import { collections, getCollection } from "@/lib/data/catalog";
import { getProduct } from "@/lib/data/products";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { PatternArt } from "@/components/ui/PatternArt";
import { ProductCard } from "@/components/cards/ProductCard";

export function generateStaticParams() {
  return collections.flatMap((c) => [{ lang: "fa", slug: c.slug }, { lang: "en", slug: c.slug }]);
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const c = getCollection(slug);
  if (!c) return {};
  return seo({ locale: lang, title: c.title[lang], description: c.description[lang], path: `/collections/${slug}` });
}

export default async function CollectionPage({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  const collection = getCollection(slug);
  if (!collection) notFound();

  const items = collection.productSlugs.map((s) => getProduct(s)).filter(Boolean);
  const others = collections.filter((c) => c.slug !== slug);

  return (
    <>
      <div className="container section-tight">
        <Breadcrumb
          locale={locale}
          items={[
            { label: d.nav.home, href: href(locale) },
            { label: d.storePage.heroTitle, href: href(locale, "/store") },
            { label: collection.title[locale] },
          ]}
        />

        <Reveal variant="reveal-image">
          <div className="collection-hero" style={{ marginTop: "var(--space-6)" }}>
            <PatternArt scheme={collection.scheme} ariaLabel={collection.title[locale]} />
            <span className="collection-hero-wash" aria-hidden="true" />
            <div className="collection-hero-text">
              {collection.exclusive && <div><Badge variant="glass">{d.common.exclusive}</Badge></div>}
              <h1 className="display collection-hero-title">{collection.title[locale]}</h1>
              <p className="collection-hero-desc">{collection.description[locale]}</p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="container section-tight">
        <div className="cards-grid">
          {items.map((p, i) => (
            <Reveal key={p!.slug} delay={i}>
              <ProductCard product={p!} locale={locale} />
            </Reveal>
          ))}
        </div>
      </div>

      {others.length > 0 && (
        <div className="container section-tight" style={{ paddingBottom: "var(--space-10)" }}>
          <h2 className="spec-title" style={{ marginBottom: "var(--space-4)" }}>{d.nav.collections}</h2>
          <div className="cards-grid cards-grid-wide">
            {others.map((c) => (
              <Reveal key={c.slug}>
                <Link href={href(locale, `/collections/${c.slug}`)} className="style-tile" style={{ aspectRatio: "16/9", display: "block" }}>
                  <PatternArt scheme={c.scheme} />
                  <span className="style-tile-inner">
                    <span className="style-tile-name">{c.title[locale]}</span>
                    <span className="style-tile-desc">{c.description[locale]}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
