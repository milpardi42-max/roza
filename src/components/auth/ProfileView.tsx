"use client";

import { useState } from "react";
import type { Locale } from "@/lib/types";
import { href, formatNumber } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { useUser } from "./UserContext";
import { asset } from "@/lib/paths";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProfileView({ locale }: { locale: Locale }) {
  const { user, logout, updateProfile, mounted } = useUser();
  const router = useRouter();
  const isFa = locale === "fa";
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState({ name: "", bio: "", profession: "", phone: "" });

  if (!mounted) {
    return <div className="section"><div className="container"><p>...</p></div></div>;
  }

  if (!user) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: "center", paddingBlock: "4rem" }}>
          <div className="empty-state">
            <Icon name="user" size={48} />
            <h3>{isFa ? "وارد نشده‌اید" : "Not logged in"}</h3>
            <p>{isFa ? "برای مشاهده پروفایل، ابتدا وارد شوید." : "Please login to view your profile."}</p>
            <div className="cluster" style={{ justifyContent: "center", marginTop: "1.5rem" }}>
              <Link href={href(locale, "/login")} className="btn btn-primary">{isFa ? "ورود" : "Login"}</Link>
              <Link href={href(locale, "/membership")} className="btn btn-outline">{isFa ? "عضویت" : "Join"}</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const startEdit = () => {
    setEditValues({ name: user.name, bio: user.bio || "", profession: user.profession, phone: user.phone });
    setEditing(true);
  };

  const saveEdit = () => {
    updateProfile(editValues);
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push(href(locale, "/"));
  };

  const joinedDate = new Date(user.joinedAt).toLocaleDateString(isFa ? "fa-IR" : "en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-hero">
        <div className="profile-hero-bg" aria-hidden="true">
          <span className="profile-hero-pattern" />
        </div>
        <div className="container profile-hero-inner">
          <div className="profile-avatar-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(user.avatar || "/assets/images/artists/maryam-rad.jpg")} alt={user.name} className="profile-avatar" />
            <span className="profile-badge"><Icon name="crown" size={14} /></span>
          </div>
          <div className="profile-hero-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-prof">{user.profession} {user.favoriteStyle ? `· ${user.favoriteStyle}` : ""}</p>
            <p className="profile-joined">{isFa ? "عضو از" : "Member since"} {joinedDate}</p>
          </div>
          <div className="profile-hero-actions">
            <button className="btn btn-outline btn-sm" onClick={startEdit}><Icon name="palette" size={14} /> {isFa ? "ویرایش" : "Edit"}</button>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}><Icon name="x" size={14} /> {isFa ? "خروج" : "Logout"}</button>
          </div>
        </div>
      </div>

      <div className="container profile-grid">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-card">
            <h3 className="profile-card-title"><Icon name="user" size={16} /> {isFa ? "اطلاعات" : "Info"}</h3>
            <dl className="profile-dl">
              <div><dt>{isFa ? "ایمیل" : "Email"}</dt><dd dir="ltr" className="tnum">{user.email}</dd></div>
              {user.phone && <div><dt>{isFa ? "موبایل" : "Phone"}</dt><dd dir="ltr" className="tnum">{user.phone}</dd></div>}
              <div><dt>{isFa ? "حرفه" : "Profession"}</dt><dd>{user.profession}</dd></div>
              {user.favoriteStyle && <div><dt>{isFa ? "سبک" : "Style"}</dt><dd>{user.favoriteStyle}</dd></div>}
            </dl>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
          </div>

          <div className="profile-card profile-stats">
            <div className="profile-stat"><strong className="tnum">{formatNumber(locale, 0)}</strong><span>{isFa ? "نگاره" : "Patterns"}</span></div>
            <div className="profile-stat"><strong className="tnum">{formatNumber(locale, 0)}</strong><span>{isFa ? "محصول" : "Products"}</span></div>
            <div className="profile-stat"><strong className="tnum">{formatNumber(locale, 12)}</strong><span>{isFa ? "پسندیده" : "Likes"}</span></div>
          </div>

          <div className="profile-card">
            <h3 className="profile-card-title"><Icon name="gift" size={16} /> {isFa ? "مزایای عضویت" : "Membership perks"}</h3>
            <ul className="profile-perks">
              <li><Icon name="check" size={12} /> {isFa ? "دسترسی به ۲۴۰۰+ نگاره" : "Access to 2400+ patterns"}</li>
              <li><Icon name="check" size={12} /> {isFa ? "تخفیف ۲۰٪ فروشگاه" : "20% store discount"}</li>
              <li><Icon name="check" size={12} /> {isFa ? "پشتیبانی اولویت‌دار" : "Priority support"}</li>
              <li><Icon name="check" size={12} /> {isFa ? "دعوت به رویدادهای خصوصی" : "Private events"}</li>
            </ul>
          </div>
        </aside>

        {/* Main */}
        <div className="profile-main">
          {editing ? (
            <div className="profile-card">
              <h3>{isFa ? "ویرایش پروفایل" : "Edit profile"}</h3>
              <div className="form-grid" style={{ marginTop: "1.5rem" }}>
                <div className="field"><label className="field-label">{isFa ? "نام" : "Name"}</label><input className="input" value={editValues.name} onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))} /></div>
                <div className="field"><label className="field-label">{isFa ? "حرفه" : "Profession"}</label><input className="input" value={editValues.profession} onChange={(e) => setEditValues((v) => ({ ...v, profession: e.target.value }))} /></div>
                <div className="field"><label className="field-label">{isFa ? "موبایل" : "Phone"}</label><input className="input" dir="ltr" value={editValues.phone} onChange={(e) => setEditValues((v) => ({ ...v, phone: e.target.value }))} /></div>
                <div className="field full"><label className="field-label">{isFa ? "درباره" : "Bio"}</label><textarea className="textarea" rows={3} value={editValues.bio} onChange={(e) => setEditValues((v) => ({ ...v, bio: e.target.value }))} /></div>
              </div>
              <div className="cluster" style={{ marginTop: "1.5rem" }}>
                <button className="btn btn-primary" onClick={saveEdit}>{isFa ? "ذخیره" : "Save"}</button>
                <button className="btn btn-ghost" onClick={() => setEditing(false)}>{isFa ? "لغو" : "Cancel"}</button>
              </div>
            </div>
          ) : (
            <>
              <div className="profile-card">
                <h3 className="profile-card-title"><Icon name="spark" size={16} /> {isFa ? "به رزی آتلیه خوش آمدید!" : "Welcome to Rezi Atelier!"}</h3>
                <p style={{ color: "var(--fg-secondary)", lineHeight: 1.9, marginTop: "0.8rem" }}>
                  {isFa
                    ? `سلام ${user.name} عزیز! حساب شما با موفقیت ساخته شد. حالا می‌توانید نگاره‌ها را کاوش کنید، به سبد اضافه کنید و مجموعهٔ شخصی‌تان را بسازید. به زودی امکان آپلود آثار خودتان هم فعال می‌شود.`
                    : `Hello ${user.name}! Your account is ready. Explore patterns, add to cart and build your personal collection. Uploading your own works will be enabled soon.`}
                </p>
                <div className="cluster" style={{ marginTop: "1.2rem" }}>
                  <Link href={href(locale, "/patterns")} className="btn btn-accent"><Icon name="palette" size={14} /> {isFa ? "کاوش نگاره‌ها" : "Explore patterns"}</Link>
                  <Link href={href(locale, "/store")} className="btn btn-outline"><Icon name="store" size={14} /> {isFa ? "فروشگاه" : "Store"}</Link>
                </div>
              </div>

              <div className="profile-card">
                <h3 className="profile-card-title">{isFa ? "فعالیت‌های اخیر" : "Recent activity"}</h3>
                <div className="profile-empty">
                  <Icon name="layers" size={28} />
                  <p>{isFa ? "هنوز فعالیتی ندارید. شروع به کاوش کنید!" : "No activity yet. Start exploring!"}</p>
                </div>
              </div>

              <div className="profile-card">
                <h3 className="profile-card-title">{isFa ? "علاقه‌مندی‌ها" : "Wishlist"}</h3>
                <div className="profile-empty">
                  <Icon name="heart" size={28} />
                  <p>{isFa ? "هنوز چیزی ذخیره نکرده‌اید." : "Nothing saved yet."}</p>
                  <Link href={href(locale, "/patterns")} className="btn btn-sm btn-outline" style={{ marginTop: "1rem" }}>{isFa ? "مرور نگاره‌ها" : "Browse patterns"}</Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .profile-page { padding-block-end: var(--space-12); }
        .profile-hero {
          position: relative; overflow: clip;
          padding-block: var(--space-10) var(--space-8);
          margin-block-end: var(--space-8);
        }
        .profile-hero-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #fdf8f3 0%, #f6ecd6 50%, #ece4d8 100%);
          z-index: 0;
        }
        .profile-hero-pattern {
          position: absolute; inset: 0; opacity: 0.12;
          background-image: radial-gradient(#c0973f 1.5px, transparent 1.6px);
          background-size: 22px 22px;
        }
        .profile-hero-inner {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: var(--space-6);
          flex-wrap: wrap;
        }
        .profile-avatar-wrap {
          position: relative; flex-shrink: 0;
        }
        .profile-avatar {
          inline-size: 6.5rem; block-size: 6.5rem;
          border-radius: 50%; object-fit: cover;
          border: 4px solid #fff;
          box-shadow: 0 12px 32px -12px rgb(56 40 20 / 0.25), 0 0 0 1px #e6d4ac;
        }
        .profile-badge {
          position: absolute; inset-block-end: -2px; inset-inline-end: -2px;
          inline-size: 2rem; block-size: 2rem;
          display: grid; place-items: center;
          background: linear-gradient(180deg, #cfa448, #a8822c);
          color: #fff; border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 6px 16px -6px rgb(180 134 45 / 0.6);
        }
        .profile-hero-info { flex: 1; min-inline-size: 14rem; }
        .profile-name { font-size: clamp(1.5rem, 3vw, 2.2rem); font-weight: 800; color: var(--fg-primary); }
        .profile-prof { color: var(--fg-secondary); margin-block-start: 0.3rem; font-weight: 600; }
        .profile-joined { color: var(--fg-tertiary); font-size: var(--text-sm); margin-block-start: 0.4rem; }
        .profile-hero-actions { display: flex; gap: var(--space-2); }
        .profile-grid {
          display: grid; grid-template-columns: 0.9fr 1.6fr; gap: var(--space-6);
          align-items: start;
        }
        .profile-sidebar { display: grid; gap: var(--space-5); position: sticky; inset-block-start: calc(var(--header-height) + var(--space-6)); }
        .profile-main { display: grid; gap: var(--space-5); }
        .profile-card {
          background: #fff; border: 1px solid var(--border); border-radius: 18px;
          padding: var(--space-5); box-shadow: var(--shadow-xs);
        }
        .profile-card-title { display: flex; align-items: center; gap: 0.5rem; font-size: var(--text-md); font-weight: 700; }
        .profile-dl { display: grid; gap: var(--space-3); margin-block-start: var(--space-4); }
        .profile-dl div { display: flex; justify-content: space-between; gap: 1rem; padding-block: 0.6rem; border-block-end: 1px solid var(--border-soft, #f3ece0); }
        .profile-dl dt { color: var(--fg-tertiary); font-size: var(--text-sm); }
        .profile-dl dd { font-weight: 600; font-size: var(--text-sm); }
        .profile-bio { margin-block-start: var(--space-4); color: var(--fg-secondary); line-height: 1.9; font-size: var(--text-sm); background: var(--bg-sunken, #fbf9f5); padding: var(--space-3); border-radius: 12px; }
        .profile-stats { display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; }
        .profile-stat { display: grid; gap: 0.2rem; padding: var(--space-2); }
        .profile-stat strong { font-size: var(--text-xl); color: var(--fg-primary); }
        .profile-stat span { font-size: var(--text-xs); color: var(--fg-tertiary); }
        .profile-perks { list-style: none; padding: 0; margin: var(--space-4) 0 0; display: grid; gap: 0.7rem; }
        .profile-perks li { display: flex; align-items: center; gap: 0.5rem; font-size: var(--text-sm); color: var(--fg-secondary); }
        .profile-perks li :global(svg) { color: #2e7d4f; }
        .profile-empty { display: grid; justify-items: center; gap: var(--space-3); padding: var(--space-8) var(--space-4); color: var(--fg-tertiary); text-align: center; }
        .profile-empty :global(svg) { opacity: 0.4; }
        @media (max-width: 900px) {
          .profile-grid { grid-template-columns: 1fr; }
          .profile-sidebar { position: static; }
          .profile-hero-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
