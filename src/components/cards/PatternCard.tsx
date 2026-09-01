import Link from "next/link";
import type { Locale, Pattern } from "@/lib/types";
import { href, formatPrice, formatNumber } from "@/lib/utils";
import { getArtist } from "@/lib/data/artists";
import { getDictionary } from "@/lib/i18n";
import { PatternArt } from "@/components/ui/PatternArt";
import { Badge } from "@/components/ui/Badge";
import { FavoriteButton } from "@/components/commerce/CommerceButtons";
import { Icon } from "@/components/ui/Icon";

/** Visual-first pattern card for discovery grids */
export function PatternCard({
  pattern,
  locale,
  trendRank,
}: {
  pattern: Pattern;
  locale: Locale;
  trendRank?: number;
}) {
  const d = getDictionary(locale);
  const artist = getArtist(pattern.creatorSlug);
  const url = href(locale, `/patterns/${pattern.slug}`);

  return (
    <article className="ncard hover-lift">
      <Link href={url} className="ncard-media img-zoom" aria-label={pattern.name[locale]}>
        <PatternArt scheme={pattern.scheme} ariaLabel={pattern.name[locale]} className="zoomable" />
        <span className="ncard-scrim" aria-hidden="true" />
        <span className="ncard-hover">
          <span className="ncard-hover-btn">
            <Icon name="eye" size={16} />
            {d.common.quickView}
          </span>
        </span>
        {pattern.tags?.includes("trending") && (
          <span className="ncard-flag">
            <Badge variant="glass">
              <Icon name="spark" size={12} />
              {d.common.trending}
            </Badge>
          </span>
        )}
        {trendRank !== undefined && (
          <span className="ncard-rank tnum">{formatNumber(locale, trendRank)}</span>
        )}
      </Link>

      <div className="ncard-body">
        <div className="ncard-row">
          <h3 className="ncard-name">
            <Link href={url}>{pattern.name[locale]}</Link>
          </h3>
          <FavoriteButton slug={pattern.slug} locale={locale} />
        </div>
        <p className="ncard-meta">
          <span className="sku tnum">{pattern.code}</span>
          <span aria-hidden="true">·</span>
          {artist && <Link href={href(locale, `/artists/${artist.slug}`)} className="ncard-creator">{artist.name[locale]}</Link>}
        </p>
        <div className="ncard-foot">
          <span className="ncard-style">{pattern.style[locale]}</span>
          <span className="ncard-price">
            {d.common.from} {formatPrice(locale, pattern.licensePrice)}
          </span>
        </div>
      </div>
    </article>
  );
}
