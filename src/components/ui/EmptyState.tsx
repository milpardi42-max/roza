import { Button } from "./Button";
import { PatternArt } from "./PatternArt";

export function EmptyState({
  title,
  hint,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  hint?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="empty-state">
      <div className="empty-art" aria-hidden="true">
        <PatternArt
          scheme={{ motif: "rings", bg: "#f9f6f1", fg: "#d9cdbb", fg2: "#ece4d8", density: 34 }}
        />
      </div>
      <h3>{title}</h3>
      {hint && <p className="text-secondary">{hint}</p>}
      {ctaLabel && ctaHref && (
        <Button variant="outline" href={ctaHref}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
