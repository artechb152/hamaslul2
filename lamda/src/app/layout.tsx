import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "למדא | מחולל מערכי שיעור מקצועיים",
  description:
    "אפליקציית SaaS בעברית ליצירת מערכי שיעור והדרכות מקצועיים בעזרת AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="h-full scroll-smooth antialiased">
      <body className="min-h-full bg-[#05050b] text-white">{children}</body>
    </html>
  );
}
