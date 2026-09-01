import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo, JsonLd } from "@/lib/seo";
import { href, formatPrice, formatNumber } from "@/lib/utils";
import { patterns, getPattern, relatedPatterns } from "@/lib/data/patterns";
import { getArtist } from "@/lib/data/artists";
import { productsByPattern } from "@/lib/data/products";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PatternArt } from "@/components/ui/PatternArt";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PatternCard } from "@/components/cards/PatternCard";
import { ProductCard } from "@/components/cards/ProductCard";
import { FavoriteButton } from "@/components/commerce/CommerceButtons";
import FXImg from "@/components/fx/FXImg";

export function generateStaticParams() {
  return patterns.flatMap((p) => [{ lang: "fa", slug: p.slug }, { lang: "en", slug: p.slug }]);
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = getPattern(slug);
  if (!p) return {};
  return seo({
    locale: lang,
    title: `${p.name[lang]} — ${p.style[lang]}`,
    description: p.tagline[lang],
    path: `/patterns/${slug}`,
  });
}

export default async function PatternDetailPage({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  const pd = d.patternDetail;
  const pattern = getPattern(slug);
  if (!pattern) notFound();

  const artist = getArtist(pattern.creatorSlug);
  const usedIn = productsByPattern(slug);
  const related = relatedPatterns(slug, 4);

  const palette = [pattern.scheme.bg, pattern.scheme.fg, pattern.scheme.fg2, pattern.scheme.fg3].filter(Boolean) as string[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: pattern.name[locale],
    identifier: pattern.code,
    creator: artist ? { "@type": "Person", name: artist.name[locale] } : undefined,
    genre: pattern.style[locale],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="container section-tight">
        <Breadcrumb
          locale={locale}
          items={[
            { label: d.nav.home, href: href(locale) },
            { label: d.patternsPage.title, href: href(locale, "/patterns") },
            { label: pattern.name[locale] },
          ]}
        />

        <div className="pattern-detail" style={{ marginTop: "var(--space-6)" }}>
          <Reveal variant="reveal-image">
            <div className="pattern-stage">
              <PatternArt scheme={pattern.scheme} ariaLabel={pattern.name[locale]} />
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="pattern-info">
              <div className="cluster">
                <Badge variant="ink" className="tnum">{pattern.code}</Badge>
                {pattern.tags?.includes("trending") && (
                  <Badge variant="copper"><Icon name="spark" size={12} />{d.common.trending}</Badge>
                )}
                {pattern.tags?.includes("exclusive") && <Badge variant="soft">{d.common.exclusive}</Badge>}
              </div>

              <div>
                <h1 className="display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}>{pattern.name[locale]}</h1>
                <p className="lead" style={{ marginTop: "var(--space-3)" }}>{pattern.tagline[locale]}</p>
              </div>

              <p className="text-secondary" style={{ lineHeight: "var(--leading-relaxed)" }}>{pattern.description[locale]}</p>

              {artist && (
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
                    <span className="btn-label">{d.artistProfile.aboutTitle}</span>
                    <Icon name="arrow-right" size={14} flipRtl />
                  </span>
                </Link>
              )}

              {/* palette */}
              <div>
                <p className="pd-choices-label">{d.common.color}</p>
                <div className="cluster" role="list">
                  {palette.map((c) => (
                    <span key={c} role="listitem" style={{ display: "grid", justifyItems: "center", gap: "0.35rem" }}>
                      <span className="color-dot" style={{ background: c, inlineSize: "2rem", blockSize: "2rem", borderRadius: "var(--radius-sm)" }} />
                      <span className="tnum text-muted" style={{ fontSize: "0.65rem" }} dir="ltr">{c}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="pd-choices-label">{pd.applications}</p>
                <div className="pattern-apps">
                  {pattern.applications.map((a) => (
                    <Badge key={a.en} variant="outline">{a[locale]}</Badge>
                  ))}
                </div>
              </div>

              <div className="pattern-license">
                <div className="pattern-license-row">
                  <div>
                    <span className="text-muted text-sm">{pd.license}</span>
                    <div className="pd-price-row" style={{ gap: "var(--space-2)" }}>
                      <strong style={{ fontSize: "var(--text-xl)" }}>{formatPrice(locale, pattern.licensePrice)}</strong>
                    </div>
                  </div>
                  <FavoriteButton slug={pattern.slug} locale={locale} />
                </div>
                <div className="cluster">
                  <Button variant="primary" href={href(locale, "/b2b")} icon="card" block>
                    {pd.licenseCta}
                  </Button>
                </div>
                <p className="pattern-license-note">
                  <Icon name="check" size={14} />
                  {pd.vectorIncluded} · {pd.seamless}
                </p>
              </div>

              <div className="cluster text-muted" style={{ fontSize: "var(--text-xs)" }}>
                <Icon name="heart" size={14} />
                {formatNumber(locale, pattern.favorites)} {d.common.favorite}
                <span aria-hidden="true">·</span>
                <Icon name="layers" size={14} />
                {pattern.style[locale]} · {pattern.category[locale]}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {usedIn.length > 0 && (
        <div className="container section">
          <Reveal>
            <SectionHeader
              title={pd.productsUsing}
              cta={{ href: href(locale, "/products"), label: d.common.viewAll }}
            />
          </Reveal>
          <div className="cards-grid">
            {usedIn.map((p, i) => (
              <Reveal key={p.slug} delay={i}>
                <ProductCard product={p} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      <div className="container section section-tight" style={{ paddingBottom: "var(--space-10)" }}>
        <Reveal>
          <SectionHeader
            title={pd.related}
            cta={{ href: href(locale, "/patterns"), label: d.common.viewAll }}
          />
        </Reveal>
        <div className="cards-grid">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i}>
              <PatternCard pattern={p} locale={locale} />
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
