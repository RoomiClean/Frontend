import type { Metadata } from 'next';
import './globals.css';
import Header from './_components/atoms/Header';
import Footer from './_components/atoms/Footer';

export const metadata: Metadata = {
  title: 'RumiClean',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
