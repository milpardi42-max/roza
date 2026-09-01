"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/types";
import { href } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { useUser } from "./UserContext";

function LoginFormInner({ locale }: { locale: Locale }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggedIn } = useUser();
  const isFa = locale === "fa";
  const registered = searchParams.get("registered") === "1";

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      router.replace(href(locale, "/profile"));
    }
  }, [isLoggedIn, locale, router]);

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const bad: string[] = [];
    if (!values.email.trim()) bad.push("email");
    if (!values.password.trim()) bad.push("password");
    if (bad.length) {
      setErrors(bad);
      return;
    }
    setErrors([]);
    setServerError("");

    const result = login(values.email, values.password);
    if (!result.success) {
      setServerError(result.error || "");
      return;
    }
    router.push(href(locale, "/profile"));
  };

  return (
    <form onSubmit={submit} noValidate className="auth-form">
      {registered && (
        <div className="auth-success" role="status">
          <Icon name="check" size={18} />
          {isFa ? "عضویت با موفقیت انجام شد! حالا وارد شوید." : "Registration successful! Now login."}
        </div>
      )}

      {serverError && (
        <div className="auth-error" role="alert">
          <Icon name="x" size={16} />
          {serverError}
        </div>
      )}

      <div className="form-grid">
        <div className={`field full ${errors.includes("email") ? "is-error" : ""}`}>
          <label className="field-label" htmlFor="l-email">{isFa ? "ایمیل" : "Email"}</label>
          <input id="l-email" type="email" dir="ltr" className="input" value={values.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" />
          <span className="field-error">{isFa ? "الزامی است" : "Required"}</span>
        </div>

        <div className={`field full ${errors.includes("password") ? "is-error" : ""}`}>
          <label className="field-label" htmlFor="l-pass">{isFa ? "رمز عبور" : "Password"}</label>
          <input id="l-pass" type="password" className="input" value={values.password} onChange={set("password")} placeholder="••••••••" autoComplete="current-password" />
          <span className="field-error">{isFa ? "الزامی است" : "Required"}</span>
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg btn-block auth-submit">
        <Icon name="user" size={18} />
        <span className="btn-label">{isFa ? "ورود به حساب" : "Login to account"}</span>
      </button>

      <p className="auth-hint">
        {isFa ? "حساب ندارید؟" : "Don't have an account?"}{" "}
        <a href={href(locale, "/membership")} className="auth-link">{isFa ? "عضو شوید" : "Join now"}</a>
      </p>

      <div className="auth-demo">
        <p className="auth-demo-title">{isFa ? "دمو (بدون بک‌اند):" : "Demo (no backend):"}</p>
        <p className="auth-demo-text">{isFa ? "هر کاربری که در عضویت می‌سازید در localStorage ذخیره می‌شود و می‌توانید با همان ایمیل و رمز وارد شوید." : "Any user you create in membership is saved in localStorage and you can login with same email/password."}</p>
      </div>

      <style jsx>{`
        .auth-form { display: grid; gap: var(--space-5); }
        .auth-error {
          display: flex; align-items: center; gap: 0.5rem;
          background: #fef0f0; border: 1px solid #f8c9c9; color: #a33;
          padding: 0.8rem 1rem; border-radius: 12px; font-size: var(--text-sm);
        }
        .auth-success {
          display: flex; align-items: center; gap: 0.5rem;
          background: #eef7f0; border: 1px solid #cde6d4; color: #2e7d4f;
          padding: 0.8rem 1rem; border-radius: 12px; font-size: var(--text-sm);
        }
        .auth-submit { margin-top: var(--space-2); }
        .auth-hint { text-align: center; font-size: var(--text-sm); color: var(--fg-tertiary); }
        .auth-link { color: var(--accent-2); font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
        .auth-demo {
          margin-block-start: var(--space-6);
          padding: var(--space-4);
          background: var(--bg-sunken, #fbf9f5);
          border: 1px dashed var(--border);
          border-radius: 12px;
        }
        .auth-demo-title { font-size: var(--text-xs); font-weight: 700; color: var(--fg-secondary); margin-block-end: 0.4rem; }
        .auth-demo-text { font-size: var(--text-xs); color: var(--fg-tertiary); line-height: 1.7; }
      `}</style>
    </form>
  );
}

export function LoginForm({ locale }: { locale: Locale }) {
  return (
    <Suspense fallback={<div className="auth-form"><div className="skeleton" style={{ blockSize: "200px" }} /></div>}>
      <LoginFormInner locale={locale} />
    </Suspense>
  );
}
