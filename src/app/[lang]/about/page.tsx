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
import { PageHeroArt } from "@/components/ui/PageHeroArt";


export function generateStaticParams(): Array<{ lang: Locale }> {
  return [{ lang: "fa" }, { lang: "en" }];
}


export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(lang);
  return seo({ locale: lang, title: d.aboutPage.title, description: d.aboutPage.subtitle, path: "/about" });
}

export default async function AboutPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  const a = d.aboutPage;

  return (
    <>
      <header className="page-hero has-photo">
        <PageHeroArt src="/assets/images/hero/pages/about.jpg" focus="50% 50%" />
        <div className="container">
          <Breadcrumb locale={locale} items={[{ label: d.nav.home, href: href(locale) }, { label: a.title }]} />
          <h1 className="page-hero-title">{a.title}</h1>
          <p className="page-hero-lead">{a.subtitle}</p>
        </div>
      </header>

      <div className="container section-tight">
        <Reveal>
          <div className="prose" style={{ maxWidth: "46rem" }}>
            {a.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="stats-band" role="list" style={{ marginTop: "var(--space-8)" }}>
            {a.stats.map((s) => (
              <div className="hero-stat" role="listitem" key={s.label}>
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="container section">
        <Reveal>
          <SectionHeader title={a.valuesTitle} />
        </Reveal>
        <div className="values-grid">
          {a.values.map((v, i) => (
            <Reveal key={v.title} delay={i} className="value-card">
              <span className="check-ico"><Icon name="check" size={15} /></span>
              <span className="value-title">{v.title}</span>
              <span className="text-secondary text-sm">{v.desc}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
