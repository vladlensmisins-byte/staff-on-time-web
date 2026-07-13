import type { Metadata } from "next";
import { Inter, Manrope, Outfit } from "next/font/google";
import ScrollToTopOnLoad from "@/components/ScrollToTopOnLoad";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "staffontime, Personal. Pünktlich. Geprüft.",
  description:
    "staffontime vermittelt qualifizierte Arbeitskräfte in Logistik, Hotellerie, Reinigung & Fabrik, transparent, geprüft, pünktlich.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "staffontime",
  },
  icons: {
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "staffontime, Personal. Pünktlich. Geprüft.",
    description:
      "staffontime vermittelt qualifizierte Arbeitskräfte in Logistik, Hotellerie, Reinigung & Fabrik, transparent, geprüft, pünktlich.",
    images: ["/assets/og-image.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${manrope.variable} ${outfit.variable} ${inter.variable}`}>
        <ScrollToTopOnLoad />
        {children}
      </body>
    </html>
  );
}
