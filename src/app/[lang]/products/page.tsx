import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { formatNumber, sprintf } from "@/lib/utils";
import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/catalog";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PatternArt } from "@/components/ui/PatternArt";
import { ProductBrowser } from "@/components/listing/ProductBrowser";
import { PageHeroArt } from "@/components/ui/PageHeroArt";


export function generateStaticParams(): Array<{ lang: Locale }> {
  return [{ lang: "fa" }, { lang: "en" }];
}


export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(lang);
  return seo({ locale: lang, title: d.productsPage.title, description: d.productsPage.subtitle, path: "/products" });
}

export default async function ProductsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const d = getDictionary(locale);

  const cats = categories
    .map((c) => ({ slug: c.slug, label: c.name[locale] }))
    .filter((c) => products.some((p) => p.categorySlug === c.slug));

  return (
    <>
      <header className="page-hero has-photo">
        <PageHeroArt src="/assets/images/hero/pages/products.jpg" focus="50% 50%" />
        <div className="container">
          <Breadcrumb locale={locale} items={[{ label: d.nav.home, href: `/${locale}` }, { label: d.productsPage.title }]} />
          <h1 className="page-hero-title">{d.productsPage.title}</h1>
          <p className="page-hero-lead">{d.productsPage.subtitle}</p>
          <p className="page-hero-count">{sprintf(d.productsPage.count, formatNumber(locale, products.length))}</p>
        </div>
      </header>

      <div className="container section-tight">
        <ProductBrowser
          items={products}
          locale={locale}
          categories={cats}
          countLabel={d.productsPage.count}
        />
      </div>
    </>
  );
}
