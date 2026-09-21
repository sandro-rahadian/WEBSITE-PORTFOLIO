import type { Metadata } from "next";
import { Outfit, Inter, EB_Garamond } from "next/font/google";
import { LenisProvider } from "@/components/LenisProvider";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "YanXin Zhang — Portfolio",
  description:
    "Interactive Design & Art Direction portfolio of YanXin Zhang. Building high-fidelity interactive software, bold brand identities, and sensory web experiences.",
  keywords: [
    "YanXin Zhang",
    "Art Direction",
    "Creative Development",
    "Interactive Design",
    "Design Systems",
    "WebGL",
  ],
  authors: [{ name: "YanXin Zhang" }],
  openGraph: {
    title: "YanXin Zhang — Portfolio",
    description:
      "Interactive Design & Art Direction portfolio of YanXin Zhang.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${ebGaramond.variable}`}
    >
      <body className="antialiased selection:bg-[var(--token-orange)] selection:text-[var(--token-black)]">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
