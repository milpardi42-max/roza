import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/utils";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "accent" | "outline" | "ghost" | "ink" | "arrow";
type Size = "sm" | "md" | "lg";

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  icon,
  iconEnd = false,
  block = false,
  className,
  type = "button",
  disabled,
  onClick,
  ariaLabel,
}: {
  children?: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconEnd?: boolean;
  block?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const cls = cx(
    variant === "arrow" ? "btn-arrow" : "btn",
    variant !== "arrow" && {
      primary: "btn-primary",
      accent: "btn-accent",
      outline: "btn-outline",
      ghost: "btn-ghost",
      ink: "btn-ink",
    }[variant as Exclude<Variant, "arrow">],
    variant !== "arrow" && size === "sm" && "btn-sm",
    variant !== "arrow" && size === "lg" && "btn-lg",
    block && "btn-block",
    !children && "btn-icon",
    className
  );

  const content = (
    <>
      {icon && !iconEnd && <Icon name={icon} size={size === "sm" ? 16 : 18} flipRtl />}
      {children && <span className="btn-label">{children}</span>}
      {icon && iconEnd && <Icon name={icon} size={size === "sm" ? 16 : 18} flipRtl />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {content}
    </button>
  );
}
