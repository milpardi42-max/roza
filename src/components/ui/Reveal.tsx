"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { cx } from "@/lib/utils";

/* Scroll-triggered reveal: adds .is-revealed when entering the viewport.
   Honors reduced-motion via the CSS in motion.css. */
export function Reveal({
  children,
  className,
  style,
  delay = 0,
  variant = "reveal",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  variant?: "reveal" | "reveal-image";
  as?: "div" | "section" | "article" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-revealed");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-revealed");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const TagAny = Tag as React.ElementType;
  return (
    <TagAny
      ref={ref}
      className={cx(variant, "reveal-root", className)}
      style={{ ...style, "--i": delay } as CSSProperties}
    >
      {children}
    </TagAny>
  );
}
