import { cx } from "@/lib/utils";
import type { Locale, Availability, ProductTag } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";

export function Badge({
  children,
  variant = "soft",
  className,
}: {
  children: React.ReactNode;
  variant?: "soft" | "copper" | "ink" | "outline" | "success" | "warning" | "error" | "glass";
  className?: string;
}) {
  return <span className={cx("badge", `badge-${variant}`, className)}>{children}</span>;
}

export function AvailabilityBadge({ locale, value }: { locale: Locale; value: Availability }) {
  const d = getDictionary(locale).common;
  const map: Record<Availability, { label: string; cls: string }> = {
    "in-stock": { label: d.inStock, cls: "badge-success" },
    "low-stock": { label: d.lowStock, cls: "badge-warning" },
    preorder: { label: d.preorder, cls: "badge-copper" },
    "sold-out": { label: d.soldOut, cls: "badge-error" },
  };
  const m = map[value];
  return (
    <Badge variant={m.cls as "success"} className="badge-stock">
      <span className="dot" aria-hidden="true" />
      {m.label}
    </Badge>
  );
}

export function TagBadge({ locale, tag }: { locale: Locale; tag: ProductTag }) {
  const d = getDictionary(locale).common;
  const map: Record<ProductTag, { label: string; variant: "copper" | "ink" | "soft" }> = {
    new: { label: d.new, variant: "copper" },
    bestseller: { label: d.bestseller, variant: "ink" },
    exclusive: { label: d.exclusive, variant: "ink" },
    sale: { label: d.sale, variant: "copper" },
  };
  const m = map[tag];
  return <Badge variant={m.variant}>{m.label}</Badge>;
}
