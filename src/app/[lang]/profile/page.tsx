import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { href } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageHeroArt } from "@/components/ui/PageHeroArt";
import { ProfileView } from "@/components/auth/ProfileView";

export function generateStaticParams(): Array<{ lang: Locale }> {
  return [{ lang: "fa" }, { lang: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const isFa = lang === "fa";
  return seo({
    locale: lang,
    title: isFa ? "پروفایل من" : "My Profile",
    description: isFa ? "پروفایل اختصاصی شما در رزی آتلیه" : "Your personal profile at Rezi Atelier",
    path: "/profile",
    image: "/assets/images/hero/pages/about.jpg",
  });
}

export default async function ProfilePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  const isFa = locale === "fa";

  return (
    <>
      <header className="page-hero has-photo" style={{ paddingBlockEnd: "2rem" }}>
        <PageHeroArt src="/assets/images/hero/pages/about.jpg" focus="50% 50%" />
        <div className="container">
          <Breadcrumb locale={locale} items={[{ label: d.nav.home, href: href(locale) }, { label: isFa ? "پروفایل" : "Profile" }]} />
          <h1 className="page-hero-title" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>{isFa ? "پروفایل من" : "My Profile"}</h1>
        </div>
      </header>

      <ProfileView locale={locale} />
    </>
  );
}
