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
        <main className="h-[calc(100dvh-68px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
