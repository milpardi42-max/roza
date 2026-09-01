# README-CMS — Rezi Atelier Content Layer

## آنچه ساخته شد (فاز ۲)
| خروجی | مسیر | شرح |
|---|---|---|
| پنل ادمین | `/fa/admin` | ویرایش متن‌های هیرو (fa/en)، مارکی، بنر ۹ صفحه + نقطهٔ فوکوس؛ ذخیرهٔ محلی، دانلود/ورود JSON |
| Seed محتوا | `content/cms/site-content.json` | منبع واحد (single source) محتوای قابل‌ویرایش — ساختار نسخه‌دار (`version: 1`) |

## جریان کاری فعلی (استاتیک)
1. در پنل ویرایش کن → «دانلود JSON»
2. فایل را در `content/cms/site-content.json` جایگزین کن (یا بفرست به توسعه‌دهنده)
3. `npm run build` → منتشر شود

## ارتقا به CMS واقعی (Headless) — برای بعدها
ساختار آماده است؛ کافی است یکی از این‌ها وصل شود:

**Sanity (پیشنهادی برای برندهای محتوامحور)**
```
NEXT_PUBLIC_CMS=sanity
SANITY_PROJECT_ID=xxx
SANITY_DATASET=production
SANITY_READ_TOKEN=sk...
```
- اسکیماهای آماده: `hero`, `marquee`, `pageBanner` (دقیقا همان فیلدهای seed)
- فایل page/dictionaries تنها با `getDictionary()` به sanity query مسیریابی شوند (یک نقطهٔ تنها)

**Strapi** (self-host)
```
NEXT_PUBLIC_CMS=strapi
STRAPI_URL=https://cms.yourdomain.com
STRAPI_TOKEN=...
```

- مسیر: `src/lib/i18n.ts` (در این فایل فقط خواندن دیکشنری تعویض می‌شود؛ بقیهٔ اپ دست نمی‌خورد).
- پنل ادمین فعلی می‌تواند به‌جای دانلود JSON، مستقیم به API همان CMS بنویسد (یک متد fetch در `AdminEditor`).

## امنیت
- `/fa/admin` با `robots: noindex` ساخته شده؛ برای production روی آن Basic-Auth یا Vercel Edge Middleware پسورد بگذارید (کد آماده در DEPLOY-PACKAGE.md).
