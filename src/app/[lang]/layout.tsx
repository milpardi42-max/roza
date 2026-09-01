import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@/styles/globals.css";
import { getDictionary } from "@/lib/i18n";
import { locales, type Locale } from "@/lib/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CommerceProvider } from "@/components/commerce/CommerceContext";
import { QuickViewProvider } from "@/components/commerce/QuickView";
import { JsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL("https://reziatelier.com"),
  title: {
    default: "رزی آتلیه | بازار خلاقانهٔ نقش‌و‌نگار",
    template: "%s — رزی آتلیه",
  },
  description:
    "Rezi Atelier — the creative pattern marketplace. Original motifs by independent artists, licensed for your brand or turned into products for your space.",
  icons: { icon: [{ url: "/assets/brand/logo-icon-64.png", sizes: "64x64", type: "image/png" }] },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();
  const locale = lang as Locale;
  const d = getDictionary(locale);

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: locale === "fa" ? "رزی آتلیه" : "Rezi Atelier",
    url: "https://reziatelier.com",
    sameAs: ["https://instagram.com/reziatelier"],
  };

  return (
    <html lang={locale} dir={d.dir} suppressHydrationWarning>
      <body>
        {/* critical font preloads — hoisted to <head> by React */}
        <link rel="preload" href="/fonts/fa-beirut-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/fa-beirut-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/manrope-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <CommerceProvider
          locale={locale}
          addedLabel={locale === "fa" ? "به سبد افزوده شد" : "added to cart"}
          savedLabel={locale === "fa" ? "برای بعد ذخیره شد" : "saved for later"}
        >
          <QuickViewProvider locale={locale}>
            <Header locale={locale} />
            <main id="main">{children}</main>
            <Footer locale={locale} />
          </QuickViewProvider>
        </CommerceProvider>
        <JsonLd data={orgLd} />
      </body>
    </html>
  );
}
