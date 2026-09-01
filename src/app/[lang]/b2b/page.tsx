import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { href } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Icon } from "@/components/ui/Icon";
import { PatternArt } from "@/components/ui/PatternArt";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ContactForm } from "@/components/forms/ContactForm";
import { portfolios } from "@/lib/data/catalog";
import { ProductCard } from "@/components/cards/ProductCard";
import { products } from "@/lib/data/products";
import { PageHeroArt } from "@/components/ui/PageHeroArt";

import FXImg from "@/components/fx/FXImg";

export function generateStaticParams(): Array<{ lang: Locale }> {
  return [{ lang: "fa" }, { lang: "en" }];
}


export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(lang);
  return seo({ locale: lang, title: d.b2bPage.title, description: d.b2bPage.subtitle, path: "/b2b" });
}

export default async function B2BPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  const b = d.b2bPage;
  const caseStudy = portfolios[0];
  const showroom = products.slice(0, 4);

  return (
    <>
      <header className="page-hero has-photo">
        <PageHeroArt src="/assets/images/hero/pages/b2b.jpg" focus="50% 50%" />
        <div className="container" style={{ position: "relative" }}>
          <Breadcrumb locale={locale} items={[{ label: d.nav.home, href: href(locale) }, { label: b.title }]} />
          <h1 className="page-hero-title">{b.title}</h1>
          <p className="page-hero-lead">{b.subtitle}</p>
          <p className="page-hero-lead" style={{ marginTop: "var(--space-2)", fontSize: "var(--text-base)" }}>{b.pitch}</p>
        </div>
      </header>

      <div className="container section-tight">
        <div className="values-grid">
          {b.services.map((s, i) => (
            <Reveal key={s.title} delay={i} className="value-card">
              <span className="check-ico"><Icon name="briefcase" size={15} /></span>
              <span className="value-title">{s.title}</span>
              <span className="text-secondary text-sm">{s.desc}</span>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="container section-tight">
        <Reveal>
          <SectionHeader title={b.processTitle} />
        </Reveal>
        <ol className="steps">
          {b.process.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i} className="step">
              <span className="step-num tnum">{i + 1}</span>
              <span className="step-title">{p.title}</span>
              <span className="text-secondary text-sm">{p.desc}</span>
            </Reveal>
          ))}
        </ol>
      </div>

      {caseStudy && (
        <div className="container section-tight">
          <Reveal>
            <SectionHeader
              title={locale === "fa" ? "پروژه‌های سازمانی" : "Business projects"}
              cta={{ href: href(locale, "/portfolio"), label: d.common.viewAll }}
            />
          </Reveal>
          <Reveal>
            <a href={href(locale, `/portfolio/${caseStudy.slug}`)} className="b2b-case">
              <span className="b2b-case-img" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <FXImg src={caseStudy.cover} alt="" loading="lazy" />
              </span>
              <span className="b2b-case-text">
                <span className="eyebrow">{caseStudy.category[locale]} · {caseStudy.year}</span>
                <span className="b2b-case-title">{caseStudy.title[locale]}</span>
                <span className="text-secondary b2b-case-excerpt">{caseStudy.story[locale]}</span>
                <span className="btn-arrow" aria-hidden="true">
                  {locale === "fa" ? "مشاهدهٔ پروژه" : "View project"}
                  <Icon name={locale === "fa" ? "arrow-left" : "arrow-right"} size={15} />
                </span>
              </span>
            </a>
          </Reveal>
        </div>
      )}

      <div className="container section-tight">
        <Reveal>
          <SectionHeader title={locale === "fa" ? "پیشنهاد فروشگاه برای پروژه‌ها" : "Store picks for projects"} cta={{ href: href(locale, "/store"), label: d.common.viewAll }} />
        </Reveal>
        <div className="cards-grid">
          {showroom.map((p, i) => (
            <Reveal key={p.slug} delay={i}>
              <ProductCard product={p} locale={locale} />
            </Reveal>
          ))}
        </div>
      </div>

      <div className="container section">
        <div className="b2b-form-wrap">
          <Reveal className="prose" style={{ maxWidth: "26rem" }}>
            <h2 className="display" style={{ fontSize: "var(--text-2xl)", marginTop: 0 }}>{b.form.title}</h2>
            <p className="text-secondary">{b.pitch}</p>
            <ul className="tick-list">
              {b.services.slice(0, 3).map((s) => (
                <li key={s.title}><Icon name="check" size={14} /> {s.title}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={1}>
            <div className="form-card">
              <ContactForm locale={locale} variant="b2b" />
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
