import type { JSX } from "react";

/* Inline icon system — stroke 1.6, 24×24, currentColor.
   flipRtl=true mirrors horizontal arrows automatically under [dir=rtl]. */

export type IconName =
  | "search" | "bag" | "heart" | "heart-solid" | "user" | "globe"
  | "menu" | "x" | "chevron-down" | "arrow-right" | "arrow-left"
  | "star" | "star-solid" | "check" | "plus" | "minus" | "trash"
  | "copy" | "eye" | "filters" | "instagram" | "link" | "mail"
  | "phone" | "pin" | "clock" | "shield" | "truck" | "card"
  | "spark" | "book" | "store" | "briefcase" | "external" | "palette"
  | "ruler" | "layers" | "grid" | "quote";

const paths: Record<IconName, JSX.Element> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></>,
  bag: <><path d="M5.5 8h13l-1 12a2 2 0 0 1-2 1.8h-7a2 2 0 0 1-2-1.8l-1-12Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></>,
  heart: <path d="M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 8.8 6a4.8 4.8 0 0 1 3.2 2 4.8 4.8 0 0 1 3.2-2 4.3 4.3 0 0 1 4.3 4.5c0 5.4-7.5 10-7.5 10Z" />,
  "heart-solid": <path fill="currentColor" stroke="none" d="M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 8.8 6a4.8 4.8 0 0 1 3.2 2 4.8 4.8 0 0 1 3.2-2 4.3 4.3 0 0 1 4.3 4.5c0 5.4-7.5 10-7.5 10Z" />,
  user: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c1.2-3.2 3.9-5 7-5s5.8 1.8 7 5" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5s1.2-6.2 3.6-8.5Z" /></>,
  menu: <path d="M4 7h16M4 12h10M4 17h16" />,
  x: <path d="m6 6 12 12M18 6 6 18" />,
  "chevron-down": <path d="m6 9.5 6 6 6-6" />,
  "arrow-right": <path d="M4 12h15m-6-7 7 7-7 7" />,
  "arrow-left": <path d="M20 12H5m6 7-7-7 7-7" />,
  star: <path d="m12 3.8 2.5 5.2 5.7.7-4.2 4 1.1 5.6-5.1-2.8-5.1 2.8 1.1-5.6-4.2-4 5.7-.7L12 3.8Z" />,
  "star-solid": <path fill="currentColor" stroke="none" d="m12 3.8 2.5 5.2 5.7.7-4.2 4 1.1 5.6-5.1-2.8-5.1 2.8 1.1-5.6-4.2-4 5.7-.7L12 3.8Z" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: <><path d="M5 7h14M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" /><path d="M7 7l1 12a2 2 0 0 0 2 1.8h4A2 2 0 0 0 16 19l1-12" /></>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5.5 15h-1a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2H12a2 2 0 0 1 2 2v1" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  filters: <path d="M4 7h9m4 0h3M4 12h3m4 0h9M4 17h13m2 0h1" strokeLinecap="round" />,
  instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="0.5" fill="currentColor" /></>,
  link: <><path d="M9.5 14.5 14.5 9.5" /><path d="M11 6.5 12.8 4.7a4 4 0 0 1 5.7 0l.8.8a4 4 0 0 1 0 5.7L17.5 13" /><path d="M13 17.5l-1.8 1.8a4 4 0 0 1-5.7 0l-.8-.8a4 4 0 0 1 0-5.7L6.5 11" /></>,
  mail: <><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="m4 7.5 8 6 8-6" /></>,
  phone: <path d="M5.5 4h4l1.5 4.5-2.3 1.8a13 13 0 0 0 5 5L15.5 13 20 14.5v4a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 6.2 2 2 0 0 1 5.5 4Z" />,
  pin: <><path d="M12 21s-6.5-5.3-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.7 12 21 12 21Z" /><circle cx="12" cy="10.3" r="2.3" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5.5l3.5 2" /></>,
  shield: <><path d="M12 3.5 4.5 6.5v5c0 4.8 3.2 8.3 7.5 9.6 4.3-1.3 7.5-4.8 7.5-9.6v-5L12 3.5Z" /><path d="m9 12 2.2 2.2L15.5 10" /></>,
  truck: <><path d="M2.5 6.5h12v10h-12z" /><path d="M14.5 10h3.8l3.2 3.2v3.3h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></>,
  card: <><rect x="2.5" y="5.5" width="19" height="13" rx="2.5" /><path d="M2.5 10h19M6 14.5h5" /></>,
  spark: <path d="M12 3v3m0 12v3M4.9 4.9 7 7m10 10 2.1 2.1M3 12h3m12 0h3M4.9 19.1 7 17m10-10 2.1-2.1" strokeLinecap="round" />,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.8A2.8 2.8 0 0 0 4 21V5.5Z" /><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" /></>,
  store: <><path d="M4.5 9.5 6 4h12l1.5 5.5" /><path d="M4 9.5h16v3a2.8 2.8 0 0 1-5.6 0 2.7 2.7 0 0 1-5.3.2 2.8 2.8 0 0 1-5.6-.3v-3Z" /><path d="M6 15.5V20h12v-4.5" /></>,
  briefcase: <><rect x="3" y="7.5" width="18" height="12" rx="2.5" /><path d="M9 7.5V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8v1.7M3 12h18" /></>,
  external: <><path d="M10 5H6.5A2.5 2.5 0 0 0 4 7.5v10a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5V14" /><path d="M14 4h6v6M20 4 11 13" /></>,
  palette: <><path d="M12 3.5a8.5 8.5 0 1 0 0 17h1.2a2.3 2.3 0 0 0 1.6-3.9 2.1 2.1 0 0 1 1.5-3.6h2.2a2 2 0 0 0 2-2A8.6 8.6 0 0 0 12 3.5Z" /><circle cx="7.5" cy="11" r="1.1" fill="currentColor" stroke="none" /><circle cx="10.5" cy="7.5" r="1.1" fill="currentColor" stroke="none" /><circle cx="14.5" cy="8" r="1.1" fill="currentColor" stroke="none" /></>,
  ruler: <path d="m3 16.5 13.5-13.5L21 7.5 7.5 21 3 16.5Zm3.5-3.5 2 2m1-5 2 2m1-5 2 2" />,
  layers: <><path d="m12 3.5 9 5-9 5-9-5 9-5Z" /><path d="m3.8 13 8.2 4.5 8.2-4.5" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  quote: <path d="M5 15.5V11c0-3 1.8-5 4.5-5.6m9 10.1V11c0-3-1.8-5-4.5-5.6" strokeLinecap="round" />,
};

export function Icon({
  name,
  size = 20,
  flipRtl = false,
  className,
  strokeWidth = 1.6,
  ...rest
}: {
  name: IconName;
  size?: number;
  flipRtl?: boolean;
  className?: string;
  strokeWidth?: number;
} & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      data-flip-rtl={flipRtl || undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
