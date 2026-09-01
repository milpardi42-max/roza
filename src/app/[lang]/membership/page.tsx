import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { href } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";
import { PageHeroArt } from "@/components/ui/PageHeroArt";
import { MembershipForm } from "@/components/auth/MembershipForm";
import { PatternArt } from "@/components/ui/PatternArt";

export function generateStaticParams(): Array<{ lang: Locale }> {
  return [{ lang: "fa" }, { lang: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFa = lang === "fa";
  return seo({
    locale: lang,
    title: isFa ? "عضویت در رزی آتلیه" : "Join Rezi Atelier",
    description: isFa ? "به جامعه ۲هزار نفری طراحان و هنرمندان رزی آتلیه بپیوندید." : "Join 2K+ designers and artists community.",
    path: "/membership",
    image: "/assets/images/hero/pages/about.jpg",
  });
}

export default async function MembershipPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  const isFa = locale === "fa";

  return (
    <>
      <header className="page-hero has-photo">
        <PageHeroArt src="/assets/images/hero/pages/about.jpg" focus="50% 50%" />
        <div className="container">
          <Breadcrumb locale={locale} items={[{ label: d.nav.home, href: href(locale) }, { label: isFa ? "عضویت" : "Membership" }]} />
          <h1 className="page-hero-title">{isFa ? "عضویت در رزی آتلیه" : "Join Rezi Atelier"}</h1>
          <p className="page-hero-lead">{isFa ? "به جامعه‌ای از خلاق‌ها بپیوندید — طراحان، هنرمندان، معماران" : "Join a community of creators — designers, artists, architects"}</p>
        </div>
      </header>

      <div className="container section-tight">
        <div className="auth-layout">
          <Reveal>
            <div className="form-card auth-card">
              <div className="auth-card-head">
                <span className="auth-card-icon"><PatternArt scheme={{ motif: "rings", bg: "#f9f6f1", fg: "#ece4d8", fg2: "#d9cdbb", density: 40 }} /></span>
                <h2>{isFa ? "ساخت حساب کاربری" : "Create account"}</h2>
                <p>{isFa ? "فقط ۳۰ ثانیه طول می‌کشد" : "Takes only 30 seconds"}</p>
              </div>
              <MembershipForm locale={locale} />
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="auth-benefits">
              <h3>{isFa ? "چرا عضو شوید؟" : "Why join?"}</h3>
              <ul>
                <li><strong>{isFa ? "۲٬۴۰۰+ نگاره" : "2,400+ patterns"}</strong> — {isFa ? "دسترسی به کتابخانه کامل" : "Full library access"}</li>
                <li><strong>{isFa ? "فروش آنلاین" : "Sell online"}</strong> — {isFa ? "آثار خود را بفروشید" : "Sell your works"}</li>
                <li><strong>{isFa ? "تخفیف اعضا" : "Member discount"}</strong> — {isFa ? "۲۰٪ تخفیف همیشگی" : "20% always"}</li>
                <li><strong>{isFa ? "جامعه خلاق" : "Creative community"}</strong> — {isFa ? "شبکه‌سازی با هنرمندان" : "Network with artists"}</li>
              </ul>
              <div className="auth-testimonial">
                <p>«{isFa ? "رزی آتلیه خانه دوم من است. هر روز الهام تازه پیدا می‌کنم." : "Rezi Atelier is my second home. I find fresh inspiration every day."}»</p>
                <span>— {isFa ? "سارا چراغی، طراح پارچه" : "Sara Cheraghi, Textile Designer"}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        .auth-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: var(--space-8); align-items: start; }
        .auth-card { position: relative; overflow: hidden; }
        .auth-card-head { text-align: center; margin-block-end: var(--space-6); position: relative; }
        .auth-card-icon { display: block; inline-size: 4rem; block-size: 4rem; margin: 0 auto var(--space-3); border-radius: 50%; overflow: hidden; border: 2px solid #e6d4ac; }
        .auth-card-head h2 { font-size: var(--text-xl); }
        .auth-card-head p { color: var(--fg-tertiary); font-size: var(--text-sm); margin-block-start: 0.3rem; }
        .auth-benefits { background: linear-gradient(180deg, #fdf8f3, #f6ecd6); border: 1px solid #e6d4ac; border-radius: 18px; padding: var(--space-6); position: sticky; inset-block-start: calc(var(--header-height) + var(--space-6)); }
        .auth-benefits h3 { font-size: var(--text-lg); margin-block-end: var(--space-4); }
        .auth-benefits ul { list-style: none; padding: 0; margin: 0; display: grid; gap: var(--space-3); }
        .auth-benefits li { font-size: var(--text-sm); color: var(--fg-secondary); line-height: 1.7; }
        .auth-benefits li strong { color: var(--fg-primary); }
        .auth-testimonial { margin-block-start: var(--space-6); padding: var(--space-4); background: #fff; border-radius: 12px; border: 1px solid #e6d4ac; }
        .auth-testimonial p { font-size: var(--text-sm); line-height: 1.9; font-style: italic; color: var(--fg-primary); }
        .auth-testimonial span { display: block; margin-block-start: 0.6rem; font-size: var(--text-xs); color: var(--fg-tertiary); font-weight: 600; }
        @media (max-width: 900px) { .auth-layout { grid-template-columns: 1fr; } .auth-benefits { position: static; } }
      `}</style>
    </>
  );
}
