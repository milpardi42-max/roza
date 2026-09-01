"use client";

import { useState } from "react";
import { cx } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";

export function FollowButton({ slug, locale }: { slug: string; locale: Locale }) {
  const d = getDictionary(locale);
  const [following, setFollowing] = useState(false);
  return (
    <button
      type="button"
      className={cx("btn", following ? "btn-ink" : "btn-primary")}
      onClick={() => setFollowing((f) => !f)}
      aria-pressed={following}
      data-creator={slug}
    >
      <Icon name={following ? "check" : "plus"} size={16} />
      <span className="btn-label">{following ? d.artistProfile.following : d.artistProfile.follow}</span>
    </button>
  );
}
