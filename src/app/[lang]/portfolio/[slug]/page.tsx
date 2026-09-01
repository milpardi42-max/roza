import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo, JsonLd } from "@/lib/seo";
import { href } from "@/lib/utils";
import { portfolios, getPortfolio } from "@/lib/data/catalog";
import { getArtist } from "@/lib/data/artists";
import { patterns } from "@/lib/data/patterns";
import { getProduct } from "@/lib/data/products";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PatternArt } from "@/components/ui/PatternArt";
import { PatternCard } from "@/components/cards/PatternCard";
import { ProductCard } from "@/components/cards/ProductCard";
import { PortfolioCard } from "@/components/cards/PortfolioCard";
import FXImg from "@/components/fx/FXImg";

export function generateStaticParams() {
  return portfolios.flatMap((p) => [{ lang: "fa", slug: p.slug }, { lang: "en", slug: p.slug }]);
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = getPortfolio(slug);
  if (!p) return {};
  return seo({ locale: lang, title: p.title[lang], description: p.story[lang], path: `/portfolio/${slug}`, image: p.cover });
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  const pf = d.portfolioDetail;
  const project = getPortfolio(slug);
  if (!project) notFound();

  const artist = getArtist(project.creatorSlug);
  const usedPatterns = patterns.filter((p) => project.patternSlugs.includes(p.slug));
  const usedProducts = project.productSlugs.map((s) => getProduct(s)).filter(Boolean);
  const related = portfolios.filter((p) => p.slug !== slug && p.category.en === project.category.en).slice(0, 2);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "VisualArtwork",
        name: project.title[locale],
        creator: artist ? { "@type": "Person", name: artist.name[locale] } : undefined,
        dateCreated: project.year,
      }} />

      <div className="container section-tight">
        <Breadcrumb
          locale={locale}
          items={[
            { label: d.nav.home, href: href(locale) },
            { label: d.portfolioPage.title, href: href(locale, "/portfolio") },
            { label: project.title[locale] },
          ]}
        />

        <Reveal variant="reveal-image">
          <div className="folio-hero" style={{ marginTop: "var(--space-6)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <FXImg src={project.cover} alt={project.title[locale]} loading="eager" />
            <span className="folio-hero-wash" aria-hidden="true" />
            <div className="folio-hero-text">
              <div className="cluster">
                <Badge variant="glass">{project.category[locale]}</Badge>
                <span className="tnum">{project.year}</span>
              </div>
              <h1 className="display folio-hero-title">{project.title[locale]}</h1>
            </div>
          </div>
        </Reveal>

        <div className="pd" style={{ alignItems: "start" }}>
          <Reveal>
            <div className="prose">
              <h2>{pf.story}</h2>
              <p>{project.story[locale]}</p>
              <ul>
                <li><strong>{pf.category}:</strong> {project.category[locale]}</li>
                <li><strong>{pf.location}:</strong> {project.location[locale]}</li>
                <li><strong>{pf.year}:</strong> {project.year}</li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div>
              {artist && (
                <div className="spec-block" style={{ borderTop: 0, paddingTop: 0 }}>
                  <h2 className="spec-title" style={{ marginBottom: "var(--space-3)" }}>{pf.aboutCreator}</h2>
                  <Link href={href(locale, `/artists/${artist.slug}`)} className="pattern-artist-mini">
                    {artist.avatar && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <FXImg src={artist.avatar} alt={artist.name[locale]} loading="lazy" />
                    )}
                    <span>
                      <span className="pattern-artist-mini-name">{artist.name[locale]}</span>
                      <span className="pattern-artist-mini-prof">{artist.profession[locale]}</span>
                    </span>
                    <span className="btn-arrow">
                      <span className="btn-label">{d.common.viewProfile}</span>
                      <Icon name="arrow-right" size={14} flipRtl />
                    </span>
                  </Link>
                </div>
              )}

              {usedPatterns.length > 0 && (
                <div className="spec-block" style={{ marginTop: "var(--space-5)" }}>
                  <h2 className="spec-title" style={{ marginBottom: "var(--space-3)" }}>{pf.patternsUsed}</h2>
                  <div className="cluster">
                    {usedPatterns.map((p) => (
                      <Link key={p.slug} href={href(locale, `/patterns/${p.slug}`)} className="pattern-artist-mini" style={{ flex: "1 1 16rem" }}>
                        <span className="mega-swatch"><PatternArt scheme={p.scheme} /></span>
                        <span>
                          <span className="pattern-artist-mini-name">{p.name[locale]}</span>
                          <span className="pattern-artist-mini-prof tnum">{p.code}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {project.gallery.length > 1 && (
          <Reveal>
            <div className="folio-grid">
              {project.gallery.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <FXImg key={i} src={src} alt={`${project.title[locale]} — ${i + 1}`} loading="lazy" decoding="async" className={i === 0 && project.gallery.length > 2 ? "tall" : undefined} />
              ))}
            </div>
          </Reveal>
        )}
      </div>

      {usedProducts.length > 0 && (
        <div className="container section">
          <Reveal>
            <SectionHeader
              title={pf.productsUsed}
              cta={{ href: href(locale, "/products"), label: d.common.viewAll }}
            />
          </Reveal>
          <div className="cards-grid">
            {usedProducts.map((p, i) => (
              <Reveal key={p!.slug} delay={i}>
                <ProductCard product={p!} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="container section-tight" style={{ paddingBottom: "var(--space-10)" }}>
          <Reveal>
            <SectionHeader
              title={pf.related}
              cta={{ href: href(locale, "/portfolio"), label: d.common.viewAll }}
            />
          </Reveal>
          <div className="cards-grid cards-grid-wide">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i}>
                <PortfolioCard project={p} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
