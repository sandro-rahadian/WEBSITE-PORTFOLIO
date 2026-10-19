import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/providers/SmoothScroll";
import ClickSpark from "@/components/ui/clickspark";

const switzer = localFont({
  src: [
    { path: "./fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Switzer-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Switzer-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-switzer",
  display: "swap",
  fallback: ["sans-serif"],
  adjustFontFallback: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  themeColor: "#050505",
};

export const metadata: Metadata = {
  title: "Sandro — Design & Build",
  description:
    "Independent designer and developer building precise digital products, brand systems and editorial web experiences.",
  authors: [{ name: "Sandro" }],
  openGraph: {
    title: "Sandro — Design & Build",
    description:
      "Independent designer and developer building precise digital products, brand systems and editorial web experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={switzer.variable}>
      <body className="bg-bg-dark text-white antialiased">
        <SmoothScroll>{children}</SmoothScroll>
        <ClickSpark />
      </body>
    </html>
  );
}
