import Footer from "@/app/_components/footer";
import Header from "@/app/_components/header";
import AdSpace from "@/app/_components/ad-space";
import { CMS_NAME, HOME_OG_IMAGE_URL, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#111827',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${CMS_NAME}`,
    default: `${CMS_NAME} - Cryptocurrency & Blockchain News`
  },
  description: SITE_DESCRIPTION,
  applicationName: CMS_NAME,
  referrer: 'origin-when-cross-origin',
  keywords: ['cryptocurrency', 'blockchain', 'bitcoin', 'ethereum', 'solana', 'defi', 'nft', 'crypto news'],
  authors: [{ name: CMS_NAME, url: SITE_URL }],
  creator: CMS_NAME,
  publisher: CMS_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    images: [HOME_OG_IMAGE_URL],
    title: `${CMS_NAME} - Cryptocurrency & Blockchain News`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: CMS_NAME,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${CMS_NAME} - Cryptocurrency & Blockchain News`,
    description: SITE_DESCRIPTION,
    images: [HOME_OG_IMAGE_URL],
    creator: '@cryptobitmag',
    site: '@cryptobitmag',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': `${SITE_URL}/feed.xml`,
    },
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
        
        {/* Organization Schema JSON-LD */}
        <Script id="organization-schema" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: CMS_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/favicon/android-chrome-512x512.png`,
            sameAs: [
              'https://twitter.com/cryptobitmag',
              'https://facebook.com/cryptobitmag',
              'https://linkedin.com/company/cryptobitmag',
              'https://instagram.com/cryptobitmag'
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'contact@cryptobitmag.com',
              contactType: 'customer service'
            }
          })}
        </Script>
        
        {/* Website Schema JSON-LD */}
        <Script id="website-schema" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: CMS_NAME,
            url: SITE_URL,
            potentialAction: {
              '@type': 'SearchAction',
              'target': `${SITE_URL}/posts?search={search_term_string}`,
              'query-input': 'required name=search_term_string'
            }
          })}
        </Script>
      </body>
    </html>
  );
}
