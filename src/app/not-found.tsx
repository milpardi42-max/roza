import type { Metadata } from "next";

export const metadata: Metadata = { title: "۴۰۴ — رزی آتلیه" };

export default function RootNotFound() {
  return (
    <html lang="fa" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "inherit",
          background: "#faf9f6",
          color: "#1a2332",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "26rem", padding: "2rem" }}>
          <p style={{ fontSize: "4rem", fontWeight: 800, margin: "0 0 .5rem", color: "#a05d24" }}>۴۰۴</p>
          <p style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>این صفحه پیدا نشد</p>
          <p style={{ color: "#7d7163", fontSize: ".95rem" }}>صفحهٔ مورد نظر در لغت انتخاب‌شده موجود نیست.</p>
          <nav style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginTop: "1.25rem" }}>
            <a href="/fa" style={{ color: "#2e4a5c", fontWeight: 700 }}>خانه 🇮🇷 فارسی</a>
            <a href="/en" style={{ color: "#2e4a5c", fontWeight: 700 }}>Home — English</a>
          </nav>
        </div>
      </body>
    </html>
  );
}
