import Link from "next/link";
import { href } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { PatternArt } from "@/components/ui/PatternArt";
import { NewsletterForm } from "./NewsletterForm";

export function Footer({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const l = d.footer.links;

  const explore: [string, string][] = [
    [l.patterns, "/patterns"],
    [l.products, "/products"],
    [l.artists, "/artists"],
    [l.portfolio, "/portfolio"],
    [l.education, "/education"],
  ];
  const store: [string, string][] = [
    [l.store, "/store"],
    [l.categories, `/store/category/cushions`],
    [l.collections, "/collections/desert-light"],
    [l.licensing, "/patterns"],
  ];
  const company: [string, string][] = [
    [l.about, "/about"],
    [l.contact, "/contact"],
    [l.b2b, "/b2b"],
    ["hello@reziatelier.com", "/contact"],
  ];
  const support: [string, string][] = [
    [l.shipping, "/contact"],
    [l.faq, "/contact"],
    [l.terms, "/about"],
    ["Instagram", "https://instagram.com"],
  ];

  const Column = ({ title, links }: { title: string; links: [string, string][] }) => (
    <nav className="footer-col" aria-label={title}>
      <h4 className="footer-col-title">{title}</h4>
      <ul role="list">
        {links.map(([label, url]) => (
          <li key={label}>
            <Link href={url.startsWith("http") ? url : href(locale, url)} className="footer-link">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <footer className="site-footer">
      <div className="footer-edge" aria-hidden="true">
        <PatternArt
          scheme={{ motif: "tilestar", bg: "#241d16", fg: "#2e4a5c", fg2: "#a05d24", fg3: "#d9b48f", density: 44 }}
        />
      </div>
      <div className="container footer-main">
        <div className="footer-brand">
          <Logo locale={locale} variant="light" />
          <p className="footer-tagline">{d.footer.tagline}</p>
          <p className="footer-news-title">{d.footer.newsletterTitle}</p>
          <NewsletterForm locale={locale} compact />
          <div className="footer-social">
            <a href="https://instagram.com" className="icon-btn footer-social-btn" aria-label="Instagram">
              <Icon name="instagram" size={18} />
            </a>
            <a href="https://behance.net" className="icon-btn footer-social-btn" aria-label="Behance">
              <Icon name="palette" size={18} />
            </a>
            <a href="mailto:hello@reziatelier.com" className="icon-btn footer-social-btn" aria-label="Email">
              <Icon name="mail" size={18} />
            </a>
          </div>
        </div>

        <div className="footer-cols">
          <Column title={d.footer.columns.explore.title} links={explore} />
          <Column title={d.footer.columns.store.title} links={store} />
          <Column title={d.footer.columns.company.title} links={company} />
          <Column title={d.footer.columns.support.title} links={support} />
        </div>
      </div>

      <div className="container footer-legal">
        <p>{d.footer.copyright}</p>
        <p className="footer-made">{d.footer.madeWith}</p>
      </div>
    </footer>
  );
}
