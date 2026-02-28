"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Check, X, BookOpen, Trash2 } from "lucide-react";
import Link from "next/link";

interface PendingBook {
    id: number;
    title: string;
    author: string;
    cover_url: string | null;
    isbn: string | null;
    publisher: string | null;
    page_count: number | null;
    action?: 'save' | 'delete';
}

function ReviewContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const jobId = searchParams.get("jobId");

    const [books, setBooks] = useState<PendingBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!jobId) {
            router.push("/upload");
            return;
        }

        const fetchBooks = async () => {
            try {
                const res = await fetch(`/api/review?jobId=${jobId}`);
                if (!res.ok) throw new Error("Failed to load extracted books");
                const data = await res.json();

                // Add default save action
                const mapped = data.books.map((b: any) => ({ ...b, action: 'save' }));
                setBooks(mapped);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [jobId, router]);

    const handleUpdate = (id: number, field: 'title' | 'author', value: string) => {
        setBooks(prev => prev.map(book =>
            book.id === id ? { ...book, [field]: value } : book
        ));
    };

    const toggleAction = (id: number) => {
        setBooks(prev => prev.map(book =>
            book.id === id ? { ...book, action: book.action === 'save' ? 'delete' : 'save' } : book
        ));
    };

    const saveToCatalog = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ books, jobId })
            });

            if (!res.ok) throw new Error("Failed to save to catalog");

            router.push('/catalog');
        } catch (err: any) {
            setError(err.message);
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                <p className="text-xl text-stone-600 animate-pulse font-medium">Reading the spines...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-md text-center">
                    <h2 className="text-xl font-bold mb-2">Oops!</h2>
                    <p>{error}</p>
                    <Link href="/upload" className="mt-4 inline-block underline hover:text-red-800 transition-colors">
                        Try uploading again
                    </Link>
                </div>
            </div>
        );
    }

    if (books.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
                <h2 className="text-2xl font-bold text-stone-900 mb-2">No books found!</h2>
                <p className="text-stone-600 max-w-md">Our AI couldn't clearly read any titles from the image you provided. Make sure the image is well-lit and the text on the spines is legible.</p>
                <Link href="/upload" className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition">
                    Upload Another Photo
                </Link>
            </div>
        );
    }

    const booksToSave = books.filter(b => b.action === 'save').length;

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-stone-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900 font-serif mb-2">Review & Edit</h1>
                    <p className="text-stone-600">
                        We found {books.length} potential books. You can correct any typos the AI made, or delete incorrect ones before saving to your catalog.
                    </p>
                </div>
                <button
                    onClick={saveToCatalog}
                    disabled={saving || booksToSave === 0}
                    className="bg-stone-900 disabled:bg-stone-300 disabled:text-stone-500 hover:bg-stone-800 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 flex-shrink-0 shadow-sm"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    <span>Save {booksToSave} Books</span>
                </button>
            </div>

            <div className="space-y-4">
                {books.map(book => {
                    const isDeleted = book.action === 'delete';

                    return (
                        <div
                            key={book.id}
                            className={`bg-white rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center transition-all ${isDeleted ? 'opacity-50 grayscale ring-0 shadow-none border-stone-100 bg-stone-50' : 'shadow-sm ring-1 ring-stone-200 hover:shadow-md'
                                }`}
                        >
                            <div className="w-20 h-28 bg-stone-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 ring-1 ring-stone-200">
                                {book.cover_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={book.cover_url} alt={`Cover of ${book.title}`} className="object-cover w-full h-full" />
                                ) : (
                                    <BookOpen className="w-8 h-8 text-stone-300" />
                                )}
                            </div>

                            <div className="flex-1 w-full space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Title</label>
                                    <input
                                        type="text"
                                        value={book.title}
                                        onChange={(e) => handleUpdate(book.id, 'title', e.target.value)}
                                        disabled={isDeleted}
                                        className={`w-full text-lg font-bold bg-transparent border-b-2 border-transparent transition-colors focus:outline-none focus:ring-0 px-0 py-1 ${isDeleted ? 'text-stone-500' : 'text-stone-900 border-stone-200 focus:border-indigo-600 hover:border-stone-300'}`}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Author</label>
                                    <input
                                        type="text"
                                        value={book.author}
                                        onChange={(e) => handleUpdate(book.id, 'author', e.target.value)}
                                        disabled={isDeleted}
                                        placeholder="Unknown Author"
                                        className={`w-full text-base bg-transparent border-b-2 border-transparent transition-colors focus:outline-none focus:ring-0 px-0 py-1 ${isDeleted ? 'text-stone-400' : 'text-stone-600 border-stone-100 focus:border-indigo-400 hover:border-stone-300'}`}
                                    />
                                </div>
                            </div>

                            <div className="w-full sm:w-auto flex justify-end">
                                <button
                                    onClick={() => toggleAction(book.id)}
                                    className={`p-3 rounded-xl transition-colors ${isDeleted
                                        ? 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                                        }`}
                                    aria-label={isDeleted ? "Restore book" : "Delete book"}
                                >
                                    {isDeleted ? <Check className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function ReviewPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                <p className="text-xl text-stone-600 animate-pulse font-medium">Loading...</p>
            </div>
        }>
            <ReviewContent />
        </Suspense>
    );
}
