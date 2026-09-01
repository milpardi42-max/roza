"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/types";
import { href } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { useUser } from "./UserContext";
import { asset } from "@/lib/paths";

const PROFESSIONS_FA = [
  "طراح پارچه",
  "طراح لباس",
  "تصویرگر",
  "طراح داخلی",
  "معمار",
  "هنرمند مستقل",
  "دانشجوی هنر",
  "تولیدکننده",
  "سایر",
];

const PROFESSIONS_EN = [
  "Textile Designer",
  "Fashion Designer",
  "Illustrator",
  "Interior Designer",
  "Architect",
  "Independent Artist",
  "Art Student",
  "Manufacturer",
  "Other",
];

const STYLES_FA = ["هندسی", "گیاهی", "مینیمال", "سنتی ایرانی", "مدرن", "بوهو"];
const STYLES_EN = ["Geometric", "Botanical", "Minimal", "Persian Traditional", "Modern", "Boho"];

export function MembershipForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const { register } = useUser();
  const isFa = locale === "fa";
  const professions = isFa ? PROFESSIONS_FA : PROFESSIONS_EN;
  const styles = isFa ? STYLES_FA : STYLES_EN;

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    profession: professions[0],
    favoriteStyle: styles[0],
    password: "",
    confirmPassword: "",
    bio: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [serverError, setServerError] = useState("");

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const required: (keyof typeof values)[] = ["name", "email", "password", "confirmPassword"];
    const bad = required.filter((k) => !values[k].trim());
    const errs: string[] = [...bad];

    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) errs.push("email");
    if (values.password && values.password.length < 6) errs.push("password");
    if (values.password !== values.confirmPassword) errs.push("confirmPassword");

    if (errs.length) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setServerError("");

    const result = register({
      name: values.name,
      email: values.email,
      phone: values.phone,
      profession: values.profession,
      favoriteStyle: values.favoriteStyle,
      bio: values.bio,
      avatar: `/assets/images/artists/maryam-rad.jpg`,
      password: values.password,
    });

    if (!result.success) {
      setServerError(result.error || "");
      return;
    }

    // هدایت به لاگین
    router.push(href(locale, "/login?registered=1"));
  };

  return (
    <form onSubmit={submit} noValidate className="auth-form">
      {serverError && (
        <div className="auth-error" role="alert">
          <Icon name="x" size={16} />
          {serverError}
        </div>
      )}

      <div className="form-grid">
        <div className={`field ${errors.includes("name") ? "is-error" : ""}`}>
          <label className="field-label" htmlFor="m-name">
            {isFa ? "نام و نام خانوادگی" : "Full name"} <span className="req">*</span>
          </label>
          <input id="m-name" className="input" value={values.name} onChange={set("name")} placeholder={isFa ? "مثلاً مریم راد" : "e.g. Maryam Rad"} />
          <span className="field-error">{isFa ? "الزامی است" : "Required"}</span>
        </div>

        <div className={`field ${errors.includes("email") ? "is-error" : ""}`}>
          <label className="field-label" htmlFor="m-email">
            {isFa ? "ایمیل" : "Email"} <span className="req">*</span>
          </label>
          <input id="m-email" type="email" dir="ltr" className="input" value={values.email} onChange={set("email")} placeholder="you@example.com" />
          <span className="field-error">{isFa ? "ایمیل معتبر وارد کنید" : "Enter valid email"}</span>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="m-phone">
            {isFa ? "شماره موبایل" : "Phone"}
          </label>
          <input id="m-phone" dir="ltr" className="input" value={values.phone} onChange={set("phone")} placeholder={isFa ? "0912..." : "+98..."} />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="m-prof">{isFa ? "حرفه" : "Profession"}</label>
          <select id="m-prof" className="input" value={values.profession} onChange={set("profession")}>
            {professions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="m-style">{isFa ? "سبک مورد علاقه" : "Favorite style"}</label>
          <select id="m-style" className="input" value={values.favoriteStyle} onChange={set("favoriteStyle")}>
            {styles.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className={`field ${errors.includes("password") ? "is-error" : ""}`}>
          <label className="field-label" htmlFor="m-pass">
            {isFa ? "رمز عبور" : "Password"} <span className="req">*</span>
          </label>
          <input id="m-pass" type="password" className="input" value={values.password} onChange={set("password")} placeholder="••••••••" />
          <span className="field-error">{isFa ? "حداقل ۶ کاراکتر" : "Min 6 characters"}</span>
        </div>

        <div className={`field full ${errors.includes("confirmPassword") ? "is-error" : ""}`}>
          <label className="field-label" htmlFor="m-cpass">
            {isFa ? "تکرار رمز عبور" : "Confirm password"} <span className="req">*</span>
          </label>
          <input id="m-cpass" type="password" className="input" value={values.confirmPassword} onChange={set("confirmPassword")} placeholder="••••••••" />
          <span className="field-error">{isFa ? "رمزها یکسان نیستند" : "Passwords do not match"}</span>
        </div>

        <div className="field full">
          <label className="field-label" htmlFor="m-bio">{isFa ? "درباره شما (اختیاری)" : "About you (optional)"}</label>
          <textarea id="m-bio" className="textarea" rows={3} value={values.bio} onChange={set("bio")} placeholder={isFa ? "کمی درباره خودتان و کارتان بگویید..." : "Tell us a bit about yourself..."} />
        </div>
      </div>

      <button type="submit" className="btn btn-accent btn-lg btn-block auth-submit">
        <Icon name="crown" size={18} />
        <span className="btn-label">{isFa ? "عضویت در رزی آتلیه" : "Join Rezi Atelier"}</span>
        <span className="btn-shine" aria-hidden="true" />
      </button>

      <p className="auth-hint">
        {isFa ? "قبلاً عضو شده‌اید؟" : "Already a member?"}{" "}
        <a href={href(locale, "/login")} className="auth-link">{isFa ? "وارد شوید" : "Login"}</a>
      </p>

      <style jsx>{`
        .auth-form { display: grid; gap: var(--space-6); }
        .auth-error {
          display: flex; align-items: center; gap: 0.5rem;
          background: #fef0f0; border: 1px solid #f8c9c9; color: #a33;
          padding: 0.8rem 1rem; border-radius: 12px; font-size: var(--text-sm);
        }
        .req { color: var(--accent); }
        .auth-submit {
          position: relative; overflow: hidden; isolation: isolate;
          margin-top: var(--space-2);
        }
        .auth-submit .btn-shine {
          position: absolute; inset-block: -40%; inset-inline-start: -70%;
          inline-size: 55%;
          background: linear-gradient(100deg, transparent, rgb(255 248 222 / 0.65) 50%, transparent);
          transform: skewX(-18deg);
          z-index: 1;
        }
        html[dir="rtl"] .auth-submit .btn-shine { inset-inline-start: auto; inset-inline-end: -70%; }
        .auth-submit:hover .btn-shine {
          animation: hxShine 0.9s forwards;
        }
        html[dir="rtl"] .auth-submit:hover .btn-shine { animation-name: hxShineRtl; }
        .auth-hint {
          text-align: center; font-size: var(--text-sm); color: var(--fg-tertiary);
          margin-block-start: var(--space-2);
        }
        .auth-link { color: var(--accent-2); font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
        .auth-link:hover { color: var(--accent); }
      `}</style>
    </form>
  );
}
