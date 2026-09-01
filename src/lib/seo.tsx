import type { Metadata } from "next";
import type { Locale } from "./types";

const SITE = {
  fa: { name: "رزی آتلیه | بازار خلاقانهٔ نقش‌و‌نگار", suffix: "رزی آتلیه" },
  en: { name: "Rezi Atelier | Creative Pattern Marketplace", suffix: "Rezi Atelier" },
};

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://reziatelier.com";

export function seo({
  locale,
  title,
  description,
  path = "",
  image,
  type = "website",
}: {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "product";
}): Metadata {
  const url = `${BASE_URL}/${locale}${path === "/" ? "" : path}`;
  const resolveOg = (p: string) => {
    if (p.startsWith("http://") || p.startsWith("https://")) return p;
    if (p.startsWith("/")) return `${BASE_URL}${p}`;
    return p;
  };
  const ogImage = resolveOg(image ?? "/assets/brand/og-default.jpg");
  const fullTitle = title.includes(SITE[locale].suffix)
    ? title
    : `${title} — ${SITE[locale].suffix}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
      languages: {
        fa: `${BASE_URL}/fa${path === "/" ? "" : path}`,
        en: `${BASE_URL}/en${path === "/" ? "" : path}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE[locale].name,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      type: (type === "product" ? "website" : type) as "website" | "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

/** JSON-LD injector */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
