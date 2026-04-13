import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { siteMetadata } from '@/data/metadata';
import { NAV_LINKS } from '@/data/navigation';
import { socialLinks } from '@/data/social';
import './globals.css';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans-face' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono-face' });

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-pure-white font-geist-sans text-vercel-black antialiased">
        <Header siteName={siteMetadata.name} navLinks={NAV_LINKS} />
        <main>{children}</main>
        <Footer authorName={siteMetadata.author.name} socialLinks={socialLinks} />
      </body>
    </html>
  );
}
