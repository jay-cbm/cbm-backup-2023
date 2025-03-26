import Footer from "@/app/_components/footer";
import Header from "@/app/_components/header";
import AdSpace from "@/app/_components/ad-space";
import { CMS_NAME, HOME_OG_IMAGE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://cryptobitmag.com'),
  title: `${CMS_NAME} - Cryptocurrency & Blockchain News`,
  description: `${CMS_NAME} is your trusted source for cryptocurrency and blockchain news, insights, and expert interviews.`,
  openGraph: {
    images: [HOME_OG_IMAGE_URL],
    title: `${CMS_NAME} - Cryptocurrency & Blockchain News`,
    description: `${CMS_NAME} is your trusted source for cryptocurrency and blockchain news, insights, and expert interviews.`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${CMS_NAME} - Cryptocurrency & Blockchain News`,
    description: `${CMS_NAME} is your trusted source for cryptocurrency and blockchain news, insights, and expert interviews.`,
    images: [HOME_OG_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#e11d48" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#111827" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Header />
            {/* Ad space at the top of the site */}
            <AdSpace position="horizontal" className="my-4" />
            {children}
          </div>
        </div>
        {/* Ad space right above the footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSpace position="horizontal" className="border-t pt-8" />
        </div>
        <Footer />
      </body>
    </html>
  );
}
