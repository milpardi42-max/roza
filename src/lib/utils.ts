import type { Locale, Money } from "./types";

/** tiny classnames joiner */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const locales: Locale[] = ["fa", "en"];
export const defaultLocale: Locale = "fa";
export const isRTL = (locale: Locale) => locale === "fa";

/** localized href — always prefixed with the locale */
export function href(locale: Locale, path = ""): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean === "/" ? "" : clean}`;
}

/** format a Money record for display in the given locale */
export function formatPrice(locale: Locale, money: Money): string {
  const value = money[locale];
  if (locale === "fa") {
    return `${new Intl.NumberFormat("fa-IR").format(value)} تومان`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export { sprintf } from "./i18n";
