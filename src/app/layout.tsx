import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { BookMarked, UploadCloud } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Library Catalogizer",
  description: "Digitize your bookshelf with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-stone-50 text-stone-900 min-h-screen flex flex-col`}>
        <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity">
              <BookMarked className="w-6 h-6 text-indigo-600" />
              <span>Library Catalogizer</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/upload"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Digitize Bookshelf</span>
              </Link>
            </div>
          </div>
        </nav>
        <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
