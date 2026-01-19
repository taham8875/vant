import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vant Finance',
  description: 'Personal finance tracking application',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
