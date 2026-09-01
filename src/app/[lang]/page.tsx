import Link from "next/link";
import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { href, formatPrice, formatNumber } from "@/lib/utils";
import { seo } from "@/lib/seo";
import { patterns } from "@/lib/data/patterns";
import { products } from "@/lib/data/products";
import { artists } from "@/lib/data/artists";
import { portfolios, collections, education, styles } from "@/lib/data/catalog";
import { PatternArt } from "@/components/ui/PatternArt";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { PatternCard } from "@/components/cards/PatternCard";
import { ProductCard } from "@/components/cards/ProductCard";
import { ArtistCard } from "@/components/cards/ArtistCard";
import { PortfolioCard } from "@/components/cards/PortfolioCard";
import { CourseCard } from "@/components/cards/CourseCard";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { HeroCollageFX } from "@/components/home/HeroCollageFX";
import { Badge } from "@/components/ui/Badge";

import FXImg from "@/components/fx/FXImg";

export function generateStaticParams(): Array<{ lang: Locale }> {
  return [{ lang: "fa" }, { lang: "en" }];
}


export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(lang);
  return seo({
    locale: lang,
    title: d.brand.name + " | " + (lang === "fa" ? "بازار خلاقانهٔ نقش‌و‌نگار" : "Creative Pattern Marketplace"),
    description: d.brand.description,
    path: "/",
    image: "/assets/images/hero/hero-main.jpg",
  });
}

export default async function HomePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  const h = d.home;

  const trending = patterns.filter((p) => p.trending).slice(0, 4);
  const bestSelling = patterns.filter((p) => p.tags?.includes("bestseller")).slice(0, 4);
  const featuredArtists = artists.filter((a) => a.featured).slice(0, 4);
  const featuredFolios = portfolios.filter((p) => p.featured).slice(0, 4);
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const edu = education.filter((e) => e.popular).slice(0, 3);
  const collection = collections[0];
  const stories = artists.filter((a) => a.story).slice(0, 4);

  const discoveryTiles = [
    { art: "scheme" as const, scheme: patterns.find(p => p.slug === "bamyan-stars")!.scheme, tag: d.common.trending, title: h.discovery.tiles.trending.title, desc: h.discovery.tiles.trending.desc, url: href(locale, "/patterns?sort=popular"), big: true },
    { art: "styles" as const, kicker: h.discovery.tiles.styles.title, desc: h.discovery.tiles.styles.desc, url: href(locale, "/patterns") },
    { art: "image" as const, image: "/assets/images/portfolio/hotel-lobby.jpg", kicker: h.discovery.tiles.artists.title, desc: h.discovery.tiles.artists.desc, url: href(locale, "/artists") },
    { art: "image" as const, image: "/assets/images/products/cushion-bamyan.jpg", kicker: h.discovery.tiles.store.title, desc: h.discovery.tiles.store.desc, url: href(locale, "/store") },
    { art: "scheme" as const, scheme: collections[1].scheme, tag: d.common.exclusive, title: h.discovery.tiles.education.title, desc: h.discovery.tiles.education.desc, url: href(locale, "/education") },
    { art: "ink" as const, title: h.discovery.tiles.b2b.title, desc: h.discovery.tiles.b2b.desc, url: href(locale, "/b2b"), wide: true },
  ];

  const marquee = [...h.hero.marqueeItems, ...h.hero.marqueeItems];

  return (
    <>
      {/* ── 1 · Hero ─────────────────────────────────────────── */}
      <section className="hx" aria-label="Hero">
        <div className="container hx-grid">
          <div className="hx-copy">
            <h1 className="display hx-title">
              <span className="hx-line">
                <span className="hx-spark" aria-hidden="true"><Icon name="spark" size={30} /></span>
                {h.hero.titleBefore}
              </span>
              <span className="hx-line">
                <span className="hx-accent">{h.hero.titleAccent}</span> {h.hero.titleAfter}
              </span>
            </h1>
            <p className="hx-subtitle">{h.hero.subtitle}</p>
            <div className="hx-ctas">
              <Button variant="primary" size="lg" className="hx-btn-gold" href={href(locale, "/contact")} icon="user">
                {h.hero.ctaPrimary}
              </Button>
              <Button variant="outline" size="lg" href={href(locale, "/store")} icon="bag">
                {h.hero.ctaSecondary}
              </Button>
            </div>
            <div className="hx-trust">
              <div className="hx-avatars" aria-hidden="true">
                {featuredArtists.slice(0, 3).map((a) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  a.avatar ? <FXImg key={a.slug} src={a.avatar} alt="" className="hx-avatar" /> : null
                ))}
                <span className="hx-more tnum">{h.hero.trustCount}</span>
              </div>
              <div className="hx-trust-txt">
                <strong>{h.hero.trustTitle}</strong>
                <span>{h.hero.trustSub}</span>
              </div>
            </div>
          </div>

          <HeroCollageFX />
        </div>

        <div className="container hx-features-wrap">
          <div className="hx-features" role="list">
            {h.hero.features.map((f, i) => (
              <div className="hx-feat" role="listitem" key={f.title}>
                <span className="hx-feat-ico"><Icon name={(["store", "bag", "globe"] as IconName[])[i]} size={26} /></span>
                <div>
                  <strong>{f.title}</strong>
                  <span>{f.sub}</span>
                </div>
              </div>
            ))}
          </div>
          <span className="hx-scroll" aria-hidden="true">
            <Icon name="chevron-down" size={22} />
          </span>
        </div>
      </section>

      {/* marquee */}
      <div className="hero-marquee" aria-hidden="true" id="after-hero">
        <div className="hero-marquee-track">
          {marquee.map((item, i) => (
            <span key={i}>
              {item} <span className="sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── 2 · Pattern discovery bento ──────────────────────── */}
      <section className="section" aria-labelledby="discovery-title">
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow={h.discovery.eyebrow}
              title={h.discovery.title}
              subtitle={h.discovery.subtitle}
            />
          </Reveal>
          <div className="bento">
            {discoveryTiles.map((t, i) => (
              <Reveal as="div" key={i} delay={i} className={t.big ? "bento-big" : t.wide ? "bento-wide" : undefined}>
                <Link href={t.url} className={`bento-item ${t.big ? "bento-big" : ""} ${t.wide ? "bento-wide" : ""} bento-light`}>
                  <span className="bento-art" aria-hidden="true">
                    {t.art === "scheme" && "scheme" in t ? (
                      <PatternArt scheme={t.scheme!} />
                    ) : t.art === "image" && "image" in t ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <FXImg src={t.image} alt="" loading="lazy" />
                    ) : t.art === "styles" ? (
                      <PatternArt scheme={styles[3].scheme} />
                    ) : (
                      <PatternArt scheme={{ motif: "dots", bg: "#16181d", fg: "#a05d24", fg2: "#d9b48f", density: 26 }} />
                    )}
                  </span>
                  <span className="bento-shade" />
                  {"tag" in t && t.tag && (
                    <span className="bento-tag"><Badge variant="glass">{t.tag}</Badge></span>
                  )}
                  <span className="bento-inner">
                    <span className="bento-title">{"title" in t && t.title ? t.title : t.kicker}</span>
                    <span className="bento-desc">{t.desc}</span>
                    <span className="bento-cta">
                      {d.common.explore}
                      <Icon name="arrow-right" size={15} flipRtl />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 · Trending patterns ────────────────────────────── */}
      <section className="section section-alt" aria-labelledby="trending-title">
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow={h.trending.eyebrow}
              title={h.trending.title}
              subtitle={h.trending.subtitle}
              cta={{ href: href(locale, "/patterns?sort=popular"), label: d.common.viewAll }}
            />
          </Reveal>
          <div className="cards-grid">
            {trending.map((p, i) => (
              <Reveal key={p.slug} delay={i}>
                <PatternCard pattern={p} locale={locale} trendRank={i + 1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 · Best-selling patterns ────────────────────────── */}
      <section className="section" aria-labelledby="best-title">
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow={h.bestSelling.eyebrow}
              title={h.bestSelling.title}
              subtitle={h.bestSelling.subtitle}
              cta={{ href: href(locale, "/patterns?sort=popular"), label: d.common.viewAll }}
            />
          </Reveal>
          <div className="cards-grid">
            {bestSelling.map((p, i) => (
              <Reveal key={p.slug} delay={i}>
                <PatternCard pattern={p} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5 · Featured artists ─────────────────────────────── */}
      <section className="section section-alt" aria-labelledby="artists-title">
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow={h.artists.eyebrow}
              title={h.artists.title}
              subtitle={h.artists.subtitle}
              cta={{ href: href(locale, "/artists"), label: d.common.viewAll }}
            />
          </Reveal>
          <div className="cards-grid cards-grid-wide">
            {featuredArtists.map((a, i) => (
              <Reveal key={a.slug} delay={i}>
                <ArtistCard artist={a} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 · Featured portfolios & projects ───────────────── */}
      <section className="section" aria-labelledby="folios-title">
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow={h.portfolios.eyebrow}
              title={h.portfolios.title}
              subtitle={h.portfolios.subtitle}
              cta={{ href: href(locale, "/portfolio"), label: d.common.viewAll }}
            />
          </Reveal>
          <div className="folio-home-grid">
            <Reveal className="folio-home-lead">
              <PortfolioCard project={featuredFolios[0]} locale={locale} size="lg" />
            </Reveal>
            <div className="folio-home-side">
              {featuredFolios.slice(1, 3).map((p, i) => (
                <Reveal key={p.slug} delay={i + 1}>
                  <PortfolioCard project={p} locale={locale} />
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={1}>
            <div className="folio-home-grid" style={{ marginTop: "var(--space-5)" }}>
              {featuredFolios.slice(3, 4).map((p) => (
                <PortfolioCard key={p.slug} project={p} locale={locale} />
              ))}
              {portfolios.filter((p) => !p.featured).slice(0, 1).map((p) => (
                <PortfolioCard key={p.slug} project={p} locale={locale} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 7 · Styles ───────────────────────────────────────── */}
      <section className="section section-alt" aria-labelledby="styles-title">
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow={h.styles.eyebrow}
              title={h.styles.title}
              subtitle={h.styles.subtitle}
              cta={{ href: href(locale, "/patterns"), label: d.common.viewAll }}
            />
          </Reveal>
          <div className="styles-home-grid">
            {styles.map((s, i) => (
              <Reveal key={s.slug} delay={i % 3}>
                <Link href={href(locale, `/patterns?style=${s.slug}`)} className="style-tile">
                  <PatternArt scheme={s.scheme} ariaLabel={s.name[locale]} />
                  <span className="style-tile-inner">
                    <span className="style-tile-name">{s.name[locale]}</span>
                    <span className="style-tile-desc">{s.description[locale]}</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8 · Products ─────────────────────────────────────── */}
      <section className="section" aria-labelledby="products-title">
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow={h.products.eyebrow}
              title={h.products.title}
              subtitle={h.products.subtitle}
              cta={{ href: href(locale, "/products"), label: d.common.viewAll }}
            />
          </Reveal>
          <div className="cards-grid">
            {featuredProducts.map((p, i) => (
              <Reveal key={p.slug} delay={i}>
                <ProductCard product={p} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9 · Exclusive collection ─────────────────────────── */}
      <section className="section" aria-labelledby="exclusive-title">
        <div className="container">
          <Reveal>
            <div className="exclusive">
              <div className="exclusive-art" aria-hidden="true">
                <PatternArt scheme={collection.scheme} />
              </div>
              <div className="exclusive-body">
                <p className="eyebrow">{h.exclusive.eyebrow}</p>
                <h2 className="exclusive-title">{h.exclusive.title}</h2>
                <p className="exclusive-desc">{h.exclusive.subtitle}</p>
                <div className="exclusive-meta">
                  <span className="exclusive-meta-item">
                    <strong>{formatNumber(locale, collection.productSlugs.length)}</strong>
                    {d.nav.products}
                  </span>
                  <span className="exclusive-meta-item">
                    <strong>{locale === "fa" ? "انحصاری" : "Exclusive"}</strong>
                    {d.common.availability}
                  </span>
                  <span className="exclusive-meta-item">
                    <strong>{formatPrice(locale, products.find(p => collection.productSlugs.includes(p.slug))?.price ?? { fa: 0, en: 0 })}</strong>
                    {d.common.from}
                  </span>
                </div>
                <div className="cluster">
                  <Button variant="accent" size="lg" href={href(locale, `/collections/${collection.slug}`)}>
                    {h.exclusive.cta}
                  </Button>
                  <Button variant="ghost" href={href(locale, "/store")} className="exclusive-ghost">
                    {d.common.shopNow}
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 10 · Education ───────────────────────────────────── */}
      <section className="section section-alt" aria-labelledby="edu-title">
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow={h.education.eyebrow}
              title={h.education.title}
              subtitle={h.education.subtitle}
              cta={{ href: href(locale, "/education"), label: d.common.viewAll }}
            />
          </Reveal>
          <div className="cards-grid-wide cards-grid">
            {edu.map((e, i) => (
              <Reveal key={e.slug} delay={i}>
                <CourseCard item={e} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11 · B2B ─────────────────────────────────────────── */}
      <section className="section" aria-labelledby="b2b-title">
        <div className="container split-panel">
          <Reveal>
            <div>
              <p className="eyebrow">{h.b2b.eyebrow}</p>
              <h2 className="section-head-title">{h.b2b.title}</h2>
              <p className="lead" style={{ marginTop: "var(--space-4)" }}>{h.b2b.subtitle}</p>
              <ul className="split-checks" role="list">
                {h.b2b.bullets.map((b) => (
                  <li key={b}>
                    <span className="check-ico"><Icon name="check" size={13} /></span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="cluster">
                <Button variant="primary" size="lg" href={href(locale, "/b2b")}>{h.b2b.cta}</Button>
                <Button variant="arrow" href={href(locale, "/about")} icon="arrow-right" iconEnd>{h.b2b.secondary}</Button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="panel-visual img-zoom">
              <PatternArt scheme={{ motif: "archi", bg: "#f2e9df", fg: "#2e4a5c", fg2: "#b0713c", density: 48 }} />
              <span className="panel-chip"><Badge variant="glass">{locale === "fa" ? "چاپ صنعتی · ۴۰+ متریال" : "Industrial print · 40+ materials"}</Badge></span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 12 · Custom production ───────────────────────────── */}
      <section className="section section-alt" aria-labelledby="custom-title">
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow={h.custom.eyebrow}
              title={h.custom.title}
              subtitle={h.custom.subtitle}
              align="center"
            />
          </Reveal>
          <div className="steps">
            {h.custom.steps.map((s, i) => (
              <Reveal key={s.title} delay={i} className="step">
                <span className="step-num tnum">{formatNumber(locale, i + 1)}</span>
                <span className="step-title">{s.title}</span>
                <span className="step-desc">{s.desc}</span>
              </Reveal>
            ))}
          </div>
          <Reveal delay={1}>
            <div style={{ textAlign: "center", marginTop: "var(--space-8)" }}>
              <Button variant="outline" size="lg" href={href(locale, "/b2b")} icon="copy">
                {h.custom.cta}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 13 · Artist stories ──────────────────────────────── */}
      <section className="section" aria-labelledby="stories-title">
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow={h.stories.eyebrow}
              title={h.stories.title}
              subtitle={h.stories.subtitle}
              cta={{ href: href(locale, "/artists"), label: d.common.viewAll }}
            />
          </Reveal>
          <div className="stories-scroll">
            {stories.map((a) => (
              <figure key={a.slug} className="story-card">
                <Icon name="quote" size={26} className="story-quote-mark" />
                <blockquote className="story-text">{a.story![locale]}</blockquote>
                <figcaption>
                  <Link href={href(locale, `/artists/${a.slug}`)} className="story-artist">
                    {a.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <FXImg src={a.avatar} alt="" loading="lazy" />
                    ) : null}
                    <span>
                      <span className="story-artist-name">{a.name[locale]}</span>
                      <span className="story-artist-prof">{a.profession[locale]}</span>
                    </span>
                  </Link>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── 14 · Newsletter ──────────────────────────────────── */}
      <section className="section" aria-labelledby="news-title">
        <div className="container">
          <Reveal>
            <div className="newsletter-band" id="news-title">
              <span className="newsletter-band-art" aria-hidden="true">
                <PatternArt scheme={{ motif: "rings", bg: "#f9f6f1", fg: "#ece4d8", fg2: "#d9cdbb", density: 40 }} />
              </span>
              <p className="eyebrow">{h.newsletter.eyebrow}</p>
              <h2 className="newsletter-title">{h.newsletter.title}</h2>
              <p className="text-secondary" style={{ maxWidth: "34rem" }}>{h.newsletter.subtitle}</p>
              <NewsletterForm locale={locale} />
              <p className="newsletter-note">{h.newsletter.note}</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
