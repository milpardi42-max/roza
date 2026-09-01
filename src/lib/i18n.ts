import fa from "./dictionaries/fa";
import en from "./dictionaries/en";
import type { Locale } from "./types";

export type Dictionary = typeof fa;

const dictionaries: Record<Locale, Dictionary> = { fa, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? fa;
}

export const locales: readonly Locale[] = ["fa", "en"];
export const defaultLocale: Locale = "fa";
export function isLocale(v: string): v is Locale {
  return v === "fa" || v === "en";
}

/** interpolate "%s" placeholders */
export function sprintf(template: string, ...args: Array<string | number>): string {
  let i = 0;
  return template.replace(/%s/g, () => String(args[i++] ?? ""));
}
