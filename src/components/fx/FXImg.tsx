"use client";

import {
  ComponentProps,
  CSSProperties,
  PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";


/**
 * FXImg — لایهٔ 8D سراسری برای همهٔ تصاویر سایت.
 * Drop-in جایگزین <img>: tilt سه‌بعدی + پارالاکس اسکرول + برق نور + زوم هاور.
 * - prefers-reduced-motion → کاملاً خاموش
 * - pointer: coarse → بدون tilt، پارالاکس سبک‌تر
 * - تصاویر خیلی کوچک (<96px) → فقط shine ملایم
 */

type ImgProps = ComponentProps<"img"> & {
  /** شدت پارالاکس (۰..۱) — پیش‌فرض دراماتیک */
  depth?: number;
  /** خاموش‌کردن کامل افکت برای موارد خاص */
  fx?: boolean;
  zoom?: number;
  tilt?: number;
};

type RegItem = { el: HTMLElement; top: number; h: number; depth: number };

const registry = new Set<RegItem>();
let rafId = 0;
let vh = 1024;

function recalcAll() {
  vh = window.innerHeight || 1024;
  registry.forEach((it) => {
    const r = it.el.getBoundingClientRect();
    it.top = r.top + window.scrollY;
    it.h = r.height;
  });
}

function loop() {
  const sy = window.scrollY;
  registry.forEach((it) => {
    const center = it.top - sy + it.h / 2;
    let p = (center - vh / 2) / vh; // −1..1
    if (p > 1) p = 1;
    if (p < -1) p = -1;
    const ty = (p * it.depth * 100).toFixed(3);
    it.el.style.setProperty("--fx-py", `${ty}%`);
  });
  rafId = registry.size ? requestAnimationFrame(loop) : 0;
}

function ensureLoop() {
  if (!rafId && registry.size) {
    vh = window.innerHeight || 1024;
    rafId = requestAnimationFrame(loop);
  }
}

function register(item: RegItem) {
  registry.add(item);
  const r = item.el.getBoundingClientRect();
  item.top = r.top + window.scrollY;
  item.h = r.height;
  ensureLoop();
}

function unregister(item: RegItem) {
  registry.delete(item);
  if (!registry.size && rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
}

if (typeof window !== "undefined") {
  let rt = 0;
  window.addEventListener(
    "resize",
    () => {
      cancelAnimationFrame(rt);
      rt = requestAnimationFrame(recalcAll);
    },
    { passive: true }
  );
}

export default function FXImg({
  depth = 0.09,
  fx = false,
  zoom = 1.08,
  tilt = 10,
  className = "",
  style,
  ...rest
}: ImgProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [small, setSmall] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img || !fx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const w = img.clientWidth || wrap.clientWidth;
    const h = img.clientHeight || wrap.clientHeight;
    setSmall(w < 96 || h < 72);
    setEnabled(true);

    // پارالاکس اسکرول (روی wrapper — محاسبه بدون layout thrash)
    const item: RegItem = {
      el: wrap,
      top: 0,
      h: 0,
      depth: (coarse ? 0.55 : 1) * depth,
    };
    register(item);
    return () => unregister(item);
  }, [fx, depth]);

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (!enabled || small) return;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height;
    const ry = ((px - 0.5) * 2 * tilt).toFixed(2);
    const rx = ((0.5 - py) * 2 * tilt).toFixed(2);
    el.style.setProperty("--fx-rx", `${rx}deg`);
    el.style.setProperty("--fx-ry", `${ry}deg`);
    el.style.setProperty("--fx-mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--fx-my", `${(py * 100).toFixed(1)}%`);
  };

  const onEnter = () => {
    const el = wrapRef.current;
    if (!el) return;
    el.classList.add("fx8-active");
  };

  const onLeave = () => {
    const el = wrapRef.current;
    if (!el) return;
    el.classList.remove("fx8-active");
    el.style.setProperty("--fx-rx", "0deg");
    el.style.setProperty("--fx-ry", "0deg");
  };

  const wrapStyle = useMemo<CSSProperties>(
    () => ({
      ...style,
      ["--fx-zoom" as string]: zoom,
    }),
    [style, zoom]
  );

  if (!fx) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img ref={imgRef} className={className} style={style} {...rest} />;
  }

  return (
    <span
      ref={wrapRef}
      className={`fx8${enabled ? " fx8-on" : ""}${small ? " fx8-sm" : ""}`}
      style={wrapStyle}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} className={className} {...rest} />
    </span>
  );
}
