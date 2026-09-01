import type { LText } from "../types";

export interface NavLink {
  key: string;
  href: string;                    // locale-agnostic path
  label: LText;
  mega?: "patterns" | "store";
}

/** desktop primary navigation — intentionally lean */
export const primaryNav: NavLink[] = [
  { key: "patterns", href: "/patterns", label: { fa: "نگاره‌ها", en: "Patterns" }, mega: "patterns" },
  { key: "store", href: "/store", label: { fa: "فروشگاه", en: "Store" }, mega: "store" },
  { key: "products", href: "/products", label: { fa: "محصولات", en: "Products" } },
  { key: "artists", href: "/artists", label: { fa: "هنرمندان", en: "Artists" } },
  { key: "portfolio", href: "/portfolio", label: { fa: "نمونه‌کارها", en: "Portfolio" } },
  { key: "education", href: "/education", label: { fa: "آکادمی", en: "Academy" } },
];

/** secondary links shown in drawer & footer */
export const secondaryNav: NavLink[] = [
  { key: "collections", href: "/collections/desert-light", label: { fa: "مجموعه‌ها", en: "Collections" } },
  { key: "b2b", href: "/b2b", label: { fa: "همکاری سازمانی", en: "B2B" } },
  { key: "about", href: "/about", label: { fa: "درباره ما", en: "About" } },
  { key: "contact", href: "/contact", label: { fa: "تماس", en: "Contact" } },
];
