import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Space_Grotesk, Outfit, Sora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://portable.app'),
  title: {
    default: "Portable — Financial Platform for Gig Workers",
    template: "%s | Portable",
  },
  description: "Track income, manage taxes, and build financial stability as a gig worker. Automatic income tracking from Uber, DoorDash, Upwork, and 50+ platforms. Free to start.",
  keywords: [
    "gig worker finance",
    "uber driver income",
    "doordash taxes",
    "freelancer budgeting",
    "gig economy",
    "1099 income tracker",
    "independent contractor finance",
    "rideshare driver finances",
    "delivery driver income",
    "freelance income tracking",
  ],
  authors: [{ name: "Portable" }],
  creator: "Portable",
  publisher: "Portable",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portable.app",
    siteName: "Portable",
    title: "Portable — Financial Platform for Gig Workers",
    description: "Track income, manage taxes, and build financial stability. Automatic income tracking from 50+ gig platforms.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Portable - Financial Platform for Gig Workers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portable — Financial Platform for Gig Workers",
    description: "Track income, manage taxes, and build financial stability as a gig worker. Free to start.",
    images: ["/og-image.png"],
    creator: "@getportable",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          defer
          data-domain="portable.app"
          src="https://plausible.io/js/script.js"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${spaceGrotesk.variable} ${outfit.variable} ${sora.variable} antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
