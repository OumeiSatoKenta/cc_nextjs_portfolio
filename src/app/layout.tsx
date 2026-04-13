import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { siteMetadata } from '@/data/metadata';
import { socialLinks } from '@/data/social';
import { NAV_LINKS } from '@/data/navigation';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.url),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.name}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.url,
    siteName: siteMetadata.name,
    images: [
      {
        url: siteMetadata.ogImage,
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-pure-white font-geist-sans text-vercel-black antialiased">
        <Header siteName={siteMetadata.name} navLinks={NAV_LINKS} />
        <main>{children}</main>
        <Footer authorName={siteMetadata.author.name} socialLinks={socialLinks} />
      </body>
    </html>
  );
}
