import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { href } from "@/lib/utils";
import { CheckoutView } from "@/components/commerce/CheckoutView";
import { Breadcrumb } from "@/components/ui/Breadcrumb";


export function generateStaticParams(): Array<{ lang: Locale }> {
  return [{ lang: "fa" }, { lang: "en" }];
}


export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(lang);
  return { ...seo({ locale: lang, title: d.checkout.title, description: d.checkout.title, path: "/checkout" }), robots: { index: false } };
}

export default async function CheckoutPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  return (
    <div className="container section-tight">
      <Breadcrumb locale={locale} items={[{ label: d.nav.home, href: href(locale) }, { label: d.nav.cart, href: href(locale, "/cart") }, { label: d.checkout.title }]} />
      <h1 className="page-hero-title" style={{ marginTop: "var(--space-4)" }}>{d.checkout.title}</h1>
      <CheckoutView locale={locale} />
    </div>
  );
}
