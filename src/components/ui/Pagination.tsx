import Link from "next/link";
import { cx } from "@/lib/utils";
import { Icon } from "./Icon";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { formatNumber } from "@/lib/utils";

/** Server-rendered pagination: page links carry a ?page= param */
export function Pagination({
  locale,
  page,
  totalPages,
  basePath,
  query = {},
}: {
  locale: Locale;
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string>;
}) {
  const d = getDictionary(locale);
  if (totalPages <= 1) return null;

  const mk = (p: number) => {
    const params = new URLSearchParams({ ...query, page: String(p) });
    return `${basePath}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label={d.a11y.pagination}>
      <Link
        className={cx("page-arrow", page <= 1 && "is-disabled")}
        href={mk(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        aria-label={d.a11y.prevPage}
      >
        <Icon name="arrow-right" size={16} flipRtl />
      </Link>
      <div className="page-numbers">
        {pages.map((p) => (
          <Link key={p} href={mk(p)} className={cx("page-num", p === page && "is-active")} aria-current={p === page ? "page" : undefined}>
            {formatNumber(locale, p)}
          </Link>
        ))}
      </div>
      <Link
        className={cx("page-arrow", page >= totalPages && "is-disabled")}
        href={mk(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        aria-label={d.a11y.nextPage}
      >
        <Icon name="arrow-left" size={16} flipRtl />
      </Link>
    </nav>
  );
}
