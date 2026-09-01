import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { href } from "@/lib/utils";
import { education } from "@/lib/data/catalog";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PatternArt } from "@/components/ui/PatternArt";
import { CourseCard } from "@/components/cards/CourseCard";
import { PageHeroArt } from "@/components/ui/PageHeroArt";


export function generateStaticParams(): Array<{ lang: Locale }> {
  return [{ lang: "fa" }, { lang: "en" }];
}


export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(lang);
  return seo({ locale: lang, title: d.educationPage.heroTitle, description: d.educationPage.heroSubtitle, path: "/education" });
}

export default async function EducationPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  const ed = d.educationPage;

  const featured = education.find((e) => e.kind === "course" && e.popular) ?? education[0];
  const courses = education.filter((e) => e.kind === "course");
  const tutorials = education.filter((e) => e.kind === "tutorial");
  const articles = education.filter((e) => e.kind === "article");

  return (
    <>
      <header className="page-hero has-photo">
        <PageHeroArt src="/assets/images/hero/pages/education.jpg" focus="50% 50%" />
        <div className="container">
          <Breadcrumb locale={locale} items={[{ label: d.nav.home, href: href(locale) }, { label: ed.heroTitle }]} />
          <h1 className="page-hero-title">{ed.heroTitle}</h1>
          <p className="page-hero-lead">{ed.heroSubtitle}</p>
        </div>
      </header>

      {/* featured course */}
      <section className="container section-tight" aria-labelledby="edu-featured">
        <Reveal>
          <SectionHeader title={ed.featured} />
        </Reveal>
        <Reveal>
          <CourseCard item={featured} locale={locale} horizontal />
        </Reveal>
        <div className="edu-grid" style={{ marginTop: "var(--space-5)" }}>
          {courses.filter((c) => c.slug !== featured.slug).map((e, i) => (
            <Reveal key={e.slug} delay={i}>
              <CourseCard item={e} locale={locale} horizontal />
            </Reveal>
          ))}
        </div>
      </section>

      {/* learning paths */}
      <section className="section section-alt" aria-labelledby="edu-paths">
        <div className="container">
          <Reveal>
            <SectionHeader
              title={ed.paths}
              cta={{ href: href(locale, "/education/repeat-fundamentals"), label: d.common.startCourse }}
            />
          </Reveal>
          <div className="paths">
            {ed.pathsList.map((p, i) => (
              <Reveal key={p.title} delay={i} className="path-card">
                <Badge variant="copper"><span className="tnum">{p.lessons}</span></Badge>
                <span className="path-title">{p.title}</span>
                <span className="text-secondary text-sm">{p.desc}</span>
                <Link href={href(locale, `/education/${["repeat-fundamentals", "color-for-pattern-makers", "print-production-guide", "licensing-101"][i]}`)} className="btn-arrow" style={{ marginTop: "var(--space-2)" }}>
                  <span className="btn-label">{d.common.explore}</span>
                  <Icon name="arrow-right" size={14} flipRtl />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* tutorials */}
      <section className="container section" aria-labelledby="edu-tuts">
        <Reveal>
          <SectionHeader title={ed.tutorials} cta={{ href: href(locale, `/education/${tutorials[0].slug}`), label: d.common.viewAll }} />
        </Reveal>
        <div className="cards-grid-wide cards-grid">
          {tutorials.map((e, i) => (
            <Reveal key={e.slug} delay={i}>
              <CourseCard item={e} locale={locale} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* articles */}
      <section className="container section-tight" style={{ paddingBottom: "var(--space-10)" }} aria-labelledby="edu-articles">
        <Reveal>
          <SectionHeader title={ed.articles} cta={{ href: href(locale, `/education/${articles[0].slug}`), label: d.common.viewAll }} />
        </Reveal>
        <div className="cards-grid-wide cards-grid">
          {articles.map((e, i) => (
            <Reveal key={e.slug} delay={i}>
              <CourseCard item={e} locale={locale} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
