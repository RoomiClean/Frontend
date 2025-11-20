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
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1.0, 
    user-scalable=0"
        />
      </head>
      <body>
        <Providers>
          <Header />
          <main
            className="min-h-[calc(100vh-68px)]"
            style={{
              overscrollBehavior: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
