"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { href, formatPrice, formatNumber } from "@/lib/utils";
import { getProduct } from "@/lib/data/products";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { useCommerce, cartSubtotal } from "./CommerceContext";
import { cx } from "@/lib/utils";
import FXImg from "@/components/fx/FXImg";

type ShipMethod = "standard" | "express";

export function CheckoutView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const co = d.checkout;
  const { lines, mounted, clear } = useCommerce();
  const [method, setMethod] = useState<ShipMethod>("standard");
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);

  const items = useMemo(
    () =>
      lines
        .map((l) => {
          const p = getProduct(l.productSlug);
          if (!p) return null;
          const variant = p.variants?.find((v) => v.id === l.variantId);
          const unit = (p.salePrice ?? p.price)[locale] + (variant?.priceDelta?.[locale] ?? 0);
          return { line: l, product: p, variant, unit };
        })
        .filter(Boolean) as {
        line: (typeof lines)[0];
        product: NonNullable<ReturnType<typeof getProduct>>;
        variant: { option: Record<Locale, string> } | undefined;
        unit: number;
      }[],
    [lines, locale]
  );

  const subtotal = cartSubtotal(lines, locale);
  const standardCost = subtotal >= (locale === "fa" ? 2500000 : 50) ? 0 : locale === "fa" ? 180000 : 6;
  const expressCost = locale === "fa" ? 350000 : 12;
  const shipCost = method === "express" ? expressCost : standardCost;
  const total = subtotal + shipCost;

  if (!mounted) return <div className="section-tight" aria-busy="true" />;

  if (orderId) {
    return (
      <div className="order-done section-tight">
        <div className="order-done-card">
          <span className="order-done-ico"><Icon name="check" size={30} /></span>
          <h1 className="display" style={{ fontSize: "var(--text-2xl)" }}>{co.orderDone}</h1>
          <p className="text-secondary">{co.orderThanks}</p>
          <p className="tnum" style={{ fontSize: "var(--text-lg)", fontWeight: 700 }} dir="ltr">{orderId}</p>
          <Button variant="primary" href={href(locale, "/store")}>{co.backToStore}</Button>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="section-tight" style={{ maxWidth: "34rem", marginInline: "auto" }}>
        <div className="empty-state">
          <div className="empty-art" aria-hidden="true" />
          <h3>{d.cart.empty}</h3>
          <p className="text-secondary">{d.cart.emptyHint}</p>
          <Link href={href(locale, "/store")} className="btn btn-outline">{d.cart.emptyCta}</Link>
        </div>
      </div>
    );
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const fieldErr = (k: string) => errors.includes(k);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const required = ["email", "name", "city", "address"];
    const bad = required.filter((k) => !values[k]?.trim());
    if (bad.length || !/^\S+@\S+\.\S+$/.test(values.email ?? "")) {
      setErrors([...new Set([...bad, values.email && /^\S+@\S+\.\S+$/.test(values.email) ? "" : "email"])].filter(Boolean));
      return;
    }
    setErrors([]);
    const id = `NGH-${new Intl.NumberFormat("en-US", { useGrouping: false }).format(Date.now() % 900000 + 100000)}`;
    setOrderId(id);
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Field = ({ k, label, full, type = "text", dir, textarea }: { k: string; label: string; full?: boolean; type?: string; dir?: "ltr"; textarea?: boolean }) => (
    <div className={cx("field", full && "full", fieldErr(k) && "is-error")}>
      <label className="field-label" htmlFor={`co-${k}`}>{label}</label>
      {textarea ? (
        <textarea id={`co-${k}`} className="textarea" value={values[k] ?? ""} onChange={set(k)} />
      ) : (
        <input id={`co-${k}`} type={type} className="input" value={values[k] ?? ""} onChange={set(k)} dir={dir} inputMode={type === "email" ? "email" : undefined} />
      )}
      <span className="field-error">{co.required}</span>
    </div>
  );

  return (
    <form onSubmit={submit} noValidate>
      <div className="checkout-layout section-tight">
        <div className="checkout-col">
          <section className="co-section" aria-labelledby="co-s1">
            <div className="co-section-head">
              <span className="co-step">1</span>
              <h2 className="co-section-title" id="co-s1">{co.contact}</h2>
            </div>
            <p className="co-hint">{co.contactHint}</p>
            <div className="form-grid">
              <Field k="email" label={co.email} type="email" dir="ltr" full />
              <Field k="name" label={co.fullName} />
              <Field k="phone" label={co.phone} dir="ltr" />
            </div>
          </section>

          <section className="co-section" aria-labelledby="co-s2">
            <div className="co-section-head">
              <span className="co-step">2</span>
              <h2 className="co-section-title" id="co-s2">{co.address}</h2>
            </div>
            <div className="form-grid">
              <Field k="province" label={co.province} />
              <Field k="city" label={co.city} />
              <Field k="address" label={co.addressLine} full textarea />
              <Field k="postal" label={co.postalCode} dir="ltr" />
            </div>
          </section>

          <section className="co-section" aria-labelledby="co-s3">
            <div className="co-section-head">
              <span className="co-step">3</span>
              <h2 className="co-section-title" id="co-s3">{co.shippingMethod}</h2>
            </div>
            <div className="radio-cards" role="radiogroup" aria-label={co.shippingMethod}>
              <label className={cx("radio-card", method === "standard" && "is-active")}>
                <input type="radio" name="ship" checked={method === "standard"} onChange={() => setMethod("standard")} />
                <span>{co.shippingStandard}</span>
                <span className="radio-card-price tnum">
                  {standardCost === 0 ? d.cart.free : formatPrice(locale, { fa: standardCost, en: standardCost })}
                </span>
              </label>
              <label className={cx("radio-card", method === "express" && "is-active")}>
                <input type="radio" name="ship" checked={method === "express"} onChange={() => setMethod("express")} />
                <span>{co.shippingExpress}</span>
                <span className="radio-card-price tnum">{formatPrice(locale, { fa: 350000, en: 12 })}</span>
              </label>
            </div>
          </section>

          <section className="co-section" aria-labelledby="co-s4">
            <div className="co-section-head">
              <span className="co-step">4</span>
              <h2 className="co-section-title" id="co-s4">{co.payment}</h2>
            </div>
            <p className="co-hint">{co.paymentHint}</p>
            <div className="form-grid">
              <Field k="card" label={co.cardNumber} dir="ltr" full />
              <Field k="expiry" label={co.expiry} dir="ltr" />
              <Field k="cvv" label={co.cvv} dir="ltr" />
            </div>
          </section>
        </div>

        <aside className="summary-card" aria-label={d.cart.orderSummary}>
          <p className="summary-title">{d.cart.orderSummary}</p>
          <div className="co-items">
            {items.map(({ line, product, variant, unit }) => (
              <div className="co-item" key={`${line.productSlug}-${line.variantId ?? ""}`}>
                <span className="co-item-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <FXImg src={product.images[0]} alt="" loading="lazy" />
                </span>
                <span className="co-item-name">
                  <strong>{product.name[locale]}</strong>
                  <span>
                    {product.sku} {variant ? `· ${variant.option[locale]}` : ""} · ×{formatNumber(locale, line.qty)}
                  </span>
                </span>
                <span className="tnum" style={{ fontWeight: 600 }}>{formatPrice(locale, { fa: unit * line.qty, en: unit * line.qty })}</span>
              </div>
            ))}
          </div>
          <div className="summary-row"><span>{d.cart.subtotal}</span><span className="tnum">{formatPrice(locale, { fa: subtotal, en: subtotal })}</span></div>
          <div className="summary-row"><span>{d.cart.shipping}</span><span className="tnum">{shipCost === 0 ? d.cart.free : formatPrice(locale, { fa: shipCost, en: shipCost })}</span></div>
          <div className="summary-row total"><span>{d.cart.total}</span><span className="tnum">{formatPrice(locale, { fa: total, en: total })}</span></div>
          <button type="submit" className="btn btn-accent btn-lg btn-block">
            <Icon name="shield" size={17} />
            <span className="btn-label">{co.placeOrder}</span>
          </button>
          <p className="secure-note"><Icon name="shield" size={14} />{co.secure}</p>
        </aside>
      </div>
    </form>
  );
}
