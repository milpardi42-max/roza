import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { href } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";
import { PageHeroArt } from "@/components/ui/PageHeroArt";
import { LoginForm } from "@/components/auth/LoginForm";
import { PatternArt } from "@/components/ui/PatternArt";
import { Suspense } from "react";

export function generateStaticParams(): Array<{ lang: Locale }> {
  return [{ lang: "fa" }, { lang: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFa = lang === "fa";
  return seo({
    locale: lang,
    title: isFa ? "ورود به حساب" : "Login",
    description: isFa ? "وارد حساب کاربری رزی آتلیه شوید." : "Login to Rezi Atelier account.",
    path: "/login",
    image: "/assets/images/hero/pages/about.jpg",
  });
}

export default async function LoginPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  const isFa = locale === "fa";

  return (
    <>
      <header className="page-hero has-photo">
        <PageHeroArt src="/assets/images/hero/pages/about.jpg" focus="50% 50%" />
        <div className="container">
          <Breadcrumb locale={locale} items={[{ label: d.nav.home, href: href(locale) }, { label: isFa ? "ورود" : "Login" }]} />
          <h1 className="page-hero-title">{isFa ? "ورود به حساب" : "Welcome back"}</h1>
          <p className="page-hero-lead">{isFa ? "خوش آمدید! وارد شوید و ادامه دهید." : "Welcome back! Login to continue."}</p>
        </div>
      </header>

      <div className="container section-tight">
        <div className="auth-layout auth-layout-narrow">
          <Reveal>
            <div className="form-card auth-card">
              <div className="auth-card-head">
                <span className="auth-card-icon"><PatternArt scheme={{ motif: "dots", bg: "#f9f6f1", fg: "#ece4d8", fg2: "#d9cdbb", density: 40 }} /></span>
                <h2>{isFa ? "ورود" : "Login"}</h2>
                <p>{isFa ? "ایمیل و رمز خود را وارد کنید" : "Enter your email and password"}</p>
              </div>
              <Suspense fallback={<div style={{ blockSize: "200px" }} />}>
                <LoginForm locale={locale} />
              </Suspense>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        .auth-layout-narrow { max-inline-size: 28rem; margin-inline: auto; }
        .auth-card { position: relative; overflow: hidden; }
        .auth-card-head { text-align: center; margin-block-end: var(--space-6); }
        .auth-card-icon { display: block; inline-size: 4rem; block-size: 4rem; margin: 0 auto var(--space-3); border-radius: 50%; overflow: hidden; border: 2px solid #e6d4ac; }
        .auth-card-head h2 { font-size: var(--text-xl); }
        .auth-card-head p { color: var(--fg-tertiary); font-size: var(--text-sm); margin-block-start: 0.3rem; }
      `}</style>
    </>
  );
}
