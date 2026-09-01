import type { Metadata } from "next";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { href } from "@/lib/utils";
import { CartView } from "@/components/commerce/CartView";
import { Breadcrumb } from "@/components/ui/Breadcrumb";


export function generateStaticParams(): Array<{ lang: Locale }> {
  return [{ lang: "fa" }, { lang: "en" }];
}


export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(lang);
  return { ...seo({ locale: lang, title: d.cart.title, description: d.cart.title, path: "/cart" }), robots: { index: false } };
}

export default async function CartPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const locale = lang;
  const d = getDictionary(locale);
  return (
    <div className="container section-tight">
      <Breadcrumb locale={locale} items={[{ label: d.nav.home, href: href(locale) }, { label: d.cart.title }]} />
      <h1 className="page-hero-title" style={{ marginTop: "var(--space-4)" }}>{d.cart.title}</h1>
      <CartView locale={locale} />
    </div>
  );
}
