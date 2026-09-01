/* Rezi Atelier domain types — shaped like a real admin/CMS schema so the
   data layer can be swapped for the production API without UI changes. */

export type Locale = "fa" | "en";
export type LText = Record<Locale, string>;
export type Money = Record<Locale, number>; // fa → toman · en → usd

export interface SEO { title: LText; description: LText }

/* ── Procedural pattern recipe (admin-editable colorways) ── */
export interface PatternScheme {
  motif:
    | "archi" | "seigaiha" | "diamond" | "dots" | "rings"
    | "chevron" | "terazzo" | "botanica" | "tilestar" | "stripes";
  bg: string;
  fg: string;
  fg2?: string;
  fg3?: string;
  density?: number; // pattern tile size px
  seed?: number;
}

export type Availability = "in-stock" | "low-stock" | "preorder" | "sold-out";
export type ProductTag = "new" | "bestseller" | "exclusive" | "sale";

export interface ProductVariant {
  id: string;
  label: LText;                // e.g. "Size" / "ابعاد"
  option: LText;               // e.g. "50 × 50"
  priceDelta?: Money;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;                     // PRD-00124
  name: LText;
  category: LText;
  categorySlug: string;
  shortDescription: LText;
  description: LText;
  material?: LText;
  dimensions?: LText;
  colors: string[];                // hexes
  colorName?: LText;
  variants?: ProductVariant[];
  price: Money;
  salePrice?: Money;
  images: string[];
  imageAlt?: LText;
  stock: number;
  availability: Availability;
  tags?: ProductTag[];
  patternSlug?: string;
  artistSlug?: string;
  collectionSlug?: string;
  rating?: number;
  reviewsCount?: number;
  featured?: boolean;
  seo?: SEO;
}

export interface Pattern {
  id: string;
  slug: string;
  code: string;                    // PTN-00217
  name: LText;
  creatorSlug: string;
  style: LText;
  category: LText;
  tagline: LText;
  description: LText;
  scheme: PatternScheme;
  applications: LText[];
  licensePrice: Money;
  tags?: PatternTag[];
  favorites: number;
  featured?: boolean;
  trending?: boolean;
  seo?: SEO;
}
export type PatternTag = "trending" | "bestseller" | "new" | "exclusive";

export interface Artist {
  id: string;
  slug: string;
  name: LText;
  profession: LText;
  bio: LText;
  location: LText;
  avatar: string;                  // "" => monogram fallback
  cover: string;
  specialties: LText[];
  socials: { label: string; url: string }[];
  stats: { patterns: number; products: number; projects: number; followers: string };
  featured?: boolean;
  story?: LText;
  seo?: SEO;
}

export interface Portfolio {
  id: string;
  slug: string;
  title: LText;
  category: LText;
  year: string;
  location: LText;
  cover: string;
  gallery: string[];
  story: LText;
  creatorSlug: string;
  patternSlugs: string[];
  productSlugs: string[];
  featured?: boolean;
  tall?: boolean;                  // masonry hint
  seo?: SEO;
}

export type EducationKind = "course" | "tutorial" | "article";

export interface EducationItem {
  id: string;
  slug: string;
  kind: EducationKind;
  title: LText;
  excerpt: LText;
  category: LText;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: LText;
  lessons?: number;
  cover: string;                   // "" => PatternArt cover via scheme
  coverScheme?: PatternScheme;
  authorSlug: string;
  content: LText[];
  popular?: boolean;
  seo?: SEO;
}

export interface Category {
  slug: string;
  name: LText;
  description: LText;
  image: string;
  scheme: PatternScheme;
}

export interface Collection {
  slug: string;
  title: LText;
  description: LText;
  cover: string;
  scheme: PatternScheme;
  productSlugs: string[];
  exclusive?: boolean;
}

export interface StyleDef {
  slug: string;
  name: LText;
  description: LText;
  scheme: PatternScheme;
}

/* ── Cart ── */
export interface CartLine {
  productSlug: string;
  variantId?: string;
  qty: number;
}

export const locales: Locale[] = ["fa", "en"];
