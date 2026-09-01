import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { href, formatNumber, sprintf } from "@/lib/utils";
import { portfolios } from "@/lib/data/catalog";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PatternArt } from "@/components/ui/PatternArt";
import { PortfolioCard } from "@/components/cards/PortfolioCard";
import { Reveal } from "@/components/ui/Reveal";
import { PageHeroArt } from "@/components/ui/PageHeroArt";


export function generateStaticParams(): Array<{ lang: Locale }> {
  return [{ lang: "fa" }, { lang: "en" }];
}


export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(lang);
  return seo({ locale: lang, title: d.portfolioPage.title, description: d.portfolioPage.subtitle, path: "/portfolio" });
}

export default async function PortfolioPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const locale = lang;
  const d = getDictionary(locale);

  return (
    <>
      <header className="page-hero has-photo">
        <PageHeroArt src="/assets/images/hero/pages/portfolio.jpg" focus="50% 45%" />
        <div className="container">
          <Breadcrumb locale={locale} items={[{ label: d.nav.home, href: href(locale) }, { label: d.portfolioPage.title }]} />
          <h1 className="page-hero-title">{d.portfolioPage.title}</h1>
          <p className="page-hero-lead">{d.portfolioPage.subtitle}</p>
          <p className="page-hero-count">
            {sprintf(locale === "fa" ? "%s پروژه" : "%s projects", formatNumber(locale, portfolios.length))}
          </p>
        </div>
      </header>

      <div className="container section-tight">
        <div className="masonry">
          {portfolios.map((p, i) => (
            <Reveal key={p.slug} delay={i % 3}>
              <PortfolioCard project={p} locale={locale} size={i % 3 === 0 ? "lg" : "md"} />
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
