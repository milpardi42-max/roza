"use client";

import { useState } from "react";
import type { Locale } from "@/lib/types";
import { cx } from "@/lib/utils";
import { PatternArt } from "@/components/ui/PatternArt";
import { TagBadge, AvailabilityBadge } from "@/components/ui/Badge";
import type { PatternScheme, ProductTag, Availability } from "@/lib/types";
import FXImg from "@/components/fx/FXImg";

interface Slide {
  kind: "image" | "pattern";
  src?: string;
  scheme?: PatternScheme;
  label: string;
}

export function ProductGallery({
  slides,
  locale,
  tags,
  availability,
}: {
  slides: Slide[];
  locale: Locale;
  tags?: ProductTag[];
  availability: Availability;
}) {
  const [active, setActive] = useState(0);
  const current = slides[active] ?? slides[0];

  return (
    <div className="gallery">
      <div className="gallery-main">
        {current.kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <FXImg src={current.src} alt={current.label} />
        ) : (
          <PatternArt scheme={current.scheme!} ariaLabel={current.label} />
        )}
        <div className="gallery-flag">
          {tags?.slice(0, 2).map((t) => <TagBadge key={t} locale={locale} tag={t} />)}
          <AvailabilityBadge locale={locale} value={availability} />
        </div>
      </div>
      {slides.length > 1 && (
        <div className="gallery-thumbs" role="tablist" aria-label="Gallery">
          {slides.map((s, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              className={cx("gallery-thumb", i === active && "is-active")}
              onClick={() => setActive(i)}
              aria-label={s.label}
            >
              {s.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <FXImg src={s.src} alt="" loading="lazy" />
              ) : (
                <PatternArt scheme={s.scheme!} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
