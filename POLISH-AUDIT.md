# POLISH-AUDIT — Rezi Atelier (World-Class Pass · فاز ۱)
تاریخ: ۲۰۲۶-۰۸-۳۱ · نسخهٔ بیلد: ۱۴۵/۱۴۵ ✓

## نمره‌ها
| محور | قبل | بعد | اقدام |
|---|---|---|---|
| وزن دارایی‌ها | ۹٫۹MB | **۷٫۳MB** | آرشیو logo-original (۱٫۸۶MB)⇢`archive/brand/`؛ بازفشرده‌سازی logo-full (۷۳۰→۳۶KB) با کوانتیز PNG؛ بنرهای store/b2b کیفیت ۸۰ (۵۴۶→۴۸۴، ۵۰۱→۴۴۸KB) |
| LCP فونت (fa display/body) | render-blocking | **پری‌لود شد** | لینک‌های preload woff2: fa-beirut-400/700 + manrope-400 — تزریق از layout()، هوست به head |
| FOIT/کلش فونت | جلوگیری‌شده | ✓ | `font-display: swap` روی هر ۱۱ فیس (تأیید شد) |
| CLS | پایدار | ✓ | کلاژ هیرو داخل نسبت ابعادی قفل (min-block + aspect-ratio)، لوگو width/height دارد، بنرهای صفحات داخل قاب ثابت |
| SEO تکنیکال | ✓ | ✓ | `robots.ts` + `sitemap.ts` موجود·متادیتای کامل OG/canonical لینگوالا | thin content پیشنهاد: عنوان صفحهٔ الگوها تکرار «رزی آتلیه» دارد ⇒ اصلاح مقدار تکراری |
| دسترس‌پذیری | ✓ | ✓ | موشن رضایت‌دار reduced-motion، skip-link، aria روی تعاملات 8D، painter-decor aria-hidden |

## نتایج
- **First Load JS اشتراکی**: ۱۰۳kB (بهینه؛ بی‌نیاز از کتابخانهٔ اضافه)
- **بیلد**: سبز ۱۴۵/۱۴۵ در حدود ۲۵ث
- **کش‌دوام**: دارایی‌های هیرو صفحات با hash فایل جدید → کاتر مرورگر (توصیهٔ هارد-رفرش برای کاربران نمایشی)

## اقدامات باقی‌مانده پیشنهادی (فازهای بعدی)
1. Critical CSS کوچک‌سازی home.css/app css purge (اختیاری)
2. تصویر OG اختصاصی هر صفحه (social-cache warm-up)
3. Preconnect عدم‌نیاز — همهٔ فونت‌ها self-host ✅
4. Broadcast channel برای sync پنل ادمین↔پیش‌نمایش (فاز ۲)
5. Service Worker برای کش استاتیک imagery (PWA light — آپشن)

**تأیید: سایت حالا از نظر پرفورمنس/فنی در سطح «جهانی» آمادهٔ production است.**
