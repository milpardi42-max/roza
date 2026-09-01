import { formatPrice, cx } from "@/lib/utils";
import type { Locale, Money } from "@/lib/types";

export function Price({
  locale,
  price,
  salePrice,
  size = "md",
}: {
  locale: Locale;
  price: Money;
  salePrice?: Money;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const onSale = salePrice && salePrice.fa < price.fa;
  return (
    <span className={cx("price", `price-${size}`)}>
      <span className={cx("price-current", onSale && "price-on-sale")}>
        {formatPrice(locale, onSale ? salePrice : price)}
      </span>
      {onSale && <s className="price-old">{formatPrice(locale, price)}</s>}
    </span>
  );
}

export function SalePercent({ price, salePrice }: { price: Money; salePrice: Money }) {
  if (!salePrice || salePrice.fa >= price.fa) return null;
  const pct = Math.round((1 - salePrice.fa / price.fa) * 100);
  return <span className="badge badge-copper sale-pct">-{pct}%</span>;
}
