import type { Metadata } from 'next';
import './globals.css';
import Header from './_components/atoms/Header';
import Footer from './_components/atoms/Footer';
import Providers from './providers';

const metadata: Metadata = {
  title: 'RumiClean',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main className="min-h-[calc(100dvh-68px)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
