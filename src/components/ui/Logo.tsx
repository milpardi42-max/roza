import Link from "next/link";
import { href } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export function Logo({
  locale,
  small = false,
  variant = "dark",
}: {
  locale: Locale;
  small?: boolean;
  variant?: "dark" | "light";
}) {
  return (
    <Link href={href(locale)} className="logo" aria-label={locale === "fa" ? "رزی آتلیه — صفحهٔ اصلی" : "Rozi Atelier — home"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={variant === "light" ? "/assets/brand/logo-mark-light.png" : "/assets/brand/logo-mark.png"}
        alt={locale === "fa" ? "لوگوی رزی آتلیه" : "Rozi Atelier logo"}
        className="logo-img"
        style={{ blockSize: small ? "1.7rem" : "2.15rem" }}
        width={176}
        height={68}
      />
    </Link>
  );
}
