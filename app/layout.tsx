import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HN Side Fund - Profitable Side Projects from Hacker News",
    template: "%s | HN Side Fund",
  },
  description: "Discover and explore profitable side projects shared on Hacker News. Browse projects making $500+/mo, filter by tech stack, and find inspiration for your next venture. Updated daily from HN discussions.",
  keywords: [
    "side projects",
    "hacker news",
    "profitable projects",
    "startup ideas",
    "indie hacker",
    "side hustle",
    "passive income",
    "tech projects",
    "revenue projects",
    "show hn",
    "side business",
    "entrepreneurship",
  ],
  authors: [{ name: "HN Side Fund" }],
  creator: "HN Side Fund",
  publisher: "HN Side Fund",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "HN Side Fund - Profitable Side Projects from Hacker News",
    description: "Discover profitable side projects making $500+/mo shared on Hacker News. Browse by tech stack, revenue, and year.",
    siteName: "HN Side Fund",
  },
  twitter: {
    card: "summary_large_image",
    title: "HN Side Fund - Profitable Side Projects from Hacker News",
    description: "Discover profitable side projects making $500+/mo shared on Hacker News.",
    creator: "@hnsidefund",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
