import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo, JsonLd } from "@/lib/seo";
import { href, formatNumber } from "@/lib/utils";
import { artists, getArtist } from "@/lib/data/artists";
import { patterns } from "@/lib/data/patterns";
import { productsByArtist } from "@/lib/data/products";
import { portfoliosByArtist } from "@/lib/data/catalog";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { ArtistTabs } from "@/components/artist/ArtistTabs";
import { FollowButton } from "@/components/artist/FollowButton";
import FXImg from "@/components/fx/FXImg";

export function generateStaticParams() {
  return artists.flatMap((a) => [{ lang: "fa", slug: a.slug }, { lang: "en", slug: a.slug }]);
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const a = getArtist(slug);
  if (!a) return {};
  return seo({
    locale: lang,
    title: `${a.name[lang]} — ${a.profession[lang]}`,
    description: a.bio[lang],
    path: `/artists/${slug}`,
    image: a.avatar || undefined,
  });
}

export default async function ArtistPage({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  const ap = d.artistProfile;
  const artist = getArtist(slug);
  if (!artist) notFound();

  const pats = patterns.filter((p) => p.creatorSlug === slug);
  const prods = productsByArtist(slug);
  const folios = portfoliosByArtist(slug);

  const initials = artist.name[locale].split(" ").slice(0, 2).map((w) => w[0]).join(" ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist.name[locale],
    jobTitle: artist.profession[locale],
    worksFor: { "@type": "Organization", name: "Rezi Atelier" },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="profile-hero">
        <div className="container">
          <Breadcrumb
            locale={locale}
            items={[
              { label: d.nav.home, href: href(locale) },
              { label: d.artistsPage.title, href: href(locale, "/artists") },
              { label: artist.name[locale] },
            ]}
          />
          <Reveal variant="reveal-image">
            <div className="profile-cover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <FXImg src={artist.cover} alt="" loading="eager" />
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="profile-head">
              <span className="profile-avatar">
                {artist.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <FXImg src={artist.avatar} alt={artist.name[locale]} />
                ) : (
                  <span className="acard-mono">{initials}</span>
                )}
              </span>
              <div className="profile-id">
                <h1 className="display profile-name">{artist.name[locale]}</h1>
                <p className="profile-prof">{artist.profession[locale]}</p>
                <p className="profile-loc">
                  <Icon name="pin" size={13} />
                  {artist.location[locale]}
                </p>
              </div>
              <div className="profile-actions">
                <FollowButton slug={artist.slug} locale={locale} />
                {artist.socials.map((s) => (
                  <a key={s.label} href={s.url} className="icon-btn" target="_blank" rel="noreferrer" aria-label={s.label}>
                    <Icon name={s.label === "Instagram" ? "instagram" : "external"} size={17} />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="profile-stats">
              <div className="profile-stat">
                <strong className="tnum">{formatNumber(locale, artist.stats.patterns)}</strong>
                <span>{ap.stats.patterns}</span>
              </div>
              <div className="profile-stat">
                <strong className="tnum">{formatNumber(locale, artist.stats.products)}</strong>
                <span>{ap.stats.products}</span>
              </div>
              <div className="profile-stat">
                <strong className="tnum">{formatNumber(locale, artist.stats.projects)}</strong>
                <span>{ap.stats.projects}</span>
              </div>
              <div className="profile-stat">
                <strong>{artist.stats.followers}</strong>
                <span>{ap.stats.followers}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container section-tight">
        <Reveal>
          <div className="prose" style={{ marginBottom: "var(--space-8)", maxWidth: "52rem" }}>
            <h2>{ap.aboutTitle}</h2>
            <p>{artist.bio[locale]}</p>
            {artist.story && (
              <blockquote className="story-text" style={{ borderInlineStart: "2px solid var(--accent)", paddingInlineStart: "var(--space-4)", color: "var(--foreground)" }}>
                {artist.story[locale]}
              </blockquote>
            )}
            <div className="cluster" style={{ marginTop: "var(--space-4)" }}>
              {artist.specialties.map((sp) => (
                <Badge key={sp.en} variant="copper">{sp[locale]}</Badge>
              ))}
            </div>
          </div>
        </Reveal>

        <ArtistTabs locale={locale} patterns={pats} products={prods} folios={folios} />
      </div>
    </>
  );
}
