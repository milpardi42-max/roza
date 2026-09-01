import Link from "next/link";
import type { Locale, Portfolio } from "@/lib/types";
import { href } from "@/lib/utils";
import { getArtist } from "@/lib/data/artists";
import { Icon } from "@/components/ui/Icon";
import FXImg from "@/components/fx/FXImg";

export function PortfolioCard({
  project,
  locale,
  size = "md",
}: {
  project: Portfolio;
  locale: Locale;
  size?: "md" | "lg";
}) {
  const artist = getArtist(project.creatorSlug);
  const url = href(locale, `/portfolio/${project.slug}`);

  return (
    <article className={`fcard fcard-${size} hover-lift`}>
      <Link href={url} className="fcard-media img-zoom" aria-label={project.title[locale]}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <FXImg src={project.cover} alt={project.title[locale]} loading="lazy" decoding="async" />
        <span className="fcard-wash" aria-hidden="true" />
        <span className="fcard-top">
          <span className="badge badge-glass">{project.category[locale]}</span>
          <span className="fcard-year tnum">{project.year}</span>
        </span>
        <span className="fcard-bottom">
          <h3 className="fcard-title">{project.title[locale]}</h3>
          {artist && (
            <span className="fcard-creator">
              {artist.name[locale]}
            </span>
          )}
        </span>
        <span className="fcard-arrow" aria-hidden="true">
          <Icon name="arrow-right" size={18} flipRtl />
        </span>
      </Link>
    </article>
  );
}
