// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "EternalTime — Магазин часов",
  description: "Интернет-магазин часов. Быстро, удобно, надёжно.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className="bg-[color:var(--page-bg)] text-[color:var(--page-fg)] antialiased">
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.9),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.8),transparent_55%)]" />
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="container flex-1 py-10 md:py-16">{children}</main>
            <Footer />
          </div>
        </div>
        <CookieBanner />
      </body>
    </html>
  );
}
