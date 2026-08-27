import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MAISON NOIR — Luxury & Modern Fashion",
  description: "A premium luxury fashion e-commerce storefront.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" translate="no" className="scroll-smooth">

      <body className={`${display.variable} ${body.variable} font-body bg-paper text-ink selection:bg-brass/20 selection:text-ink antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

