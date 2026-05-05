import type { Metadata } from 'next';
import { Bebas_Neue, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const plex = IBM_Plex_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-plex',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Night Ninjas — Shadow Tracker',
  description:
    'Local-first running training analysis. Quiet, disciplined work in the dark.',
  // No icons / Open Graph / etc — this app never goes online.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${plex.variable} ${jetbrains.variable}`}
    >
      <body className="bg-ink text-bone min-h-screen">{children}</body>
    </html>
  );
}
