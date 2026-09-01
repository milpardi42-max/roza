import { Suspense } from "react";
import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { formatNumber, sprintf } from "@/lib/utils";
import { patterns } from "@/lib/data/patterns";
import { styles } from "@/lib/data/catalog";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PatternArt } from "@/components/ui/PatternArt";
import { PatternBrowser } from "@/components/listing/PatternBrowser";
import { href } from "@/lib/utils";
import { PageHeroArt } from "@/components/ui/PageHeroArt";


export function generateStaticParams(): Array<{ lang: Locale }> {
  return [{ lang: "fa" }, { lang: "en" }];
}


export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(lang);
  return seo({ locale: lang, title: d.patternsPage.title, description: d.patternsPage.subtitle, path: "/patterns" });
}

export default async function PatternsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const locale = lang;
  const d = getDictionary(lang);

  return (
    <>
      <header className="page-hero has-photo">
        <PageHeroArt src="/assets/images/hero/pages/patterns.jpg" focus="50% 45%" />
        <div className="container">
          <Breadcrumb locale={locale} items={[{ label: d.nav.home, href: href(locale) }, { label: d.patternsPage.title }]} />
          <h1 className="page-hero-title">{d.patternsPage.title}</h1>
          <p className="page-hero-lead">{d.patternsPage.subtitle}</p>
          <p className="page-hero-count">{sprintf(d.patternsPage.count, formatNumber(locale, patterns.length))}</p>
        </div>
      </header>

      <div className="container section-tight">
        <Suspense>
          <PatternBrowser
            items={patterns}
            locale={locale}
            countLabel={d.patternsPage.count}
            styleOptions={styles.map((s) => ({ slug: s.slug, label: s.name[locale] }))}
          />
        </Suspense>
      </div>
    </>
  );
}
