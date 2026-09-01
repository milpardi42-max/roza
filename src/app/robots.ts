import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/fa/cart", "/en/cart", "/fa/checkout", "/en/checkout"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
