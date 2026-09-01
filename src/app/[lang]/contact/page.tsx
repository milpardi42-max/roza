import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { href } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PatternArt } from "@/components/ui/PatternArt";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHeroArt } from "@/components/ui/PageHeroArt";


export function generateStaticParams(): Array<{ lang: Locale }> {
  return [{ lang: "fa" }, { lang: "en" }];
}


export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(lang);
  return seo({ locale: lang, title: d.contactPage.title, description: d.contactPage.subtitle, path: "/contact" });
}

const ICONS: IconName[] = ["mail", "phone", "pin", "clock"];

export default async function ContactPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  const c = d.contactPage;

  return (
    <>
      <header className="page-hero has-photo">
        <PageHeroArt src="/assets/images/hero/pages/contact.jpg" focus="50% 48%" />
        <div className="container">
          <Breadcrumb locale={locale} items={[{ label: d.nav.home, href: href(locale) }, { label: c.title }]} />
          <h1 className="page-hero-title">{c.title}</h1>
          <p className="page-hero-lead">{c.subtitle}</p>
        </div>
      </header>

      <div className="container section-tight contact-grid">
        <Reveal>
          <div className="contact-cards">
            {c.info.map((info, i) => (
              <div className="contact-card" key={info.label}>
                <Icon name={ICONS[i]} size={20} />
                <dl>
                  <dt>{info.label}</dt>
                  <dd dir={info.ltr ? "ltr" : undefined} className={info.ltr ? "tnum" : undefined} style={info.ltr ? { textAlign: "end" } : undefined}>{info.value}</dd>
                </dl>
              </div>
            ))}
            <div className="contact-card" style={{ background: "var(--primary-soft)", borderColor: "#dce6f2" }}>
              <Icon name="spark" size={20} />
              <div>
                <dl>
                  <dt>{d.b2bPage.title}</dt>
                  <dd>{locale === "fa" ? "برای همکاری سازمانی" : "For business collaboration"} — <a href={href(locale, "/b2b")} style={{ color: "var(--accent)", fontWeight: 600 }}>{d.common.learnMore}</a></dd>
                </dl>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="form-card">
            <ContactForm locale={locale} />
          </div>
        </Reveal>
      </div>
    </>
  );
}
