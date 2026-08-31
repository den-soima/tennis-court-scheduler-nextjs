import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import '../styles/globals.scss';
import { AuthProvider } from '@/context/authContext';
import { AnnouncementModalProvider } from '@/context/announcementModalContext';
import Header from '@/components/Header/Header';
import AnnouncementModal from '@/components/AnnouncementModal/AnnouncementModal';
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
          <AnnouncementModalProvider>
            <Header />
            {children}
            <AnnouncementModal />
          </AnnouncementModalProvider>
        </AuthProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
