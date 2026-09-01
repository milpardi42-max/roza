/**
 * BASE_PATH handling for GitHub Pages and custom domains
 * در حالت عادی خالی است، در GitHub Pages مقدارش /roza است
 */

export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

export function asset(path: string): string {
  if (!path) return path;
  // اگر قبلاً کامل است یا data URI است
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  // اگر قبلاً با BASE_PATH شروع شده
  if (BASE_PATH && path.startsWith(`${BASE_PATH}/`)) {
    return path;
  }
  // اگر مسیر مطلق است (/assets/...)، BASE_PATH را اضافه کن
  if (path.startsWith("/")) {
    return `${BASE_PATH}${path}`;
  }
  return path;
}

/**
 * برای استفاده در metadata و لینک‌های استاتیک
 */
export function withBase(path: string): string {
  return asset(path);
}
