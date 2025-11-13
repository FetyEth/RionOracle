// app/layout.tsx
import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CookieConsent } from "@/components/cookie-consent";
import { WalletProvider } from "@/components/wallet-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
const sora = Sora({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL("https://rion-oracle.com"),
  applicationName: "RION Oracle",
  category: "technology",
  viewport: "width=device-width, initial-scale=1",
  keywords: [
    "RION",
    "Oracle Network",
    "BNB Chain",
    "price feeds",
    "on-chain data",
    "disputes",
    "insurance",
    "finality",
    "SDK",
  ],
  title:
    "RION | The Oracle Layer driving trusted data for the world’s markets.",
  description:
    "RION is the Oracle Layer driving trusted data for the world’s markets — real-time price & outcome feeds, deterministic proofs, and insured finality.",
  openGraph: {
    type: "website",
    siteName: "RION",
    locale: "en_US",
    url: "https://rion-oracle.com/",
    title:
      "RION | The Oracle Layer driving trusted data for the world’s markets.",
    description:
      "Real-time price & outcome feeds with evidence — click to verify, challenge on fault, settle with insured finality.",
    images: [
      {
        url: "https://rion-oracle.com/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "RION — The Oracle Layer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@RionOracle",
    creator: "@RionOracle",
    title:
      "RION | The Oracle Layer driving trusted data for the world’s markets.",
    description:
      "Evidence-backed oracle data for markets: prices, outcomes, and proofs — finalized with insurance.",
    images: ["https://rion-oracle.com/thumbnail.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${sora.variable} font-sans antialiased`}
      >
        <WalletProvider>{children}</WalletProvider>
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  );
}
