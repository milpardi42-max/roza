import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { href, sprintf, formatNumber } from "@/lib/utils";
import { artists } from "@/lib/data/artists";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PatternArt } from "@/components/ui/PatternArt";
import { ArtistCard } from "@/components/cards/ArtistCard";
import { Reveal } from "@/components/ui/Reveal";
import { PageHeroArt } from "@/components/ui/PageHeroArt";


export function generateStaticParams(): Array<{ lang: Locale }> {
  return [{ lang: "fa" }, { lang: "en" }];
}


export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(lang);
  return seo({ locale: lang, title: d.artistsPage.title, description: d.artistsPage.subtitle, path: "/artists" });
}

export default async function ArtistsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const locale = lang;
  const d = getDictionary(locale);

  return (
    <>
      <header className="page-hero has-photo">
        <PageHeroArt src="/assets/images/hero/pages/artists.jpg" focus="50% 42%" />
        <div className="container">
          <Breadcrumb locale={locale} items={[{ label: d.nav.home, href: href(locale) }, { label: d.artistsPage.title }]} />
          <h1 className="page-hero-title">{d.artistsPage.title}</h1>
          <p className="page-hero-lead">{d.artistsPage.subtitle}</p>
          <p className="page-hero-count">{sprintf(d.artistsPage.count, formatNumber(locale, artists.length))}</p>
        </div>
      </header>

      <div className="container section-tight">
        <div className="cards-grid cards-grid-wide">
          {artists.map((a, i) => (
            <Reveal key={a.slug} delay={i % 3}>
              <ArtistCard artist={a} locale={locale} />
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
