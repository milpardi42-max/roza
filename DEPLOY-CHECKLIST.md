# DEPLOY CHECKLIST — Rezi Atelier → Production

## ۱ · هاست (پیشنهادی: Vercel)
- [ ] `vercel` در ریشهٔ `naghsh/` → Framework: Next.js (auto)
- [ ] Build command: `npm run build` · Output: auto
- [ ] Node 20+
- [ ] Preview URL: `*.vercel.app` (دموی fa + admin کار می‌کند)

## ۲ · دامنه
- [ ] خرید `reziatelier.com` (یا .ir) — پیشنهاد: Cloudflare/Namecheap
- [ ] در Vercel → Domains → add → رکورد A: `76.76.21.21` + CNAME `www → cname.vercel-dns.com`
- [ ] HTTPS خودکار Let's Encrypt فعال است
- [ ] ریدایرکت `www → apex` + `en defaultLocale redirect` بررسی شود (در next.config موجود است)

## ۳ · متغیرهای محیطی (.env.example مرجع)
- [ ] `NEXT_PUBLIC_CMS` (فعلاً خالی=فایل محلی؛ بعداً sanity|strapi)
- [ ] `NEXT_PUBLIC_SITE_URL=https://reziatelier.com` (برای sitemap/robots/OG)

## ۴ · محتوا و سئو
- [ ] CMS JSON نهایی جایگزین `content/cms/site-content.json` → rebuild
- [ ] متای OG تصویر `public/assets/brand/og-default.jpg` (در صورت نیاز بساز: 1200×630 از لوگو روی عاج)
- [ ] sitemap.xml + robots.txt: سایت لایو → ثبت در Google Search Console + Bing Webmaster
- [ ] hreflang fa/en جفت‌به‌جفت ✅ (در metadata موجود است)
- [ ] `/fa/admin` → noindex ✅ + **(اختیاری ولی توصیه‌شده)** Edge Middleware Basic-Auth:
```ts
// src/middleware.ts
import { NextResponse } from 'next/server'
export function middleware(req) {
  if (!req.nextUrl.pathname.startsWith('/fa/admin')) return
  const auth = req.headers.get('authorization')
  const [u,p] = atob(auth?.split(' ')[1] ?? '').split(':')
  if (u===process.env.ADMIN_USER && p===process.env.ADMIN_PASS) return
  return new NextResponse('Auth required', {status:401, headers:{'WWW-Authenticate':'Basic'}})
}
export const config = { matcher: ['/fa/admin/:path*'] }
```

## ۵ · عملکرد
- [ ] Lighthouse production: هدف Perf ≥90 / A11y ≥95 / SEO 100
- [ ] تصاویر hero/banners از قبل بهینه‌اند (public 7.3MB) — تصویر جدید فقط ≤250KB WebP/JPEG q80
- [ ] `next/image` برای تصاویر جدید، ابعاد ثابت

## ۶ · تحویل و پشتیبانی
- [ ] برنچ `main` → Vercel production · PRها → preview
- [ ] مالکیت پروژه در اکانت Vercel کارفرما منتقل شود
- [ ] پنجرهٔ پشتیبانی ۱۴ روزه پس از لانچ (باگ‌فیکس رایگان)
- [ ] آموزش ۳۰ دقیقه‌ای پنل ادمین + README-CMS.md تحویل

## ۷ · لایسنس‌ها
- [ ] قل‌ها: Baloo Bhaijaan 2 / Beiruti / Manrope = OFL ✅ (فایل LICENSE فونت‌ها در `/public/fonts/licenses/` نگه‌داشته شود)
- [ ] لوگو/کالاژ: ساخت اختصاصی — IPL مالکیت به کارفرما منتقل شود
