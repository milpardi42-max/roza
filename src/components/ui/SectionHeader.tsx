import { cx } from "@/lib/utils";
import { Button } from "./Button";

/** Editorial section header: eyebrow · title · lead · optional CTA */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  cta,
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: { href: string; label: string };
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div className={cx("section-head", align === "center" && "section-head-center", className)}>
      <div className="section-head-text">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="section-head-title">{title}</h2>
        {subtitle && <p className="section-head-lead">{subtitle}</p>}
      </div>
      {cta && (
        <Button variant="arrow" href={cta.href} icon="arrow-right" iconEnd className="section-head-cta">
          {cta.label}
        </Button>
      )}
    </div>
  );
}
