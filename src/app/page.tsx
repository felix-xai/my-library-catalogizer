import Link from "next/link";
import { BookOpen, Sparkles, Database } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full py-12">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-8 ring-1 ring-indigo-200/50 shadow-sm">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Catalogizer</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900 mb-6 font-serif leading-tight">
          Your physical library,<br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">digitized instantly.</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-stone-600 mb-10 leading-relaxed">
          Snap a photo of your bookshelves. Our vision AI reads the spines—even in Tamil—and automatically fetches beautiful covers, authors, and metadata.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/upload"
            className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all hover:scale-105 active:scale-95 shadow-xl shadow-stone-900/10"
          >
            Start Digitzing
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-900 px-8 py-4 rounded-xl text-lg font-medium transition-all shadow-sm ring-1 ring-stone-200"
          >
            <BookOpen className="w-5 h-5 text-stone-400" />
            View Catalog
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-start hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-3">Vision AI Extraction</h3>
          <p className="text-stone-600 leading-relaxed">
            State-of-the-art vision models read tilted text, artistic fonts, and multiple languages natively—far outperforming traditional OCR.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-start hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-3">Google Books Sync</h3>
          <p className="text-stone-600 leading-relaxed">
            Raw titles are instantly cross-referenced with Google's massive database to pull in high-resolution cover art, ISBNs, and precise metadata.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-start hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-3">Local Privacy</h3>
          <p className="text-stone-600 leading-relaxed">
            Your shiny new catalog is saved to a fast, private local SQLite database right on your machine.
          </p>
        </div>
      </div>
    </div>
  );
}
