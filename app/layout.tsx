import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import '../styles/globals.scss';
import { AuthProvider } from '@/context/authContext';
import Header from '@/components/Header/Header';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const nunito = Nunito({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-nunito',
  weight: ['300', '400', '700'],
});

export const metadata: Metadata = {
  title: 'Scheduler',
  icons: {
    icon: '/favIcon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={nunito.variable}>
      <body>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
