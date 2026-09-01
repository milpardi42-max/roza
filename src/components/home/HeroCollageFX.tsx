"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import { asset } from "@/lib/paths";

const PANELS = [
  { src: "c1-pink-floral.jpg", cls: "hx-p-1", depth: 10 },
  { src: "c2-palms-gold.jpg", cls: "hx-p-2", depth: 18 },
  { src: "c3-silk-gold.jpg", cls: "hx-p-3", depth: 26 },
  { src: "c4-toile-birds.jpg", cls: "hx-p-4", depth: 36 },
  { src: "c5-artdeco-navy.jpg", cls: "hx-p-5", depth: 46 },
];

const BURST = [
  [0, -30], [26, -18], [30, 0], [24, 20], [0, 30], [-26, 18], [-30, 0], [-22, -22],
];

export function HeroCollageFX() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [bursts, setBursts] = useState<number[]>([]);
  const [moved, setMoved] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* — per-panel runtime state — */
    const nodes = Array.from(el.querySelectorAll<HTMLElement>(".hx-p"));
    const base = PANELS.map(() => ({ x: 0, y: 0 }));      // drag offsets (persist)
    const cur = { x: 0, y: 0 };                            // smoothed drift
    const rot = { rx: 0, ry: 0, trx: 0, try_: 0 } as { rx: number; ry: number; trx: number; try_: number };
    const target = { x: 0, y: 0 };
    let raf = 0;

    const write = () => {
      cur.x += (target.x - cur.x) * 0.085;
      cur.y += (target.y - cur.y) * 0.085;
      rot.rx += (rot.trx - rot.rx) * 0.11;
      rot.ry += (rot.try_ - rot.ry) * 0.11;
      el.classList.toggle("f-x8", fine);
      el.style.setProperty("--rx", rot.rx.toFixed(3) + "deg");
      el.style.setProperty("--ry", rot.ry.toFixed(3) + "deg");
      nodes.forEach((n, i) => {
        const d = PANELS[i].depth;
        n.style.setProperty("--px", (base[i].x + cur.x * d).toFixed(2) + "px");
        n.style.setProperty("--py", (base[i].y + cur.y * d).toFixed(2) + "px");
      });
      const alive =
        Math.abs(cur.x - target.x) > 0.0005 || Math.abs(cur.y - target.y) > 0.0005 ||
        Math.abs(rot.rx - rot.trx) > 0.01 || Math.abs(rot.ry - rot.try_) > 0.01;
      raf = alive ? requestAnimationFrame(write) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(write); };

    /* — pointer move: drift + 8D tilt — */
    const onMove = (e: PointerEvent) => {
      if (dragging) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      if (reduce) return;
      target.x = Math.max(-0.6, Math.min(0.6, nx));
      target.y = Math.max(-0.6, Math.min(0.6, ny));
      if (fine) {
        rot.try_ = Math.max(-10, Math.min(10, nx * 16));
        rot.trx = Math.max(-8, Math.min(8, -ny * 14));
      }
      kick();
    };
    const onLeave = () => {
      target.x = 0; target.y = 0; rot.trx = 0; rot.try_ = 0;
      kick();
    };

    /* — dragging panels — */
    let dragging: {
      idx: number;
      startX: number;
      startY: number;
      baseX: number;
      baseY: number;
      node: HTMLElement;
      moved: boolean;
    } | null = null;

    const onDown = (e: PointerEvent) => {
      const fig = (e.target as HTMLElement).closest<HTMLElement>(".hx-p");
      if (!fig) return;
      const idx = nodes.indexOf(fig);
      if (idx < 0) return;
      e.preventDefault();
      dragging = { idx, startX: e.clientX, startY: e.clientY, baseX: base[idx].x, baseY: base[idx].y, node: fig, moved: false };
      fig.setPointerCapture(e.pointerId);
      fig.classList.add("hx-dragging");
      el.classList.add("hx-swiping");
    };
    const onDragMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragging.startX;
      const dy = e.clientY - dragging.startY;
      if (!dragging.moved && Math.hypot(dx, dy) > 4) { dragging.moved = true; setMoved(true); }
      const r = (ref.current as HTMLElement).getBoundingClientRect();
      const clampX = r.width * 0.55;
      const clampY = r.height * 0.6;
      base[dragging.idx].x = Math.max(-clampX, Math.min(clampX, dragging.baseX + dx));
      base[dragging.idx].y = Math.max(-clampY, Math.min(clampY, dragging.baseY + dy));
      dragging.node.style.setProperty("--px", (base[dragging.idx].x + cur.x * PANELS[dragging.idx].depth).toFixed(2) + "px");
      dragging.node.style.setProperty("--py", (base[dragging.idx].y + cur.y * PANELS[dragging.idx].depth).toFixed(2) + "px");
      kick();
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging.node.classList.remove("hx-dragging");
      el.classList.remove("hx-swiping");
      try { dragging.node.releasePointerCapture(e.pointerId); } catch { /* noop */ }
      dragging = null;
      kick();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onDragMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onDragMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const burst = () => {
    const id = Date.now() + Math.random();
    setBursts((b) => [...b, id]);
    window.setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 1200);
  };

  return (
    <div className="hx-visual" ref={ref}>
      <span className="hx-dots" aria-hidden="true" />
      {PANELS.map((p, i) => (
        <figure
          key={p.src}
          className={`hx-p ${p.cls}`}
          style={{ "--i": i, "--z": `${p.depth * 2}px` } as CSSProperties}
          aria-hidden="true"
          suppressHydrationWarning
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(`/assets/images/hero/collage/${p.src}`)} alt="" draggable={false} />
        </figure>
      ))}
      <button type="button" className="hx-badge hx-badge-fx" onClick={burst} aria-label="جرقهٔ طلایی">
        <Icon name="spark" size={26} />
        {bursts.map((id) => (
          <span key={id} className="hx-burst" aria-hidden="true">
            {BURST.map(([dx, dy], i) => (
              <i key={i} style={{ "--dx": `${dx}px`, "--dy": `${dy}px` } as CSSProperties} />
            ))}
          </span>
        ))}
      </button>
      <span className="hx-hint" aria-hidden="true">
        <span className="hx-hint-pill">{moved ? "✓ عالی!" : "✥ حالت 8D — با موس جابه‌جا کن"}</span>
      </span>
      <span className="hx-star hx-star-1" aria-hidden="true"><Icon name="spark" size={22} /></span>
      <span className="hx-star hx-star-2" aria-hidden="true"><Icon name="spark" size={18} /></span>
    </div>
  );
}
