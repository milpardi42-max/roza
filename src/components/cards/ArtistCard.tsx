import Link from "next/link";
import type { Locale, Artist } from "@/lib/types";
import { href, formatNumber } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import FXImg from "@/components/fx/FXImg";

export function ArtistCard({ artist, locale }: { artist: Artist; locale: Locale }) {
  const d = getDictionary(locale);
  const url = href(locale, `/artists/${artist.slug}`);
  const initials = artist.name[locale]
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join(" ");

  return (
    <article className="acard hover-lift">
      <Link href={url} className="acard-cover" aria-label={artist.name[locale]} tabIndex={-1}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <FXImg src={artist.cover} alt="" loading="lazy" decoding="async" />
      </Link>
      <div className="acard-body">
        <Link href={url} className="acard-avatar" aria-label={artist.name[locale]}>
          {artist.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <FXImg src={artist.avatar} alt={artist.name[locale]} loading="lazy" decoding="async" />
          ) : (
            <span className="acard-mono">{initials}</span>
          )}
        </Link>
        <h3 className="acard-name">
          <Link href={url}>{artist.name[locale]}</Link>
        </h3>
        <p className="acard-prof">{artist.profession[locale]}</p>
        <ul className="acard-stats" role="list">
          <li>
            <strong>{formatNumber(locale, artist.stats.patterns)}</strong>
            {d.artistProfile.stats.patterns}
          </li>
          <li>
            <strong>{formatNumber(locale, artist.stats.products)}</strong>
            {d.artistProfile.stats.products}
          </li>
          <li>
            <strong>{formatNumber(locale, artist.stats.projects)}</strong>
            {d.artistProfile.stats.projects}
          </li>
        </ul>
        <Button variant="outline" size="sm" href={url} block>
          {d.common.viewProfile}
        </Button>
      </div>
    </article>
  );
}
