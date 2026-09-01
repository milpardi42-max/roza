"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type HeroTexts = {
  titleBefore: string; titleAccent: string; titleAfter: string;
  subtitle: string; ctaPrimary: string; ctaSecondary: string;
  trustCount: string; trustTitle: string; trustSub: string;
};
type SiteContent = {
  version: number; updated: string;
  hero: Record<"fa" | "en", HeroTexts>;
  marquee: Record<"fa" | "en", string[]>;
  pageBanners: Record<string, { src: string; focus: string }>;
};

const BANNER_CHOICES = [
  "store", "patterns", "artists", "b2b", "portfolio", "education", "about", "contact", "products",
].map((s) => `/assets/images/hero/pages/${s}.jpg`);

const LS_KEY = "rezi-cms-v1";

const HERO_LABELS: Record<keyof HeroTexts, string> = {
  titleBefore: "تیتر — خط اول", titleAccent: "تیتر — واژهٔ طلایی", titleAfter: "تیتر — ادامه",
  subtitle: "زیرنویس", ctaPrimary: "دکمهٔ اصلی", ctaSecondary: "دکمهٔ دوم",
  trustCount: "چیپ تعداد اعتماد", trustTitle: "عنوان اعتماد", trustSub: "زیرمتن اعتماد",
};

export function AdminEditor({ initial, missing }: { initial: SiteContent; missing: string[] }) {
  const [data, setData] = useState<SiteContent>(initial);
  const [tab, setTab] = useState<"fa" | "en">("fa");
  const [saved, setSaved] = useState<string | null>(null);
  const [bannersPage, setBannersPage] = useState<string>("patterns");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch { /* noop */ }
  }, []);

  const setHero = (k: keyof HeroTexts, v: string) =>
    setData((d) => ({ ...d, hero: { ...d.hero, [tab]: { ...d.hero[tab], [k]: v } } }));

  const setBanner = (page: string, v: string) =>
    setData((d) => ({ ...d, pageBanners: { ...d.pageBanners, [page]: { ...d.pageBanners[page], src: v } } }));

  const setBannerFocus = (page: string, v: string) =>
    setData((d) => ({ ...d, pageBanners: { ...d.pageBanners, [page]: { ...d.pageBanners[page], focus: v } } }));

  const sizeInfo = useMemo(() => new Blob([JSON.stringify(data)]).size, [data]);

  const saveLocal = () => {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    setSaved(new Date().toLocaleTimeString("fa-IR"));
  };

  const clearLocal = () => {
    localStorage.removeItem(LS_KEY);
    setData(initial);
    setSaved(null);
  };

  const download = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "site-content.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importFile = (f: File | undefined) => {
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try { setData(JSON.parse(String(rd.result))); } catch { alert("فایل JSON معتبر نیست"); }
    };
    rd.readAsText(f);
  };

  return (
    <div className="adm">
      <div className="adm-bar">
        <div className="adm-tabs">
          {missing.length === 0 && (
            <>
              <button className={tab === "fa" ? "on" : ""} onClick={() => setTab("fa")}>فارسی</button>
              <button className={tab === "en" ? "on" : ""} onClick={() => setTab("en")}>English</button>
            </>
          )}
        </div>
        <div className="adm-actions">
          <button className="adm-btn primary" onClick={saveLocal}>ذخیرهٔ محلی</button>
          <button className="adm-btn" onClick={download}>دانلود JSON</button>
          <label className="adm-btn">
            ورود فایل
            <input type="file" accept="application/json" hidden onChange={(e) => importFile(e.target.files?.[0])} />
          </label>
          <button className="adm-btn ghost" onClick={clearLocal}>ریست</button>
        </div>
      </div>

      {saved && <p className="adm-note">✓ ذخیره محلی انجام شد — {saved} · اندازه {sizeInfo} بایت</p>}
      {missing.length > 0 && (
        <p className="adm-note">⚠ هشدار: این لینک‌ها از CMS خارج شده‌اند (به‌جای خواندن seed): {missing.join(", ")}</p>
      )}

      <section className="adm-card">
        <h2>هیروی صفحهٔ اصلی ({tab})</h2>
        <div className="adm-grid">
          {(Object.keys(HERO_LABELS) as Array<keyof HeroTexts>).map((k) => (
            <label key={k} className={k === "subtitle" ? "adm-wide" : ""}>
              <span>{HERO_LABELS[k]}</span>
              {k === "subtitle" ? (
                <textarea rows={3} value={data.hero[tab][k]} onChange={(e) => setHero(k, e.target.value)} />
              ) : (
                <input value={data.hero[tab][k]} onChange={(e) => setHero(k, e.target.value)} />
              )}
            </label>
          ))}
        </div>
        <label className="adm-wide">
          <span>آیتم‌های مارکی (با کاما جدا کنید)</span>
          <input
            value={data.marquee[tab].join(", ")}
            onChange={(e) =>
              setData((d) => ({
                ...d,
                marquee: { ...d.marquee, [tab]: e.target.value.split(/[,،]/).map((x) => x.trim()).filter(Boolean) },
              }))
            }
          />
        </label>
      </section>

      <section className="adm-card">
        <h2>بنرهای هیروی صفحات</h2>
        <div className="adm-tabs small">
          {Object.keys(data.pageBanners).map((p) => (
            <button key={p} className={bannersPage === p ? "on" : ""} onClick={() => setBannersPage(p)}>{p}</button>
          ))}
        </div>
        <div className="adm-banner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.pageBanners[bannersPage]?.src} alt="" />
          <div>
            <label className="adm-wide">
              <span>فایل عکس</span>
              <select value={data.pageBanners[bannersPage]?.src ?? ""} onChange={(e) => setBanner(bannersPage, e.target.value)}>
                {BANNER_CHOICES.map((c) => <option key={c} value={c}>{c.split("/").pop()}</option>)}
                {data.pageBanners[bannersPage]?.src && !BANNER_CHOICES.includes(data.pageBanners[bannersPage].src) && (
                  <option value={data.pageBanners[bannersPage].src}>{data.pageBanners[bannersPage].src}</option>
                )}
              </select>
            </label>
            <label className="adm-wide">
              <span>نقطهٔ فوکوس (object-position)</span>
              <select value={data.pageBanners[bannersPage]?.focus ?? "50% 50%"} onChange={(e) => setBannerFocus(bannersPage, e.target.value)}>
                {["50% 20%", "50% 35%", "50% 42%", "50% 45%", "50% 48%", "50% 50%", "50% 62%", "50% 75%"].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="adm-card">
        <h2>اعمال روی سایت</h2>
        <p className="adm-hint">
          این پنل خروجی JSON می‌دهد. بعد از «دانلود JSON» فایل را به تولیدکننده بدهید یا در <code>content/cms/site-content.json</code> جایگذاری و بیلد کنید.
          برای خواندنِ زندهٔ این محتوا در runtime، دیکشنری‌ها به لایهٔ CMS وصل می‌شوند (به README-CMS.md مراجعه کنید).
        </p>
      </section>

      <style jsx global>{`
        .adm { display: grid; gap: var(--space-6); max-inline-size: 60rem; margin-inline: auto; direction: rtl; }
        .adm-bar { display: flex; flex-wrap: wrap; gap: var(--space-3); align-items: center; justify-content: space-between; }
        .adm-tabs { display: inline-flex; gap: 4px; background: var(--bg-tertiary, #f4eee6); padding: 4px; border-radius: 999px; }
        .adm-tabs button { border: 0; background: transparent; padding: 0.4rem 1rem; border-radius: 999px; cursor: pointer; font: inherit; font-size: var(--text-sm); }
        .adm-tabs button.on { background: var(--accent-2, #c0973f); color: #fff; }
        .adm-tabs.small { flex-wrap: wrap; margin-block: var(--space-3); border-radius: 14px; padding: 6px; }
        .adm-tabs.small button { font-size: var(--text-xs); padding: 0.3rem 0.7rem; }
        .adm-actions { display: flex; flex-wrap: wrap; gap: var(--space-2); }
        .adm-btn { border: 1px solid var(--border-default, #d9cdbb); background: #fff; border-radius: 12px; padding: 0.5rem 1rem; cursor: pointer; font: inherit; font-size: var(--text-sm); }
        .adm-btn.primary { background: linear-gradient(180deg, #cfa448, #c0973f 55%, #a8822c); color: #fff; border-color: transparent; box-shadow: 0 10px 22px -10px rgb(180 134 45 / 0.6); }
        .adm-btn.ghost { color: #a0552c; }
        .adm-card { background: #fff; border: 1px solid var(--border-default, #d9cdbb); border-radius: 18px; padding: var(--space-5); box-shadow: var(--shadow-xs, 0 8px 20px -12px rgb(56 40 20 / 0.12)); }
        .adm-card h2 { margin-block-end: var(--space-4); font-size: var(--text-lg); }
        .adm-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-4); margin-block-end: var(--space-4); }
        .adm-wide { grid-column: 1 / -1; display: grid; gap: 6px; }
        .adm-card label span { font-size: var(--text-xs); color: #7d7163; font-weight: 600; }
        .adm-card input, .adm-card textarea, .adm-card select { border: 1px solid var(--border-default, #d9cdbb); border-radius: 10px; padding: 0.55rem 0.75rem; font: inherit; background: var(--bg-sunken, #fbf9f5); }
        .adm-card textarea { resize: vertical; }
        .adm-banner { display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--space-4); align-items: start; }
        .adm-banner img { inline-size: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 12px; border: 1px solid var(--border-default, #d9cdbb); }
        .adm-hint { color: #7d7163; font-size: var(--text-sm); line-height: 1.9; }
        .adm-note { font-size: var(--text-sm); color: #2e7d4f; background: #eef7f0; border: 1px solid #cde6d4; padding: 0.5rem 0.9rem; border-radius: 10px; }
        @media (max-width: 720px) { .adm-grid, .adm-banner { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
