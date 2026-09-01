import type { Metadata } from "next";
import { readFile } from "fs/promises";
import path from "path";
import { AdminEditor } from "@/components/adm/AdminEditor";

export function generateStaticParams() {
  return [{ lang: "fa" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Admin — Rezi Atelier",
    robots: { index: false, follow: false },
  };
}

export default async function AdminPage() {
  let initial: unknown = null;
  const missing: string[] = [];
  try {
    const raw = await readFile(path.join(process.cwd(), "content/cms/site-content.json"), "utf-8");
    initial = JSON.parse(raw);
  } catch {
    missing.push("content/cms/site-content.json");
  }

  return (
    <main className="section" style={{ paddingBlock: "var(--space-8)" }}>
      <style>{`header.site-header{display:none}footer.site-footer{display:none}`}</style>
      <div className="container">
        <h1 className="section-head-title" style={{ marginBlockEnd: "var(--space-6)" }}>پنل مدیریت محتوا — رزی آتلیه</h1>
        {initial ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <AdminEditor initial={initial as any} missing={missing} />
        ) : (
          <p>فایل محتوای CMS پیدا نشد؛ ابتدا seed بسازید.</p>
        )}
      </div>
    </main>
  );
}
