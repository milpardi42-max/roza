import Link from "next/link";
import type { Locale, EducationItem } from "@/lib/types";
import { href } from "@/lib/utils";
import { getArtist } from "@/lib/data/artists";
import { getDictionary } from "@/lib/i18n";
import { PatternArt } from "@/components/ui/PatternArt";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import FXImg from "@/components/fx/FXImg";

export function CourseCard({
  item,
  locale,
  horizontal = false,
}: {
  item: EducationItem;
  locale: Locale;
  horizontal?: boolean;
}) {
  const d = getDictionary(locale);
  const author = getArtist(item.authorSlug);
  const url = href(locale, `/education/${item.slug}`);

  return (
    <article className={`ccard hover-lift ${horizontal ? "ccard-h" : ""}`}>
      <Link href={url} className="ccard-media img-zoom" aria-label={item.title[locale]} tabIndex={-1}>
        {item.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <FXImg src={item.cover} alt={item.title[locale]} loading="lazy" decoding="async" />
        ) : item.coverScheme ? (
          <PatternArt scheme={item.coverScheme} ariaLabel={item.title[locale]} className="zoomable" />
        ) : null}
        <span className="ccard-kind">
          <Badge variant={item.kind === "course" ? "copper" : item.kind === "tutorial" ? "ink" : "soft"}>
            <Icon name={item.kind === "course" ? "book" : item.kind === "tutorial" ? "eye" : "layers"} size={12} />
            {d.kinds[item.kind]}
          </Badge>
        </span>
      </Link>
      <div className="ccard-body">
        <p className="ccard-cat">{item.category[locale]}</p>
        <h3 className="ccard-title">
          <Link href={url}>{item.title[locale]}</Link>
        </h3>
        <p className="ccard-excerpt">{item.excerpt[locale]}</p>
        <div className="ccard-meta">
          <span className="ccard-meta-item">
            <Icon name="clock" size={13} />
            <span className="tnum">{item.duration[locale]}</span>
          </span>
          <span className="ccard-meta-item">
            <Icon name="ruler" size={13} />
            {d.difficulty[item.difficulty]}
          </span>
          {item.lessons && (
            <span className="ccard-meta-item tnum">
              {item.lessons} {d.common.lessons}
            </span>
          )}
        </div>
        {author && (
          <Link href={href(locale, `/artists/${author.slug}`)} className="ccard-author">
            {author.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <FXImg src={author.avatar} alt="" loading="lazy" />
            ) : null}
            <span>{author.name[locale]}</span>
          </Link>
        )}
      </div>
    </article>
  );
}
