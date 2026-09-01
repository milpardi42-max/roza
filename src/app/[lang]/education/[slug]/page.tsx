import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo, JsonLd } from "@/lib/seo";
import { href } from "@/lib/utils";
import { education, getEducation } from "@/lib/data/catalog";
import { getArtist } from "@/lib/data/artists";
import { patterns } from "@/lib/data/patterns";
import { products } from "@/lib/data/products";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PatternArt } from "@/components/ui/PatternArt";
import { CourseCard } from "@/components/cards/CourseCard";
import { PatternCard } from "@/components/cards/PatternCard";
import { ProductCard } from "@/components/cards/ProductCard";
import FXImg from "@/components/fx/FXImg";

export function generateStaticParams() {
  return education.flatMap((e) => [{ lang: "fa", slug: e.slug }, { lang: "en", slug: e.slug }]);
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const e = getEducation(slug);
  if (!e) return {};
  return seo({ locale: lang, title: e.title[lang], description: e.excerpt[lang], path: `/education/${slug}`, image: e.cover || undefined, type: "article" });
}

export default async function EducationDetailPage({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  const ed = d.educationDetail;
  const item = getEducation(slug);
  if (!item) notFound();

  const author = getArtist(item.authorSlug);
  const relatedPatterns = patterns.slice(0, 2);
  const relatedProducts = products.slice(0, 2);
  const relatedEdu = education.filter((e) => e.slug !== slug && e.kind === item.kind).slice(0, 3);
  const relatedEduFill = relatedEdu.length < 3 ? [...relatedEdu, ...education.filter((e) => e.slug !== slug && e.kind !== item.kind)].slice(0, 3) : relatedEdu;

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": item.kind === "course" ? "Course" : "Article",
        name: item.title[locale],
        description: item.excerpt[locale],
        provider: { "@type": "Organization", name: "Rezi Atelier Academy" },
        ...(author ? { author: { "@type": "Person", name: author.name[locale] } } : {}),
      }} />

      {/* cover */}
      <div className="container section-tight">
        <Breadcrumb
          locale={locale}
          items={[
            { label: d.nav.home, href: href(locale) },
            { label: d.educationPage.heroTitle, href: href(locale, "/education") },
            { label: item.title[locale] },
          ]}
        />

        <Reveal variant="reveal-image">
          <div className="folio-hero" style={{ aspectRatio: "16 / 6.5", marginTop: "var(--space-6)" }}>
            {item.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <FXImg src={item.cover} alt={item.title[locale]} loading="eager" />
            ) : item.coverScheme ? (
              <PatternArt scheme={item.coverScheme} ariaLabel={item.title[locale]} />
            ) : null}
            <span className="folio-hero-wash" aria-hidden="true" />
            <div className="folio-hero-text">
              <div className="cluster">
                <Badge variant="glass">{d.kinds[item.kind]}</Badge>
                <Badge variant="glass">{item.category[locale]}</Badge>
              </div>
              <h1 className="display folio-hero-title">{item.title[locale]}</h1>
              <div className="folio-hero-meta">
                <span className="cluster" style={{ gap: "var(--space-1)" }}>
                  <Icon name="clock" size={14} />
                  <span className="tnum">{item.duration[locale]}</span>
                </span>
                <span className="cluster" style={{ gap: "var(--space-1)" }}>
                  <Icon name="ruler" size={14} />
                  {d.difficulty[item.difficulty]}
                </span>
                {item.lessons && <span className="tnum">{item.lessons} {d.common.lessons}</span>}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="pd" style={{ alignItems: "start" }}>
          <Reveal>
            <div className="prose">
              <h2>{ed.about}</h2>
              {item.content.map((c, i) => (
                <p key={i}>{c[locale]}</p>
              ))}
              <h3>{ed.whatYouLearn}</h3>
              <ul>
                <li>{item.excerpt[locale]}</li>
                <li>{locale === "fa" ? "تمرین چاپی همراه با هر درس" : "A printable exercise with every lesson"}</li>
                <li>{locale === "fa" ? "گواهی پایان دوره (برای دوره‌ها)" : "Certificate of completion (for courses)"}</li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div>
              {author && (
                <div className="spec-block" style={{ borderTop: 0, paddingTop: 0 }}>
                  <h2 className="spec-title" style={{ marginBottom: "var(--space-3)" }}>{ed.author}</h2>
                  <Link href={href(locale, `/artists/${author.slug}`)} className="pattern-artist-mini">
                    {author.avatar && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <FXImg src={author.avatar} alt={author.name[locale]} loading="lazy" />
                    )}
                    <span>
                      <span className="pattern-artist-mini-name">{author.name[locale]}</span>
                      <span className="pattern-artist-mini-prof">{author.profession[locale]}</span>
                    </span>
                    <span className="btn-arrow">
                      <span className="btn-label">{d.common.viewProfile}</span>
                      <Icon name="arrow-right" size={14} flipRtl />
                    </span>
                  </Link>
                </div>
              )}

              <div className="summary-card" style={{ position: "static", marginTop: "var(--space-5)" }}>
                <p className="summary-title">{item.kind === "course" ? d.common.startCourse : d.common.readNow}</p>
                <div className="edu-meta-band" style={{ border: 0, padding: 0, background: "transparent" }}>
                  <span className="meta-item">
                    {d.common.duration}
                    <strong className="tnum">{item.duration[locale]}</strong>
                  </span>
                  <span className="meta-item">
                    {d.common.difficultyLabel}
                    <strong>{d.difficulty[item.difficulty]}</strong>
                  </span>
                  {item.lessons && (
                    <span className="meta-item">
                      {d.common.lessons}
                      <strong className="tnum">{item.lessons}</strong>
                    </span>
                  )}
                </div>
                <Button variant="primary" block icon="book">{item.kind === "course" ? d.common.startCourse : d.common.readNow}</Button>
                <p className="secure-note"><Icon name="shield" size={14} /> {locale === "fa" ? "برای اعضای رزی آتلیه رایگان است" : "Free for Rezi Atelier members"}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container section">
        <Reveal>
          <SectionHeader title={ed.relatedPatterns} cta={{ href: href(locale, "/patterns"), label: d.common.viewAll }} />
        </Reveal>
        <div className="cards-grid cards-grid-narrow">
          {relatedPatterns.map((p, i) => (
            <Reveal key={p.slug} delay={i}>
              <PatternCard pattern={p} locale={locale} />
            </Reveal>
          ))}
        </div>
      </div>

      <div className="container section-tight">
        <Reveal>
          <SectionHeader title={ed.relatedProducts} cta={{ href: href(locale, "/products"), label: d.common.viewAll }} />
        </Reveal>
        <div className="cards-grid cards-grid-narrow">
          {relatedProducts.map((p, i) => (
            <Reveal key={p.slug} delay={i}>
              <ProductCard product={p} locale={locale} />
            </Reveal>
          ))}
        </div>
      </div>

      <div className="container section" style={{ paddingBottom: "var(--space-10)" }}>
        <Reveal>
          <SectionHeader title={ed.relatedEducation} cta={{ href: href(locale, "/education"), label: d.common.viewAll }} />
        </Reveal>
        <div className="cards-grid-wide cards-grid">
          {relatedEduFill.map((e, i) => (
            <Reveal key={e.slug} delay={i}>
              <CourseCard item={e} locale={locale} />
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
