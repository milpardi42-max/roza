"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx, href } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { primaryNav, secondaryNav } from "@/lib/data/navigation";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { useCommerce } from "@/components/commerce/CommerceContext";
import { useUser } from "@/components/auth/UserContext";
import { MegaMenu } from "./MegaMenu";
import { SearchOverlay } from "./SearchOverlay";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { asset } from "@/lib/paths";

export function Header({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const pathname = usePathname() ?? `/${locale}`;
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState<"patterns" | "store" | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { count, mounted } = useCommerce();
  const { user, isLoggedIn, mounted: userMounted } = useUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMega(null);
    setDrawerOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen, searchOpen]);

  const openMega = (kind: "patterns" | "store") => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMega(kind);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(null), 120);
  };

  const navLabel = (key: string) => (d.nav as Record<string, string>)[key] ?? key;
  const isActive = (path: string) => pathname.startsWith(`/${locale}${path === "/" ? "" : path}`) && path !== "/";

  return (
    <>
      <a href="#main" className="skip-link">{d.nav.skipToContent}</a>
      <header className={cx("site-header", scrolled && "is-scrolled", mega && "mega-open")}>
        <div className="header-inner container">
          <button
            className="icon-btn header-burger"
            onClick={() => setDrawerOpen(true)}
            aria-label={d.nav.openMenu}
            aria-expanded={drawerOpen}
          >
            <Icon name="menu" size={20} />
          </button>

          <Logo locale={locale} />

          <nav className="primary-nav" aria-label="Primary" onMouseLeave={scheduleClose}>
            <ul role="list">
              {primaryNav.map((item) => (
                <li key={item.key}
                  onMouseEnter={() => (item.mega ? openMega(item.mega) : setMega(null))}
                  onFocus={() => (item.mega ? openMega(item.mega) : setMega(null))}
                >
                  <Link
                    href={href(locale, item.href)}
                    className={cx("nav-link", isActive(item.href) && "is-active", item.mega && "has-mega")}
                    aria-haspopup={item.mega ? "true" : undefined}
                    aria-expanded={item.mega ? mega === item.mega : undefined}
                  >
                    {item.label[locale]}
                    {item.mega && <Icon name="chevron-down" size={13} className="nav-caret" />}
                  </Link>
                </li>
              ))}
            </ul>
            <div
              className={cx("mega-shell", mega && "is-open")}
              onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
              onMouseLeave={scheduleClose}
            >
              {mega && <MegaMenu kind={mega} locale={locale} onNavigate={() => setMega(null)} />}
            </div>
          </nav>

          <div className="header-actions">
            <button
              className="icon-btn header-search-btn"
              onClick={() => setSearchOpen(true)}
              aria-label={d.a11y.openSearch}
            >
              <Icon name="search" size={19} />
            </button>

            <LanguageSwitcher locale={locale} />

            {/* ── Membership / Profile — حرفه‌ای ── */}
            {userMounted && isLoggedIn && user ? (
              <Link 
                href={href(locale, "/profile")} 
                className="header-profile"
                aria-label={d.nav.account}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(user.avatar || "/assets/images/artists/maryam-rad.jpg")} alt={user.name} className="header-profile-avatar" />
                <span className="header-profile-name">{user.name.split(" ")[0]}</span>
              </Link>
            ) : (
              <Link 
                href={href(locale, "/membership")} 
                className="header-membership"
                aria-label={d.nav.membership}
              >
                <span className="header-membership-icon">
                  <Icon name="crown" size={16} />
                </span>
                <span className="header-membership-label">{d.nav.membership}</span>
                <span className="header-membership-shine" aria-hidden="true" />
              </Link>
            )}

            <Link href={href(locale, "/cart")} className="icon-btn header-cart" aria-label={d.nav.cart}>
              <Icon name="bag" size={19} />
              {mounted && count > 0 && <span className="cart-count tnum">{new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(count)}</span>}
            </Link>

            <Link href={href(locale, "/store")} className="btn btn-accent btn-sm header-cta">
              <Icon name="store" size={15} />
              <span className="btn-label">{d.nav.store}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────── */}
      <div className={cx("drawer-backdrop", drawerOpen && "is-open")} onClick={() => setDrawerOpen(false)} aria-hidden={!drawerOpen} />
      <aside className={cx("drawer", drawerOpen && "is-open")} aria-label={d.nav.menu} aria-hidden={!drawerOpen}>
        <div className="drawer-head">
          <Logo locale={locale} small />
          <button className="icon-btn" onClick={() => setDrawerOpen(false)} aria-label={d.nav.close}>
            <Icon name="x" size={20} />
          </button>
        </div>
        <nav className="drawer-nav" aria-label="Mobile">
          <ul role="list">
            {[...primaryNav, ...secondaryNav].map((item, i) => (
              <li key={item.key} style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={href(locale, item.href)}
                  className={cx("drawer-link", isActive(item.href) && "is-active")}
                  onClick={() => setDrawerOpen(false)}
                >
                  {item.label[locale]}
                  <Icon name="arrow-left" size={16} flipRtl className="drawer-arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="drawer-foot">
          {isLoggedIn && user ? (
            <Link href={href(locale, "/profile")} className="btn btn-membership btn-block" onClick={() => setDrawerOpen(false)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(user.avatar || "/assets/images/artists/maryam-rad.jpg")} alt="" style={{ inlineSize: "1.5rem", blockSize: "1.5rem", borderRadius: "50%" }} />
              <span className="btn-label">{user.name}</span>
            </Link>
          ) : (
            <Link href={href(locale, "/membership")} className="btn btn-membership btn-block" onClick={() => setDrawerOpen(false)}>
              <Icon name="crown" size={16} />
              <span className="btn-label">{d.nav.joinClub}</span>
            </Link>
          )}
          <Link href={href(locale, "/b2b")} className="btn btn-outline btn-block" onClick={() => setDrawerOpen(false)} style={{ marginTop: "0.75rem" }}>
            <Icon name="briefcase" size={16} />
            <span className="btn-label">{d.nav.b2b}</span>
          </Link>
        </div>
      </aside>

      {searchOpen && <SearchOverlay locale={locale} onClose={() => setSearchOpen(false)} />}
    </>
  );
}
