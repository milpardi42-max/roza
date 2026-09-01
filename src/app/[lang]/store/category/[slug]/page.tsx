import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { href, formatNumber, sprintf } from "@/lib/utils";
import { categories, getCategory } from "@/lib/data/catalog";
import { productsByCategory } from "@/lib/data/products";
import { categories as allCats } from "@/lib/data/catalog";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ProductBrowser } from "@/components/listing/ProductBrowser";

export function generateStaticParams() {
  return categories.flatMap((c) => [{ lang: "fa", slug: c.slug }, { lang: "en", slug: c.slug }]);
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const c = getCategory(slug);
  if (!c) return {};
  return seo({ locale: lang, title: c.name[lang], description: c.description[lang], path: `/store/category/${slug}`, image: c.image });
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  const category = getCategory(slug);
  if (!category) notFound();

  const items = productsByCategory(slug);
  const related = allCats.filter((c) => c.slug !== slug).slice(0, 4);

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <Breadcrumb
            locale={locale}
            items={[
              { label: d.nav.home, href: href(locale) },
              { label: d.storePage.heroTitle, href: href(locale, "/store") },
              { label: category.name[locale] },
            ]}
          />
          <h1 className="page-hero-title">{category.name[locale]}</h1>
          <p className="page-hero-lead">{category.description[locale]}</p>
          <p className="page-hero-count">{sprintf(d.categoryPage.products, formatNumber(locale, items.length))}</p>
        </div>
      </header>

      <div className="container section-tight">
        {items.length ? (
          <ProductBrowser items={items} locale={locale} countLabel={d.productsPage.count} fixedCategory={slug} />
        ) : null}
      </div>

      <div className="container section-tight" style={{ paddingBottom: "var(--space-10)" }}>
        <h2 className="spec-title" style={{ marginBottom: "var(--space-4)" }}>{d.categoryPage.related}</h2>
        <div className="cluster">
          {related.map((c) => (
            <Reveal key={c.slug}>
              <Link href={href(locale, `/store/category/${c.slug}`)} className="chip" style={{ padding: "0.55rem 1.1rem" }}>
                {c.name[locale]}
                <Icon name="arrow-left" size={13} flipRtl />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
