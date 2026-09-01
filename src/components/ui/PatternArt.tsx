import type { JSX } from "react";
import type { PatternScheme } from "@/lib/types";

/* ─────────────────────────────────────────────────────────────
   PatternArt — server-rendered procedural SVG pattern engine.
   Every motif tile is generated from an admin-editable scheme
   (motif + palette + density + seed). Deterministic: identical
   on server & client, so it is hydration-safe.
────────────────────────────────────────────────────────────── */

/** deterministic seeded rng (mulberry32) */
function rng(seed: number) {
  let a = seed >>> 0 || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function starPoints(cx: number, cy: number, rO: number, rI: number, points = 8, rot = -Math.PI / 2): string {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rO : rI;
    const a = rot + (i * Math.PI) / points;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

function tile(scheme: PatternScheme, id: string): { w: number; h: number; body: JSX.Element } {
  const s = scheme.density ?? 48;
  const { bg, fg } = scheme;
  const fg2 = scheme.fg2 ?? fg;
  const fg3 = scheme.fg3 ?? fg2;
  const sw = Math.max(1, s * 0.06);

  switch (scheme.motif) {
    case "stripes":
      return {
        w: s, h: s,
        body: (
          <>
            <rect width={s} height={s} fill={bg} />
            <rect y={0} width={s} height={s * 0.3} fill={fg} />
            <rect y={s * 0.46} width={s} height={s * 0.1} fill={fg2} />
            <rect y={s * 0.68} width={s} height={s * 0.05} fill={fg} opacity={0.65} />
          </>
        ),
      };

    case "chevron": {
      const half = s / 2;
      return {
        w: s, h: s,
        body: (
          <>
            <rect width={s} height={s} fill={bg} />
            <path d={`M ${-half} ${s} L 0 ${half} L ${half} ${s} L ${s} ${half} L ${s + half} ${s}`}
              fill="none" stroke={fg} strokeWidth={s * 0.16} />
            <path d={`M ${-half} ${half} L 0 0 L ${half} ${half} L ${s} 0 L ${s + half} ${half}`}
              fill="none" stroke={fg2} strokeWidth={s * 0.16} />
          </>
        ),
      };
    }

    case "dots":
      return {
        w: s, h: s,
        body: (
          <>
            <rect width={s} height={s} fill={bg} />
            <circle cx={s * 0.25} cy={s * 0.25} r={s * 0.13} fill={fg} />
            <circle cx={s * 0.75} cy={s * 0.75} r={s * 0.13} fill={fg} />
            <circle cx={s * 0.75} cy={s * 0.25} r={s * 0.045} fill={fg2} />
            <circle cx={s * 0.25} cy={s * 0.75} r={s * 0.045} fill={fg2} />
          </>
        ),
      };

    case "rings": {
      const c = s / 2;
      return {
        w: s, h: s,
        body: (
          <>
            <rect width={s} height={s} fill={bg} />
            <circle cx={c} cy={c} r={s * 0.36} fill="none" stroke={fg} strokeWidth={sw} />
            <circle cx={c} cy={c} r={s * 0.22} fill="none" stroke={fg2} strokeWidth={sw} />
            <circle cx={c} cy={c} r={s * 0.07} fill={fg} />
            <circle cx={0} cy={0} r={s * 0.18} fill="none" stroke={fg} strokeWidth={sw} opacity={0.5} />
            <circle cx={s} cy={0} r={s * 0.18} fill="none" stroke={fg} strokeWidth={sw} opacity={0.5} />
            <circle cx={0} cy={s} r={s * 0.18} fill="none" stroke={fg} strokeWidth={sw} opacity={0.5} />
            <circle cx={s} cy={s} r={s * 0.18} fill="none" stroke={fg} strokeWidth={sw} opacity={0.5} />
          </>
        ),
      };
    }

    case "seigaiha": {
      const radii = [s * 0.34, s * 0.56, s * 0.78];
      const colors = [fg, fg2, fg];
      const arcs = (x: number, y: number) =>
        radii.map((r, i) => (
          <circle key={`${x}-${y}-${i}`} cx={x} cy={y} r={r} fill="none"
            stroke={colors[i]} strokeWidth={sw * 1.1} />
        ));
      return {
        w: s, h: s / 2,
        body: (
          <>
            <rect width={s} height={s / 2} fill={bg} />
            {arcs(0, s / 2)}
            {arcs(s, s / 2)}
            {arcs(s / 2, 0)}
          </>
        ),
      };
    }

    case "diamond":
      return {
        w: s, h: s,
        body: (
          <>
            <rect width={s} height={s} fill={bg} />
            <path d={`M 0 ${s} L ${s} 0`} fill="none" stroke={fg} strokeWidth={sw} />
            <path d={`M 0 0 L ${s} ${s}`} fill="none" stroke={fg} strokeWidth={sw} />
            <polygon points={`${s / 2},${s * 0.32} ${s * 0.68},${s / 2} ${s / 2},${s * 0.68} ${s * 0.32},${s / 2}`}
              fill={bg} stroke={fg2} strokeWidth={sw} />
            <circle cx={s / 2} cy={s / 2} r={s * 0.05} fill={fg2} />
          </>
        ),
      };

    case "archi": {
      return {
        w: s, h: s,
        body: (
          <>
            <rect width={s} height={s} fill={bg} />
            <path d={`M 0 ${s} A ${s / 2} ${s / 2} 0 0 1 ${s} ${s}`} fill="none" stroke={fg} strokeWidth={s * 0.14} />
            <path d={`M 0 ${s * 0.78} L ${s} ${s * 0.78}`} stroke={fg} strokeWidth={sw} opacity={0.4} />
            <circle cx={0} cy={0} r={s * 0.16} fill={fg2} />
            <circle cx={s} cy={0} r={s * 0.16} fill={fg2} />
            <circle cx={s / 2} cy={s * 0.5} r={s * 0.05} fill={fg2} />
          </>
        ),
      };
    }

    case "tilestar": {
      const star = starPoints(s / 2, s / 2, s * 0.44, s * 0.19);
      const quarter = starPoints(0, 0, s * 0.24, s * 0.105);
      return {
        w: s, h: s,
        body: (
          <>
            <rect width={s} height={s} fill={bg} />
            <g id={`${id}-q`}>
              <polygon points={quarter} fill={fg2} opacity={0.9} />
            </g>
            <use href={`#${id}-q`} x={s} y={0} />
            <use href={`#${id}-q`} x={0} y={s} />
            <use href={`#${id}-q`} x={s} y={s} />
            <polygon points={star} fill={fg} />
            <polygon points={`${s / 2},${s * 0.34} ${s * 0.66},${s / 2} ${s / 2},${s * 0.66} ${s * 0.34},${s / 2}`}
              fill={bg} />
            <circle cx={s / 2} cy={s / 2} r={s * 0.07} fill={fg3} />
          </>
        ),
      };
    }

    case "terazzo": {
      const rand = rng(scheme.seed ?? 5);
      const colors = [fg, fg2, fg3];
      const flecks = Array.from({ length: 13 }, (_, i) => {
        const cx = rand() * s;
        const cy = rand() * s;
        const r = s * (0.05 + rand() * 0.1);
        const points = 5 + Math.floor(rand() * 3);
        const rot = rand() * Math.PI * 2;
        const pts: string[] = [];
        for (let k = 0; k < points; k++) {
          const a = rot + (k / points) * Math.PI * 2;
          const rr = r * (0.6 + rand() * 0.7);
          pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
        }
        return <polygon key={i} points={pts.join(" ")} fill={colors[i % 3]} opacity={0.85} />;
      });
      return {
        w: s, h: s,
        body: (
          <>
            <rect width={s} height={s} fill={bg} />
            {flecks}
          </>
        ),
      };
    }

    case "botanica": {
      const rand = rng(scheme.seed ?? 3);
      const stem = (x: number, color: string, flip: boolean) => {
        const top = s * 0.12;
        const leaves = [0.32, 0.52, 0.7].map((ty, i) => {
          const lx = x + (flip ? -1 : 1) * s * 0.16;
          const ly = s * ty;
          const cxp = s * (0.08 + rand() * 0.08);
          return (
            <ellipse key={i} cx={flip ? x - lx + x : lx} cy={ly} rx={cxp} ry={cxp * 0.42}
              fill={color} opacity={0.9} transform={`rotate(${flip ? 35 : -35} ${flip ? x - (lx - x) : lx} ${ly})`} />
          );
        });
        return (
          <g>
            <path d={`M ${x} ${s} Q ${x + (flip ? s * 0.12 : -s * 0.12)} ${s * 0.55} ${x} ${top}`}
              fill="none" stroke={color} strokeWidth={s * 0.045} strokeLinecap="round" />
            {leaves}
          </g>
        );
      };
      return {
        w: s, h: s * 1.4,
        body: (
          <>
            <rect width={s} height={s * 1.4} fill={bg} />
            {stem(s * 0.28, fg, false)}
            {stem(s * 0.78, fg2, true)}
          </>
        ),
      };
    }

    default:
      return { w: s, h: s, body: <rect width={s} height={s} fill={bg} /> };
  }
}

export function PatternArt({
  scheme,
  className,
  style,
  ariaLabel,
}: {
  scheme: PatternScheme;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}) {
  const key = `${scheme.motif}-${scheme.bg}${scheme.fg}${scheme.fg2 ?? ""}${scheme.density ?? ""}`.replace(/[#\s]/g, "");
  const id = `pa-${key}`;
  const t = tile(scheme, id);

  return (
    <svg
      className={className}
      style={style}
      width="100%"
      height="100%"
      viewBox={`0 0 ${t.w} ${t.h}`}
      preserveAspectRatio="xMidYMid slice"
      role={ariaLabel ? "img" : "presentation"}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <defs>
        <pattern id={id} width={t.w} height={t.h} patternUnits="userSpaceOnUse">
          {t.body}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
