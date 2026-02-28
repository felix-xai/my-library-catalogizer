import { initializeDb } from '@/lib/db';
import Link from 'next/link';
import { BookOpen, Search, UploadCloud, Layers } from 'lucide-react';

// Force dynamic rendering since we are reading from SQLite
export const revalidate = 0;

export default async function CatalogPage() {
    const db = await initializeDb();

    // Fetch all active books from the library
    const books = await db.all(`
    SELECT * FROM books 
    WHERE status = 'active'
    ORDER BY created_at DESC
  `);

    if (books.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                    <Layers className="w-10 h-10 text-stone-400" />
                </div>
                <h1 className="text-3xl font-bold text-stone-900 font-serif mb-4">Your Library is Empty</h1>
                <p className="text-stone-600 max-w-md text-lg mb-8">
                    You haven't scanned any bookshelves yet. Let's digitize your first shelf using our AI!
                </p>
                <Link
                    href="/upload"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2"
                >
                    <UploadCloud className="w-5 h-5" />
                    <span>Scan a Bookshelf</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-stone-200 pb-6">
                <div>
                    <h1 className="text-4xl font-bold text-stone-900 font-serif mb-2">My Library</h1>
                    <p className="text-stone-600">
                        You have {books.length} book{books.length === 1 ? '' : 's'} in your collection.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search catalog..."
                            className="pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-64"
                        />
                    </div>
                    <Link
                        href="/upload"
                        className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                    >
                        + Add Books
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {books.map((book) => (
                    <div key={book.id} className="group relative flex flex-col gap-3">
                        <div className="aspect-[2/3] w-full bg-stone-100 rounded-xl overflow-hidden shadow-sm ring-1 ring-black/5 group-hover:shadow-lg transition-all group-hover:-translate-y-1 flex items-center justify-center relative">
                            {book.cover_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={book.cover_url}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col justify-center items-center h-full w-full p-4 bg-gradient-to-br from-stone-50 to-stone-200 text-center">
                                    <h3 className="font-bold text-stone-700 text-sm line-clamp-3 mb-2 font-serif">{book.title}</h3>
                                    <p className="text-xs text-stone-500 line-clamp-2">{book.author}</p>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <button className="bg-white/90 hover:bg-white text-stone-900 text-xs font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    Details
                                </button>
                            </div>
                        </div>

                        <div className="px-1">
                            <h3 className="font-bold text-stone-900 text-sm leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors" title={book.title}>
                                {book.title}
                            </h3>
                            <p className="text-xs text-stone-500 mt-1 line-clamp-1 truncate" title={book.author}>
                                {book.author || 'Unknown Author'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
