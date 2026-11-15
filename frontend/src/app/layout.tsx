import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import { BackToTop } from "@/components/layout/back-to-top";
import { Providers } from "@/app/providers";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-jari-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-jari-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jari | Farm intelligence for poultry farmers",
  description: "Organize poultry farm records, understand operations and prepare for financial opportunities with Jari.",
  icons: {
    icon: { url: "/logo/JARI_navbar_logo.png", type: "image/png" },
    shortcut: { url: "/logo/JARI_navbar_logo.png", type: "image/png" },
    apple: { url: "/logo/JARI_navbar_logo.png", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sourceSans.variable} ${newsreader.variable}`}>
        <Providers>
          {children}
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
