import type { Metadata } from "next";
import { IBM_Plex_Mono, Playfair_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  weight: ["700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

// Vercel injects this at build time with the actual production domain, so
// the Open Graph image below resolves to a real absolute URL without
// hardcoding a domain that could drift out of sync with the real deployment.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Camille & Scott's Baby Pool",
  description: "FBA Class of 2027 baby pool for Camille & Scott's little one.",
  openGraph: {
    title: "Camille & Scott's Baby Pool",
    description:
      "FBA Class of 2027 baby pool for Camille & Scott's little one.",
    images: [
      {
        url: "/images/og-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Camille and Scott singing karaoke, cartoon illustration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Camille & Scott's Baby Pool",
    description:
      "FBA Class of 2027 baby pool for Camille & Scott's little one.",
    images: ["/images/og-preview.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${plexMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NavBar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
