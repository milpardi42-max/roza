"use client";

import { useState } from "react";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { cx } from "@/lib/utils";

export function ContactForm({ locale, variant = "contact" }: { locale: Locale; variant?: "contact" | "b2b" }) {
  const d = getDictionary(locale);
  const f = variant === "b2b" ? d.b2bPage.form : d.contactPage.form;
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const required = ["name", "email", "message"];
    const bad = required.filter((k) => !values[k]?.trim());
    if (bad.length || !/^\S+@\S+\.\S+$/.test(values.email ?? "")) {
      setErrors([...new Set([...bad, "email"])]);
      return;
    }
    setErrors([]);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="empty-state" role="status">
        <span className="order-done-ico" style={{ marginInline: "auto" }}><Icon name="check" size={26} /></span>
        <h3>{f.success}</h3>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="form-grid">
        <div className={cx("field", errors.includes("name") && "is-error")}>
          <label className="field-label" htmlFor="cf-name">{f.name}</label>
          <input id="cf-name" className="input" value={values.name ?? ""} onChange={set("name")} autoComplete="name" />
          <span className="field-error">{d.checkout.required}</span>
        </div>
        <div className={cx("field", errors.includes("email") && "is-error")}>
          <label className="field-label" htmlFor="cf-email">{f.email}</label>
          <input id="cf-email" type="email" dir="ltr" className="input" value={values.email ?? ""} onChange={set("email")} autoComplete="email" />
          <span className="field-error">{d.checkout.required}</span>
        </div>
        {variant === "b2b" ? (
          <div className="field full">
            <label className="field-label" htmlFor="cf-company">{(d.b2bPage.form as { company?: string }).company}</label>
            <input id="cf-company" className="input" value={values.company ?? ""} onChange={set("company")} autoComplete="organization" />
          </div>
        ) : (
          <div className="field full">
            <label className="field-label" htmlFor="cf-subject">{(d.contactPage.form as { subject?: string }).subject}</label>
            <input id="cf-subject" className="input" value={values.subject ?? ""} onChange={set("subject")} />
          </div>
        )}
        <div className={cx("field", "full", errors.includes("message") && "is-error")}>
          <label className="field-label" htmlFor="cf-message">{f.message}</label>
          <textarea id="cf-message" className="textarea" rows={5} value={values.message ?? ""} onChange={set("message")} />
          <span className="field-error">{d.checkout.required}</span>
        </div>
      </div>
      <button type="submit" className="btn btn-accent btn-block" style={{ marginTop: "var(--space-5)" }}>
        <Icon name="mail" size={16} />
        <span className="btn-label">{f.send}</span>
      </button>
    </form>
  );
}
