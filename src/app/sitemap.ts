import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";
import { locales } from "@/lib/i18n";
import { patterns } from "@/lib/data/patterns";
import { products } from "@/lib/data/products";
import { artists } from "@/lib/data/artists";
import { portfolios, categories, collections, education } from "@/lib/data/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = [
    "",
    "/patterns",
    "/products",
    "/artists",
    "/portfolio",
    "/education",
    "/store",
    "/about",
    "/contact",
    "/b2b",
  ];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const p of staticPaths) {
      entries.push({
        url: `${BASE_URL}/${locale}${p}`,
        lastModified: now,
        changeFrequency: p === "" ? "daily" : "weekly",
        priority: p === "" ? 1 : 0.8,
      });
    }
    const dynamic: Array<{ path: string; freq: "weekly" | "monthly"; prio: number }> = [
      ...patterns.map((x) => ({ path: `/patterns/${x.slug}`, freq: "weekly" as const, prio: 0.7 })),
      ...products.map((x) => ({ path: `/products/${x.slug}`, freq: "weekly" as const, prio: 0.7 })),
      ...artists.map((x) => ({ path: `/artists/${x.slug}`, freq: "monthly" as const, prio: 0.6 })),
      ...portfolios.map((x) => ({ path: `/portfolio/${x.slug}`, freq: "monthly" as const, prio: 0.6 })),
      ...education.map((x) => ({ path: `/education/${x.slug}`, freq: "weekly" as const, prio: 0.6 })),
      ...categories.map((x) => ({ path: `/store/category/${x.slug}`, freq: "weekly" as const, prio: 0.6 })),
      ...collections.map((x) => ({ path: `/collections/${x.slug}`, freq: "monthly" as const, prio: 0.5 })),
    ];
    for (const d of dynamic) {
      entries.push({ url: `${BASE_URL}/${locale}${d.path}`, lastModified: now, changeFrequency: d.freq, priority: d.prio });
    }
  }
  return entries;
}
