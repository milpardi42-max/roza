import Link from "next/link";
import { Fragment } from "react";
import { Icon } from "./Icon";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";

export function Breadcrumb({
  locale,
  items,
}: {
  locale: Locale;
  items: { label: string; href?: string }[];
}) {
  const d = getDictionary(locale);
  return (
    <nav aria-label={d.a11y.breadcrumb} className="breadcrumb">
      <ol role="list">
        {items.map((item, i) => (
          <Fragment key={i}>
            <li aria-current={i === items.length - 1 ? "page" : undefined}>
              {item.href && i < items.length - 1 ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
            {i < items.length - 1 && (
              <li className="breadcrumb-sep" aria-hidden="true">
                <Icon name="arrow-left" size={12} flipRtl />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
