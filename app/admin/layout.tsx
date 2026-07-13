import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Verwaltung, staffontime",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "staffontime",
  },
  icons: {
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0E141C",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
