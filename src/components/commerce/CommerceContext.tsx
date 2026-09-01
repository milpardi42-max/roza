"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Locale } from "@/lib/types";
import { getProduct } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

interface Toast {
  id: number;
  message: string;
}

interface CommerceAPI {
  lines: CartLine[];
  count: number;
  add: (productSlug: string, qty?: number, variantId?: string) => void;
  remove: (productSlug: string, variantId?: string) => void;
  setQty: (productSlug: string, qty: number, variantId?: string) => void;
  clear: () => void;
  saved: string[];
  saveForLater: (productSlug: string) => void;
  moveToCart: (productSlug: string) => void;
  wishlist: string[];
  toggleWishlist: (slug: string) => void;
  inWishlist: (slug: string) => boolean;
  notify: (message: string) => void;
  mounted: boolean;
}

const CommerceContext = createContext<CommerceAPI | null>(null);
const LS_KEY = "naghsh-commerce-v1";

export function CommerceProvider({
  children,
  locale,
  addedLabel,
  savedLabel,
}: {
  children: ReactNode;
  locale: Locale;
  addedLabel: string;
  savedLabel: string;
}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);
  const toastId = useRef(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setLines(Array.isArray(data.lines) ? data.lines : []);
        setSaved(Array.isArray(data.saved) ? data.saved : []);
        setWishlist(Array.isArray(data.wishlist) ? data.wishlist : []);
      }
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ lines, saved, wishlist }));
    } catch {}
  }, [lines, saved, wishlist, mounted]);

  const notify = useCallback((message: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const add = useCallback(
    (productSlug: string, qty = 1, variantId?: string) => {
      setLines((ls) => {
        const i = ls.findIndex((l) => l.productSlug === productSlug && l.variantId === variantId);
        if (i >= 0) {
          const next = [...ls];
          next[i] = { ...next[i], qty: Math.min(99, next[i].qty + qty) };
          return next;
        }
        return [...ls, { productSlug, qty, variantId }];
      });
      const p = getProduct(productSlug);
      notify(
        p
          ? `${p.name[locale]} — ${addedLabel}`
          : addedLabel
      );
    },
    [addedLabel, locale, notify]
  );

  const remove = useCallback((productSlug: string, variantId?: string) => {
    setLines((ls) => ls.filter((l) => !(l.productSlug === productSlug && l.variantId === variantId)));
  }, []);

  const setQty = useCallback((productSlug: string, qty: number, variantId?: string) => {
    setLines((ls) =>
      qty <= 0
        ? ls.filter((l) => !(l.productSlug === productSlug && l.variantId === variantId))
        : ls.map((l) => (l.productSlug === productSlug && l.variantId === variantId ? { ...l, qty: Math.min(99, qty) } : l))
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const saveForLater = useCallback(
    (productSlug: string) => {
      setLines((ls) => ls.filter((l) => l.productSlug !== productSlug));
      setSaved((s) => (s.includes(productSlug) ? s : [...s, productSlug]));
      notify(savedLabel);
    },
    [notify, savedLabel]
  );

  const moveToCart = useCallback((productSlug: string) => {
    setSaved((s) => s.filter((x) => x !== productSlug));
    setLines((ls) =>
      ls.some((l) => l.productSlug === productSlug)
        ? ls
        : [...ls, { productSlug, qty: 1 }]
    );
  }, []);

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((w) => (w.includes(slug) ? w.filter((x) => x !== slug) : [...w, slug]));
  }, []);
  const inWishlist = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);

  const api: CommerceAPI = {
    lines,
    count,
    add,
    remove,
    setQty,
    clear,
    saved,
    saveForLater,
    moveToCart,
    wishlist,
    toggleWishlist,
    inWishlist,
    notify,
    mounted,
  };

  return (
    <CommerceContext.Provider value={api}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <span className="toast-check" aria-hidden="true">✓</span>
            {t.message}
          </div>
        ))}
      </div>
    </CommerceContext.Provider>
  );
}

export function useCommerce(): CommerceAPI {
  const ctx = useContext(CommerceContext);
  if (!ctx) throw new Error("useCommerce must be used inside CommerceProvider");
  return ctx;
}

/** total price helper for a list of cart lines */
export function cartSubtotal(lines: CartLine[], locale: Locale): number {
  return lines.reduce((sum, l) => {
    const p = getProduct(l.productSlug);
    if (!p) return sum;
    const variant = p.variants?.find((v) => v.id === l.variantId);
    const base = (p.salePrice ?? p.price)[locale];
    const delta = variant?.priceDelta?.[locale] ?? 0;
    return sum + (base + delta) * l.qty;
  }, 0);
}

export { formatPrice };
