import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "staffontime — Personal. Pünktlich. Geprüft.",
  description:
    "staffontime vermittelt qualifizierte Arbeitskräfte in Logistik, Hotellerie und Gebäudereinigung — transparent, geprüft, pünktlich.",
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
    title: "staffontime — Personal. Pünktlich. Geprüft.",
    description:
      "staffontime vermittelt qualifizierte Arbeitskräfte in Logistik, Hotellerie und Gebäudereinigung — transparent, geprüft, pünktlich.",
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
      <body className={`${manrope.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
